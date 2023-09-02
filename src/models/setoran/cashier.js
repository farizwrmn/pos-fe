import modelExtend from 'dva-model-extend'
import pathToRegexp from 'path-to-regexp'
import { message } from 'antd'
import { query as querySummary } from 'services/setoran/balanceSummaryService'
import { query as queryResolve } from 'services/setoran/balanceResolveService'
import { pageModel } from './../common'

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
    paginationResolve: {},

    visibleResolveModal: false
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        const { pathname } = location
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
