import modelExtend from 'dva-model-extend'
import pathToRegexp from 'path-to-regexp'
import { message } from 'antd'
import { lstorage } from 'utils'
import { queryInvoice as queryBalanceSummary } from 'services/balancePayment/balanceSummaryService'
import { query } from 'services/balancePayment/balanceDepositService'
import {
  query as queryBalanceResolve,
  queryResolveOption
} from 'services/balancePayment/balanceResolveService'
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

    summaryDetail: {},
    listDetail: [],
    paginationDetail: {
      current: 1
    },

    listJournal: [],
    paginationJournal: {
      current: 1
    },

    selectedResolve: {},
    listResolveOption: [],

    visibleResolveModal: false,

    depositBalanceDetailInfo: {},
    listDepositBalanceDetailSummary: [],
    listDepositBalanceDetailResolve: []
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        const { pathname, query } = location
        const { page, pageSize } = query
        const matchCashierDetail = pathToRegexp('/setoran/cashier/detail/:id').exec(pathname)
        if (matchCashierDetail) {
          dispatch({
            type: 'queryDepositBalanceDetail',
            payload: {
              balanceId: decodeURIComponent(matchCashierDetail[1])
            }
          })
        }
        if (pathname === '/setoran/cashier/new') {
          dispatch({
            type: 'queryResolveOption'
          })
        }
        if (pathname === '/setoran/cashier') {
          dispatch({
            type: 'query',
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
    * query ({ payload = {} }, { call, put }) {
      payload.storeId = getCurrentUserStore()
      const response = yield call(query, payload)
      if (response && response.success && response.data) {
        yield put({
          type: 'updateState',
          payload: {
            list: response.data,
            pagination: {
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
    * queryResolveOption ({ payload = {} }, { call, put }) {
      const response = yield call(queryResolveOption, payload)
      if (response && response.success && response.data) {
        yield put({
          type: 'updateState',
          payload: {
            listResolveOption: response.data
          }
        })
      } else {
        message.error(response.message)
      }
    },
    * queryDepositBalanceDetail ({ payload = {} }, { call, put }) {
      const responseSummary = yield call(queryBalanceSummary, payload)
      if (responseSummary && responseSummary.success && responseSummary.data && responseSummary.data.detail) {
        yield put({
          type: 'updateState',
          payload: {
            listDepositBalanceDetailSummary: responseSummary.data.detail,
            depositBalanceDetailInfo: responseSummary.data
          }
        })
      } else {
        message.error(responseSummary.message)
      }
      payload.type = 'all'
      const responseResolve = yield call(queryBalanceResolve, payload)
      if (responseResolve && responseResolve.success && responseResolve.data) {
        yield put({
          type: 'updateState',
          payload: {
            listDepositBalanceDetailResolve: responseResolve.data
          }
        })
      } else {
        message.error(responseResolve.message)
      }
    }
  },

  reducers: {
    updateState (state, { payload }) {
      return { ...state, ...payload }
    }
  }
})
