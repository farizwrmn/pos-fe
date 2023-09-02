import modelExtend from 'dva-model-extend'
import { lstorage } from 'utils'
import { message } from 'antd'
import { queryBalance } from 'services/setoran/balanceSummaryService'
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
        const { page, pageSize, from, to, q } = query
        if (pathname === '/setoran/cashier') {
          dispatch({
            type: 'queryBalance',
            payload: {
              page,
              pageSize,
              from,
              to,
              q
            }
          })
        }
      })
    }
  },

  effects: {
    * queryBalance ({ payload = {} }, { call, put }) {
      payload.storeId = getCurrentUserStore()
      const response = yield call(queryBalance, payload)
      console.log('response', response)
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
