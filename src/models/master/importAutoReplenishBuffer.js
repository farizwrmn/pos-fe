import modelExtend from 'dva-model-extend'
import { message } from 'antd'
import {
  queryTransferOut,
  query,
  add,
  remove
} from 'services/master/importAutoReplenishBuffer'
import { pageModel } from 'common'
import { lstorage } from 'utils'
import { routerRedux } from 'dva/router'

const success = () => {
  message.success('Product Buffer has been saved')
}

export default modelExtend(pageModel, {
  namespace: 'importAutoReplenishBuffer',

  state: {
    currentItem: {},
    modalType: 'add',
    list: [],
    listAutoReplenish: [],
    listImported: [],
    pagination: {
      pageSizeOptions: ['50', '100', '500', '1000'],
      showSizeChanger: true,
      showQuickJumper: true,
      current: 1
    }
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        const { ...other } = location.query
        const { pathname } = location
        if (pathname === '/inventory/transfer/auto-replenish-import') {
          if (!other.storeId) {
            other.storeId = lstorage.getCurrentUserStore()
          }
          dispatch({ type: 'query', payload: other })
        }
      })
    }
  },

  effects: {

    * queryTransferOut ({ payload = {} }, { call, put }) {
      const data = yield call(queryTransferOut, payload)
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            listImported: data.data
          }
        })
      } else {
        throw data
      }
    },

    * downloadData ({ payload = {} }, { call, put }) {
      const response = yield call(query, { storeId: payload.storeId, type: 'all' })
      if (response.success) {
        yield put({
          type: 'updateState',
          payload: {
            listAutoReplenish: response.data
          }
        })
      }
    },

    * query ({ payload = {} }, { call, put }) {
      payload.order = '-id'
      const data = yield call(query, payload)
      if (data.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            list: data.data,
            pagination: {
              current: Number(data.page) || 1,
              pageSize: Number(data.pageSize) || 10,
              total: data.total
            }
          }
        })
      }
    },

    * add ({ payload }, { call, put }) {
      payload.header = { storeId: payload.storeId, fileType: payload.fileType }
      const data = yield call(add, payload)
      if (data.success) {
        success()
        yield put({
          type: 'updateState',
          payload: {
            modalType: 'add',
            currentItem: {}
          }
        })
        yield put(routerRedux.push(`/inventory/transfer/auto-replenish-import?storeId=${payload.storeId}`))
        yield put({
          type: 'query',
          payload: {
            storeId: payload.storeId
          }
        })
      } else {
        yield put({
          type: 'updateState',
          payload: {
            currentItem: payload
          }
        })
        throw data
      }
    },
    * remove ({ payload }, { call, put }) {
      const response = yield call(remove, payload.data.id)
      if (response.success) {
        yield put({ type: 'query', payload: payload.otherQuery })
      } else {
        throw response
      }
    }
  },

  reducers: {
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
    },

    updateState (state, { payload }) {
      return { ...state, ...payload }
    }
  }
})
