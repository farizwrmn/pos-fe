import modelExtend from 'dva-model-extend'
import pathToRegexp from 'path-to-regexp'
import { lstorage } from 'utils'
import { message } from 'antd'
import { query as querySummary, queryBalance } from 'services/setoran/balanceSummaryService'
import { query as queryResolve } from 'services/setoran/balanceResolveService'
import { pageModel } from './../common'

const { getCurrentUserStore } = lstorage

export default modelExtend(pageModel, {
  namespace: 'setoranCashier',

  state: {
    balanceInfo: {},

    list: [],
    pagination: {
      current: 1
    },

    listSummary: [],
    paginationSummary: {},
    listSummaryTotal: {},

    listResolve: [],
    paginationResolve: {}
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
        const match = pathToRegexp('/setoran/cashier/:id').exec(pathname)
        if (match) {
          dispatch({
            type: 'querySummary',
            payload: {
              balanceId: decodeURIComponent(match[1])
            }
          })
          dispatch({
            type: 'queryResolve',
            payload: {
              balanceId: decodeURIComponent(match[1])
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
    },
    * querySummary ({ payload = {} }, { call, put }) {
      const response = yield call(querySummary, payload)
      if (response && response.success && response.data && response.balanceInfo) {
        yield put({
          type: 'updateState',
          payload: {
            balanceInfo: response.balanceInfo,
            listSummaryTotal: response.dataSummaryTotal,
            listSummary: response.data,
            paginationSummary: {
              current: Number(response.page || 1),
              pageSize: Number(response.pageSize || 10),
              total: Number(response.total || 0)
            }
          }
        })
      } else {
        message.error(response.message)
      }
    },
    * queryResolve ({ payload = {} }, { call, put }) {
      const response = yield call(queryResolve, payload)
      if (response && response.data && response.success) {
        yield put({
          type: 'updateState',
          payload: {
            listResolve: response.data,
            paginationResolve: {
              current: Number(response.page || 1),
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
