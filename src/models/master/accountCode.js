import modelExtend from 'dva-model-extend'
import { message } from 'antd'
import pathToRegexp from 'path-to-regexp'
import { queryCode, query, add, edit, remove } from '../../services/master/accountCode'
import { pageModel } from './../common'

const success = () => {
  message.success('Account Code has been saved')
}

export default modelExtend(pageModel, {
  namespace: 'accountCode',

  state: {
    currentItem: {},
    modalType: 'add',
    activeKey: '0',
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
        const { activeKey, ...other } = location.query
        const { pathname } = location
        const matchEdc = pathToRegexp('/master/paymentoption/edc/:id').exec(pathname)
        if (pathname === '/transaction/adjust'
          || pathname === '/transaction/product-waste'
        ) {
          dispatch({
            type: 'query',
            payload: {
              accountType: [
                'REVE',
                'OINC',
                'EXPS',
                'OEXP',
                'EQTY',
                'COGS'
              ],
              type: 'all',
              order: 'accountCode'
            }
          })
        }
        if (pathname === '/report/accounting/consolidation/general-ledger'
          || pathname === '/bank-history'
          || pathname === '/tools/report/general-ledger') {
          dispatch({
            type: 'query',
            payload: {
              type: 'all',
              order: 'accountCode'
            }
          })
        }
        if (pathname === '/balance/finance/petty-expense') {
          dispatch({
            type: 'query',
            payload: {
              accountType: [
                'BANK',
                'COGS',
                'EXPS',
                'OEXP'
              ],
              type: 'all',
              order: 'accountCode'
            }
          })
          dispatch({
            type: 'queryExpense',
            payload: {
              accountType: [
                'COGS',
                'EXPS',
                'OEXP'
              ],
              type: 'all',
              order: 'accountCode'
            }
          })
        }
        if (pathname === '/cash-entry'
          || pathname === '/transfer-entry'
          || pathname === '/bank-recon'
          || pathname === '/balance/finance/petty-cash'
          || pathname === '/balance/finance/history'
          || pathname === '/master/paymentoption'
          || pathname === '/bank-entry'
          || matchEdc) {
          dispatch({
            type: 'queryExpense',
            payload: {
              accountType: pathname === '/bank-entry' ? undefined : [
                'COGS',
                'EXPS',
                'OEXP'
              ],
              type: 'all',
              order: 'accountCode'
            }
          })
          dispatch({
            type: 'query',
            payload: {
              accountType: 'BANK',
              type: 'all',
              order: 'accountCode'
            }
          })
        }
        if (pathname === '/inventory/transfer/invoice') {
          dispatch({
            type: 'query',
            payload: {
              accountType: 'BANK',
              type: 'all',
              order: 'accountCode'
            }
          })
        }
        if (pathname === '/marketing/voucher') {
          dispatch({
            type: 'query',
            payload: {
              accountType: ['REVE', 'OINC'],
              type: 'all',
              field: 'id,accountCode,accountName,accountParentId',
              order: 'accountCode'
            }
          })
        }
        if (pathname === '/accounts/payable-form') {
          dispatch({
            type: 'query',
            payload: {
              type: 'all',
              field: 'id,accountCode,accountName,accountParentId',
              order: 'accountCode'
            }
          })
          dispatch({
            type: 'queryLov',
            payload: {
              accountType: 'BANK',
              type: 'all',
              field: 'id,accountCode,accountName,accountParentId',
              order: 'accountCode'
            }
          })
        }
        const matchVoucher = pathToRegexp('/marketing/voucher/:id').exec(pathname)
        if (matchVoucher) {
          dispatch({
            type: 'queryLov',
            payload: {
              accountType: 'BANK',
              type: 'all',
              field: 'id,accountCode,accountName,accountParentId',
              order: 'accountCode'
            }
          })
        }
        if (
          pathname === '/master/account'
          || pathname === '/journal-entry'
          || pathname === '/tools/transaction/journal-entry') {
          dispatch({
            type: 'updateState',
            payload: {
              activeKey: activeKey || '0'
            }
          })
          if (activeKey === '1') {
            dispatch({
              type: 'query',
              payload: {
                ...other
              }
            })
          } else {
            dispatch({
              type: 'queryLov',
              payload: {
                type: 'all',
                field: 'id,accountCode,accountName,accountParentId',
                order: 'accountCode'
              }
            })
          }
        }
      })
    }
  },

  effects: {

    * query ({ payload = {} }, { call, put }) {
      const data = yield call(query, payload)
      if (data.success) {
        yield put({
          type: 'querySuccessCounter',
          payload: {
            listAccountCode: data.data,
            pagination: {
              current: Number(payload.page) || 1,
              pageSize: Number(payload.pageSize) || 10,
              total: data.total
            }
          }
        })
      }
    },

    * queryExpense ({ payload = {} }, { call, put }) {
      const data = yield call(query, payload)
      if (data.success) {
        yield put({
          type: 'querySuccessExpense',
          payload: {
            listAccountCodeExpense: data.data,
            pagination: {
              current: Number(payload.page) || 1,
              pageSize: Number(payload.pageSize) || 10,
              total: data.total
            }
          }
        })
      }
    },

    * queryLov ({ payload = {} }, { call, put }) {
      const data = yield call(query, payload)
      if (data.success) {
        yield put({
          type: 'querySuccessCounterLov',
          payload: {
            listAccountCodeLov: data.data,
            pagination: {
              current: Number(payload.page) || 1,
              pageSize: Number(payload.pageSize) || 10,
              total: data.total
            }
          }
        })
      }
    },

    * queryEditItem ({ payload = {} }, { call, put }) {
      const data = yield call(queryCode, payload)
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            currentItem: data.data,
            disable: 'disabled',
            modalType: 'edit',
            activeKey: '0'
          }
        })
      } else {
        throw data
      }
    },

    * delete ({ payload }, { call, put }) {
      const data = yield call(remove, payload)
      if (data.success) {
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },

    * add ({ payload }, { call, put }) {
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
        yield put({
          type: 'query',
          payload: {
            type: 'all',
            field: 'id,accountCode,accountName,accountParentId'
          }
        })
        yield put({
          type: 'queryLov',
          payload: {
            type: 'all',
            field: 'id,accountCode,accountName,accountParentId',
            order: 'accountCode'
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

    * edit ({ payload }, { select, call, put }) {
      const id = yield select(({ accountCode }) => accountCode.currentItem.id)
      const newCounter = { ...payload, id }
      const data = yield call(edit, newCounter)
      if (data.success) {
        success()
        yield put({
          type: 'updateState',
          payload: {
            modalType: 'add',
            currentItem: {},
            activeKey: '1'
          }
        })
        yield put({
          type: 'query',
          payload: {
            type: 'all'
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
    }
  },

  reducers: {
    querySuccessCounter (state, action) {
      const { listAccountCode, pagination } = action.payload
      return {
        ...state,
        listAccountCode,
        pagination: {
          ...state.pagination,
          ...pagination
        }
      }
    },

    querySuccessExpense (state, action) {
      const { listAccountCodeExpense, pagination } = action.payload
      return {
        ...state,
        listAccountCodeExpense,
        pagination: {
          ...state.pagination,
          ...pagination
        }
      }
    },

    querySuccessCounterLov (state, action) {
      const { listAccountCodeLov, pagination } = action.payload
      return {
        ...state,
        listAccountCodeLov,
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
