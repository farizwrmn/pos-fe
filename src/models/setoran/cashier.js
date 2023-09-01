import modelExtend from 'dva-model-extend'
import { lstorage } from 'utils'
import { message } from 'antd'
import { query as queryBalanceSummary } from 'services/setoran/balanceSummaryService'
import { pageModel } from './../common'

const { getCurrentUserStore } = lstorage

export default modelExtend(pageModel, {
  namespace: 'setoranCashier',

  state: {
    list: [],
    pagination: {
      current: 1
    }
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        const { pathname, query } = location
        const { page, pageSize } = query
        if (pathname === '/setoran/cashier') {
          dispatch({
            type: 'queryBalanceSummary',
            payload: {
              page,
              pageSize
            }
          })
        }
      })
    }
  },

  effects: {
    * queryBalanceSummary ({ payload = {} }, { call, put }) {
      payload.storeId = getCurrentUserStore()
      const response = yield call(queryBalanceSummary, payload)
      if (response && response.success && response.data) {
        yield put({
          type: 'updateState',
          payload: {
            list: response.data,
            pagination: {
              page: Number(response.page || 1),
              pageSize: Number(response.pageSize || 10),
              total: Number(response.total || 0)
            }
          }
        })
      } else {
        message.error(response.message)
      }
    }
  },

  reducers: {
    updateState (state, { payload }) {
      return { ...state, ...payload }
    }
  }
})
