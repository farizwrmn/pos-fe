import modelExtend from 'dva-model-extend'
import pathToRegexp from 'path-to-regexp'
import { routerRedux } from 'dva/router'
import { message } from 'antd'
import { lstorage } from 'utils'
import { queryAdd } from 'services/balancePayment/balanceDepositService'
import { query as queryDepositDetail } from 'services/balancePayment/balanceDepositDetailService'
import { pageModel } from '../common'

const {
  getCurrentUserStore
} = lstorage

export default modelExtend(pageModel, {
  namespace: 'depositCashier',

  state: {
    list: [],
    pagination: {
      current: 1
    },

    listDetail: [],
    paginationDetail: {
      current: 1
    },

    visibleAddDepositModal: false
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        const { pathname, query } = location
        const { page, pageSize } = query
        const match = pathToRegexp('/setoran/cashier/:id').exec(pathname)
        if (match) {
          dispatch({
            type: 'queryDepositDetail',
            payload: {
              transId: decodeURIComponent(match[1]),
              page,
              pageSize
            }
          })
        }
      })
    }
  },

  effects: {
    * queryDepositDetail ({ payload = {} }, { call, put }) {
      const response = yield call(queryDepositDetail, payload)
      if (response && response.data && response.success) {
        yield put({
          type: 'updateState',
          payload: {
            listDetail: response.data,
            paginationDetail: {
              current: Number(response.page || 1),
              pageSize: Number(response.pageSize || 10),
              total: Number(response.total || 0)
            }
          }
        })
      }
    },
    * add ({ payload = {} }, { call, put }) {
      payload.storeId = getCurrentUserStore()
      const response = yield call(queryAdd, payload)
      if (response && response.success && response.data) {
        yield put(routerRedux.push(`/setoran/cashier/${response.data.id}`))
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
