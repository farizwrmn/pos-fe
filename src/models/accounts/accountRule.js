import modelExtend from 'dva-model-extend'
import { message } from 'antd'
import { query, queryId, add } from 'services/account/accountRule'
import { pageModel } from 'models/common'
import pathToRegexp from 'path-to-regexp'
import { lstorage } from 'utils'
import {
  ACCOUNT_TYPE_BANK,
  ACCOUNT_TYPE_ADJUST,
  ACCOUNT_TYPE_PETTY_CASH,
  ACCOUNT_TYPE_PETTY_CASH_EXPENSE,
  ACCOUNT_TYPE_VOUCHER,
  ACCOUNT_TYPE_VOUCHER_PAYMENT,

  CACHE_TYPE_ALL,
  CACHE_TYPE_BANK,
  CACHE_TYPE_ADJUST,
  CACHE_TYPE_PETTY_CASH,
  CACHE_TYPE_PETTY_CASH_EXPENSE,
  CACHE_TYPE_CASH_ENTRY_EXPENSE,
  CACHE_TYPE_BANK_ENTRY,
  CACHE_TYPE_VOUCHER,
  CACHE_TYPE_PAYABLE_FORM,
  CACHE_TYPE_PAYABLE_FORM_EXPENSE,
  CACHE_TYPE_MARKETING_VOUCHER_DETAIL,
  CACHE_TYPE_TRANSFER_INVOICE,
  CACHE_TYPE_MASTER_ACCOUNT
} from 'utils/variable'

const success = () => {
  message.success('Account Code has been saved')
}

export default modelExtend(pageModel, {
  namespace: 'accountRule',

  state: {
    currentItem: {},
    modalType: 'add',
    activeKey: '0',
    modalAccountRuleVisible: false,
    modalAccountRuleItem: {},
    listDefaultStore: [],
    listDefaultRole: [],
    listAccountCode: [],
    listAccountCodeExpense: [],
    listAccountCodeLov: [],
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      current: 1
    }
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        const { pathname } = location
        const { activeKey } = location.query
        if (pathname === '/transaction/adjust'
          || pathname === '/transaction/productWaste'
        ) {
          dispatch({
            type: 'query',
            payload: {
              accountType: ACCOUNT_TYPE_ADJUST,
              cacheType: CACHE_TYPE_ADJUST
            }
          })
        }
        if (pathname === '/balance/finance/petty-expense') {
          dispatch({
            type: 'query',
            payload: {
              accountType: ACCOUNT_TYPE_PETTY_CASH,
              cacheType: CACHE_TYPE_PETTY_CASH
            }
          })
          dispatch({
            type: 'queryExpense',
            payload: {
              accountType: ACCOUNT_TYPE_PETTY_CASH_EXPENSE,
              cacheType: CACHE_TYPE_PETTY_CASH_EXPENSE
            }
          })
        }
        const matchEdc = pathToRegexp('/master/paymentoption/edc/:id').exec(pathname)
        if (pathname === '/cash-entry'
          || pathname === '/transfer-entry'
          || pathname === '/bank-recon'
          || pathname === '/auto-recon'
          || pathname === '/balance/finance/petty-cash'
          || pathname === '/balance/finance/history'
          || pathname === '/master/paymentoption'
          || matchEdc) {
          dispatch({
            type: 'query',
            payload: {
              accountType: ACCOUNT_TYPE_BANK,
              cacheType: CACHE_TYPE_BANK
            }
          })
          dispatch({
            type: 'queryExpense',
            payload: {
              accountType: ACCOUNT_TYPE_PETTY_CASH_EXPENSE,
              cacheType: CACHE_TYPE_CASH_ENTRY_EXPENSE
            }
          })
        }
        if (pathname === '/report/accounting/consolidation/general-ledger'
          || pathname === '/bank-history'
          || pathname === '/tools/report/general-ledger') {
          dispatch({
            type: 'query',
            payload: {
              accountType: [],
              cacheType: CACHE_TYPE_ALL
            }
          })
        }

        if (pathname === '/bank-entry') {
          dispatch({
            type: 'query',
            payload: {
              accountType: [],
              cacheType: CACHE_TYPE_BANK
            }
          })
          dispatch({
            type: 'queryExpense',
            payload: {
              accountType: [],
              cacheType: CACHE_TYPE_BANK_ENTRY
            }
          })
        }
        if (pathname === '/inventory/transfer/invoice') {
          dispatch({
            type: 'query',
            payload: {
              accountType: ACCOUNT_TYPE_BANK,
              cacheType: CACHE_TYPE_TRANSFER_INVOICE
            }
          })
        }
        if (pathname === '/marketing/voucher') {
          dispatch({
            type: 'query',
            payload: {
              accountType: ACCOUNT_TYPE_VOUCHER,
              cacheType: CACHE_TYPE_VOUCHER
            }
          })
          dispatch({
            type: 'queryLov',
            payload: {
              accountType: ACCOUNT_TYPE_VOUCHER_PAYMENT,
              cacheType: CACHE_TYPE_MARKETING_VOUCHER_DETAIL
            }
          })
        }
        if (pathname === '/accounts/payable-form') {
          dispatch({
            type: 'query',
            payload: {
              accountType: [],
              cacheType: CACHE_TYPE_PAYABLE_FORM
            }
          })
          dispatch({
            type: 'queryLov',
            payload: {
              accountType: ACCOUNT_TYPE_BANK,
              cacheType: CACHE_TYPE_PAYABLE_FORM_EXPENSE
            }
          })
        }
        const matchVoucher = pathToRegexp('/marketing/voucher/:id').exec(pathname)
        if (matchVoucher) {
          dispatch({
            type: 'queryLov',
            payload: {
              accountType: ACCOUNT_TYPE_VOUCHER_PAYMENT,
              cacheType: CACHE_TYPE_MARKETING_VOUCHER_DETAIL
            }
          })
        }
        const matchAutoRecon = pathToRegexp('/auto-recon/:id').exec(pathname)
        if (
          pathname === '/journal-entry'
          || matchAutoRecon
          || pathname === '/tools/transaction/journal-entry') {
          if (activeKey !== '1') {
            dispatch({
              type: 'queryLov',
              payload: {
                accountType: [],
                cacheType: CACHE_TYPE_MASTER_ACCOUNT
              }
            })
          }
        }
      })
    }
  },

  effects: {
    * queryId ({ payload = {} }, { call, put }) {
      const { item } = payload
      const response = yield call(queryId, { id: item.id })
      if (response.success && response.data && response.data.listStore && response.data.listRole) {
        yield put({
          type: 'updateState',
          payload: {
            listDefaultStore: response.data.listStore.map(item => `${item.storeId}`),
            listDefaultRole: response.data.listRole.map(item => item.userRole),
            modalAccountRuleItem: item,
            modalAccountRuleVisible: true
          }
        })
      } else {
        yield put({
          type: 'updateState',
          payload: {
            listDefaultStore: [],
            listDefaultRole: []
          }
        })
        throw response
      }
    },

    * query ({ payload = {} }, { call, put }) {
      const response = yield call(query, {
        storeId: lstorage.getCurrentUserStore(),
        userRole: lstorage.getCurrentUserRole(),
        ...payload
      })
      if (response.success) {
        yield put({
          type: 'updateState',
          payload: {
            listAccountCode: response.data
          }
        })
      } else {
        throw response
      }
    },

    * queryExpense ({ payload = {} }, { call, put }) {
      const response = yield call(query, {
        storeId: lstorage.getCurrentUserStore(),
        userRole: lstorage.getCurrentUserRole(),
        ...payload
      })
      if (response.success) {
        yield put({
          type: 'updateState',
          payload: {
            listAccountCodeExpense: response.data
          }
        })
      } else {
        throw response
      }
    },

    * queryLov ({ payload = {} }, { call, put }) {
      const response = yield call(query, {
        storeId: lstorage.getCurrentUserStore(),
        userRole: lstorage.getCurrentUserRole(),
        ...payload
      })
      if (response.success) {
        yield put({
          type: 'updateState',
          payload: {
            listAccountCodeLov: response.data
          }
        })
      } else {
        throw response
      }
    },

    * add ({ payload }, { call, put }) {
      const response = yield call(add, payload.data)
      if (response.success) {
        success()
        yield put({
          type: 'updateState',
          payload: {
            modalType: 'add',
            currentItem: {},
            modalAccountRuleItem: {},
            modalAccountRuleVisible: false,
            listDefaultRole: [],
            listDefaultStore: []
          }
        })
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
    },

    changeTab (state, { payload }) {
      const { key } = payload
      return {
        ...state,
        activeKey: key,
        modalType: 'add',
        currentItem: {}
      }
    },

    editItem (state, { payload }) {
      const { item } = payload
      return {
        ...state,
        modalType: 'edit',
        activeKey: '0',
        currentItem: item
      }
    }
  }
})
