import { message } from 'antd'
import {
  query,
  queryDetail,
  finish,
  add,
  remove,
  edit
} from 'services/deliveryOrder/deliveryOrder'
import { lstorage } from 'utils'
import pathToRegexp from 'path-to-regexp'

const success = () => {
  message.success('Success')
}

export default {
  namespace: 'deliveryOrder',

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
        const { pathname, query } = location
        const { page, pageSize } = query

        if (pathname === '/delivery-order') {
          dispatch({
            type: 'query',
            payload: {
              relationship: 1,
              page,
              pageSize,
              q: null
            }
          })
        }
        const match = pathToRegexp('/delivery-order-detail/:id').exec(location.pathname)
        if (match) {
          dispatch({
            type: 'queryDetail',
            payload: {
              id: decodeURIComponent(match[1])
            }
          })
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
      // type=all&status=0&active=1
      payload.type = 'all'
      payload.status = '0'
      payload.active = '1'
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
    * queryDetail ({ payload = {} }, { call, put }) {
      const response = yield call(queryDetail, payload)
      if (response && response.success) {
        yield put({
          type: 'updateState',
          payload: {
            currentItem: response.data
          }
        })
      }
    },
    * finish ({ payload = {} }, { call, put }) {
      const response = yield call(finish, payload)
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
    * delete ({ payload = {} }, { call, put, select }) {
      const response = yield call(remove, payload)
      const pagination = yield select(({ deliveryOrder }) => deliveryOrder.pagination)
      const { current, pageSize } = pagination
      if (response && response.success) {
        yield put({
          type: 'updateState',
          payload: {
            currentItem: response.data
          }
        })
        yield put({ type: 'query', payload: { ...payload, page: current, pageSize } })
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
        yield put({ type: 'queryByStore' })
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
    * queryByStore ({ payload = {} }, { put }) {
      payload.edit = 0
      yield put({ type: 'query', payload: { type: 'all', storeId: lstorage.getCurrentUserStore() } })
    },
    * openModal ({ payload = {} }, { put }) {
      payload.updated = 0
      yield put({
        type: 'updateState',
        payload: {
          modalVisible: true
        }
      })
      yield put({ type: 'queryByStore' })
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
