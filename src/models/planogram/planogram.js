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
        const { activeKey, edit, ...other } = location.query
        if (pathname === '/stock') {
          dispatch({ type: 'query', payload: other })
        }
      })
    }
  },

  effects: {
    * changeTab ({ payload = {} }, { put }) {
      yield put({
        type: 'updateState',
        payload: {
          activeKey: payload
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
    * remove ({ payload = {} }, { call, put }) {
      const response = yield call(remove, payload)
      if (response && response.success) {
        yield put({
          type: 'updateState',
          payload: {
            currentItem: response.data
          }
        })
      }
    },
    * edit ({ payload = {} }, { call, put }) {
      const response = yield call(edit, payload)
      if (response && response.success) {
        success()
        yield put({
          type: 'updateState',
          payload: {
            currentItem: response.data
          }
        })
      }
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
