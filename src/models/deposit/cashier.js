import modelExtend from 'dva-model-extend'
import pathToRegexp from 'path-to-regexp'
import { routerRedux } from 'dva/router'
import { message } from 'antd'
import { lstorage } from 'utils'
import { queryInvoice as queryBalanceSummary } from 'services/balancePayment/balanceSummaryService'
import { query, queryAdd } from 'services/balancePayment/balanceDepositService'
import {
  query as queryDepositDetail,
  queryJournal as queryDepositDetailJournal,
  queryResolve as queryDepositDetailResolve
} from 'services/balancePayment/balanceDepositDetailService'
import {
  query as queryBalanceResolve,
  queryResolveOption,
  queryUpdateStatus
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

    listResolve: [],
    paginationResolve: {
      current: 1
    },

    listJournal: [],
    paginationJournal: {
      current: 1
    },

    selectedResolve: {},
    listResolveOption: [],

    visibleAddDepositModal: false,
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
        const match = pathToRegexp('/setoran/cashier/:id').exec(pathname)
        const matchCashierDetail = pathToRegexp('/setoran/cashier/detail/:id').exec(pathname)
        if (matchCashierDetail) {
          dispatch({
            type: 'queryDepositBalanceDetail',
            payload: {
              balanceId: decodeURIComponent(matchCashierDetail[1])
            }
          })
        }
        if (match) {
          dispatch({
            type: 'queryDepositDetail',
            payload: {
              transId: decodeURIComponent(match[1])
            }
          })
          dispatch({
            type: 'queryDepositDetailResolve',
            payload: {
              transId: decodeURIComponent(match[1])
            }
          })
          dispatch({
            type: 'queryDepositDetailJournal',
            payload: {
              transId: decodeURIComponent(match[1])
            }
          })
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
    * queryDepositDetailJournal ({ payload = {} }, { call, put }) {
      const response = yield call(queryDepositDetailJournal, payload)
      if (response && response.success && response.data) {
        yield put({
          type: 'updateState',
          payload: {
            listJournal: response.data,
            paginationJournal: {
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
    * queryDepositDetailResolve ({ payload = {} }, { call, put }) {
      const response = yield call(queryDepositDetailResolve, payload)
      if (response && response.success && response.data) {
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
    },
    * queryDepositDetail ({ payload = {} }, { call, put }) {
      const response = yield call(queryDepositDetail, payload)
      if (response && response.data && response.success) {
        yield put({
          type: 'updateState',
          payload: {
            summaryDetail: response.summary,
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
    * queryUpdateStatus ({ payload = {} }, { call, put }) {
      const response = yield call(queryUpdateStatus, payload)
      if (response && response.data && response.success) {
        yield put({
          type: 'queryDepositDetailResolve',
          payload: {
            transId: payload.transId,
            page: payload.page,
            pageSize: payload.pageSize
          }
        })
        yield put({
          type: 'updateState',
          payload: {
            visibleResolveModal: false,
            selectedResolve: {}
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
