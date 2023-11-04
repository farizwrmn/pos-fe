import { message } from 'antd'
import {
  query,
  add,
  remove,
  edit
} from 'services/planogram/planogram'

const success = () => {
  message.success('Success')
}

export default {
  namespace: 'planogram',

  state: {
    list: [],
    activeKey: '0',
    currentItem: {},
    modalVisible: false,
    modalEditVisible: false,
    show: false,
    checked: false,
    modalType: 'add',
    pagination: {
      current: 1,
      pageSize: 10,
      total: 0,
      showSizeChanger: true
    }
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        const { pathname } = location
        // const { activeKey, edit, ...other } = location.query
        if (pathname === '/stock') {
          dispatch({ type: 'query' })
        }
      })
    }
  },

  effects: {
    * switchIsChecked ({ payload = {} }, { put }) {
      yield put({
        type: 'updateState',
        payload: {
          checked: payload
        }
      })
    },
    * query ({ payload = {} }, { call, put }) {
      const response = yield call(query, payload)
      if (response && response.success) {
        yield put({
          type: 'updateState',
          payload: {
            list: response.data,
            pagination: {
              current: Number(payload.page) || 1,
              pageSize: Number(payload.pageSize) || 10,
              total: response.total
            }
          }
        })
      }
    },
    * add ({ payload = {} }, { call, put }) {
      const response = yield call(add, payload)
      if (response && response.success) {
        success()
        yield put({
          type: 'updateState',
          payload: {
            currentItem: response.data
          }
        })
      }
    },
    * delete ({ payload = {} }, { call, put }) {
      const response = yield call(remove, payload)
      if (response && response.success) {
        yield put({
          type: 'updateState',
          payload: {
            currentItem: response.data
          }
        })
      } else {
        throw response
      }
    },
    * edit ({ payload = {} }, { call, put }) {
      const response = yield call(edit, payload)
      if (response && response.success) {
        if (payload.resetFields) {
          payload.resetFields()
        }
        success()
        yield put({
          type: 'updateState',
          payload: {
            currentItem: {},
            modalType: 'add',
            activeKey: '0'
          }
        })
        yield put({ type: 'query' })
      } else {
        message.error("can't edit data")
      }
    },
    * editItem ({ payload = {} }, { put }) {
      yield put({
        type: 'updateState',
        payload: {
          currentItem: payload,
          modalType: 'edit',
          activeKey: '0'
        }
      })
    },
    * openModal ({ payload = {} }, { put }) {
      payload.updated = 0
      yield put({
        type: 'updateState',
        payload: {
          modalVisible: true
        }
      })
      yield put({ type: 'query' })
    },
    * closeModal ({ payload = {} }, { put }) {
      payload.updated = 0
      yield put({
        type: 'updateState',
        payload: {
          modalVisible: false
        }
      })
    },
    * openModalEdit ({ payload = {} }, { put }) {
      payload.updated = 0
      yield put({
        type: 'updateState',
        payload: {
          modalEditVisible: true
        }
      })
    },
    * closeModalEdit ({ payload = {} }, { put }) {
      payload.updated = 0
      yield put({
        type: 'updateState',
        payload: {
          modalEditVisible: false
        }
      })
    }
  },

  reducers: {
    updateState (state, { payload }) {
      return { ...state, ...payload }
    },
    querySuccess (state, action) {
      const { list, pagination } = action.payload
      return {
        ...state,
        list,
        pagination: {
          ...state.pagination,
          ...pagination
        }
      }
    }
  }
}
