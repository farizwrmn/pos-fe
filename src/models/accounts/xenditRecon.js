import modelExtend from 'dva-model-extend'
import pathToRegexp from 'path-to-regexp'
import { lstorage } from 'utils'
import { query as queryBalance } from 'services/paymentXendit/paymentXenditBalanceImport'
import { query as queryBalanceDetail } from 'services/paymentXendit/paymentXenditBalanceImportDetailService'
import { query as queryTransaction } from 'services/paymentXendit/paymentXenditTransactionImport'
import { query as queryTransactionDetail, queryNotReconciled as queryTransactionDetailNotReconciled, queryAll as queryAllTransactionDetail } from 'services/paymentXendit/paymentXenditTransactionImportDetail'
import { queryXenditRecon as queryErrorLog } from 'services/errorLog'
import { pageModel } from './../common'

const {
  getCurrentUserRole,
  getCurrentUserStore
} = lstorage

export default modelExtend(pageModel, {
  namespace: 'xenditRecon',

  state: {
    activeKey: '0',
    showPDFModalTransactionDetail: false,
    showPDFModalTransactionNotRecon: false,
    mode: '',
    changed: false,

    // list balance
    listBalance: [],
    paginationBalance: {
      current: 1
    },

    // list transaction
    listTransaction: [],
    paginationTransaction: {
      current: 1
    },

    // list error log
    listErrorLog: [],
    paginationErrorLog: {
      current: 1
    },

    // list transaction detail
    listTransactionDetail: [],
    listTransactionDetailAll: [],
    paginationTransactionDetail: {
      current: 1
    },

    // list balance detail
    listBalanceDetail: [],
    paginationBalanceDetail: {
      current: 1
    },

    // List transaction detail not reconciled
    listTransactionNotRecon: []
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        const { pathname, query } = location
        const { q, activeKey, from, to, type, page, pageSize, all } = query
        const match = pathToRegexp('/accounting/xendit-recon/detail/:id').exec(location.pathname)
        if (match) {
          if (type === 'transaction') {
            dispatch({
              type: 'queryTransactionDetail',
              payload: {
                q,
                transId: decodeURIComponent(match[1]),
                page: page || 1,
                pageSize: pageSize || 10
              }
            })
          }
          if (type === 'balance') {
            dispatch({
              type: 'queryBalanceDetail',
              payload: {
                q,
                transId: decodeURIComponent(match[1]),
                page: page || 1,
                pageSize: pageSize || 10
              }
            })
          }
        }
        if (pathname === '/accounting/xendit-recon') {
          dispatch({
            type: 'queryBalance',
            payload: {
              from,
              to,
              all
            }
          })
          dispatch({
            type: 'queryTransaction',
            payload: {
              from,
              to,
              all
            }
          })
          dispatch({
            type: 'queryErrorLog',
            payload: {
              from,
              to
            }
          })
        }
        if (activeKey) {
          dispatch({
            type: 'updateState',
            payload: {
              activeKey
            }
          })
        }
      })
    }
  },

  effects: {
    * queryBalance ({ payload = {} }, { call, put }) {
      payload.order = '-transDate'
      const { all = false, ...other } = payload
      const allStore = JSON.parse(all)
      const userRole = getCurrentUserRole()
      const currentStore = getCurrentUserStore()
      if (userRole !== 'OWN' || !allStore) {
        other.storeId = currentStore
      }
      const response = yield call(queryBalance, other)
      if (response && response.success && response.data) {
        yield put({
          type: 'updateState',
          payload: {
            listBalance: response.data,
            paginationBalance: {
              current: Number(response.page || 1),
              pageSize: Number(response.pageSize || 10),
              total: Number(response.total || 0)
            }
          }
        })
      }
    },
    * queryTransaction ({ payload = {} }, { call, put }) {
      payload.order = '-transDate'
      const { all = false, ...other } = payload
      const allStore = JSON.parse(all)
      const userRole = getCurrentUserRole()
      const currentStore = getCurrentUserStore()
      if (userRole !== 'OWN' || !allStore) {
        other.storeId = currentStore
      }
      const response = yield call(queryTransaction, other)
      if (response && response.success && response.data) {
        yield put({
          type: 'updateState',
          payload: {
            listTransaction: response.data,
            paginationTransaction: {
              current: Number(response.page || 1),
              pageSize: Number(response.pageSize || 10),
              total: Number(response.total || 0)
            }
          }
        })
      }
    },
    * queryErrorLog ({ payload = {} }, { call, put }) {
      payload.order = '-createdAt'
      const response = yield call(queryErrorLog, payload)
      if (response && response.success && response.data) {
        yield put({
          type: 'updateState',
          payload: {
            listErrorLog: response.data,
            paginationErrorLog: {
              current: Number(response.page || 1),
              pageSize: Number(response.pageSize || 10),
              total: Number(response.total || 0)
            }
          }
        })
      }
    },
    * queryTransactionDetail ({ payload = {} }, { call, put }) {
      const response = yield call(queryTransactionDetail, payload)
      const responseNotReconciled = yield call(queryTransactionDetailNotReconciled, payload)
      if (response && response.success && response.data) {
        yield put({
          type: 'updateState',
          payload: {
            listTransactionDetail: response.data,
            paginationTransactionDetail: {
              current: Number(response.page || 1),
              pageSize: Number(response.pageSize || 10),
              total: Number(response.total || 0)
            },
            listTransactionNotRecon: responseNotReconciled.data
          }
        })
      }
    },
    * queryAllTransactionDetail ({ payload = {} }, { call, put }) {
      const response = yield call(queryAllTransactionDetail, payload)
      if (response && response.success && response.data) {
        yield put({
          type: 'updateState',
          payload: {
            listTransactionDetailAll: response.data,
            changed: payload.changed
          }
        })
      }
    },
    * queryBalanceDetail ({ payload = {} }, { call, put }) {
      const response = yield call(queryBalanceDetail, payload)
      if (response && response.success && response.data) {
        yield put({
          type: 'updateState',
          payload: {
            listBalanceDetail: response.data,
            paginationBalanceDetail: {
              current: Number(response.page || 1),
              pageSize: Number(response.pageSize || 10),
              total: Number(response.total || 0)
            }
          }
        })
      }
    }
  },

  reducers: {
    updateState (state, { payload }) {
      return { ...state, ...payload }
    }
  }
})
