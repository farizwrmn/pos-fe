import {
  queryMainTotal,
  queryChildTotal
} from 'services/report/accounting/accountingStatementProfitLoss'
import { generateListBalanceSheetChildType } from 'utils/accounting'

export default {
  namespace: 'accountingStatementProfitLoss',

  state: {
    listChildAccountType: [],
    listProfitLoss: [],
    from: undefined,
    to: undefined,
    storeId: undefined,
    modalBalanceSheetDetailVisible: false,
    activeKey: '1'
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/report/accounting/statement/profit-loss') {
          dispatch({
            type: 'setListNull'
          })
          if (location.query) {
            dispatch({
              type: 'queryMainTotal',
              payload: location.query
            })
          }
        }
      })
    }
  },
  effects: {
    * queryMainTotal ({ payload }, { call, put }) {
      yield put({
        type: 'updateState',
        payload: {
          from: payload.from,
          to: payload.to
        }
      })
      const data = yield call(queryMainTotal, {
        storeId: payload.storeId,
        from: payload.from,
        to: payload.to
      })
      if (data.success) {
        if (data.data && data.data.length > 0) {
          yield put({
            type: 'updateState',
            payload: {
              listProfitLoss: data.data,
              storeId: payload.storeId
            }
          })
        } else {
          throw data
        }
      } else {
        throw data
      }
    },

    * queryChildTotalType ({ payload }, { select, call, put }) {
      const listChildAccountType = yield select(({ accountingStatementProfitLoss }) => accountingStatementProfitLoss.listChildAccountType)
      const selectedAccountType = listChildAccountType.filter(filtered => payload.accountType === filtered)
      if (selectedAccountType && selectedAccountType.length > 0) {
        return
      }
      const data = yield call(queryChildTotal, {
        storeId: payload.storeId,
        accountType: payload.accountType,
        from: payload.from,
        to: payload.to
      })
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            listChildAccountType: listChildAccountType.concat([payload.accountType])
          }
        })
        if (data.data && data.data.length > 0) {
          yield put({
            type: 'updateStateChildBalanceSheetType',
            payload: {
              listChild: data.data,
              accountType: payload.accountType,
              to: payload.to
            }
          })
        } else {
          throw data
        }
      } else {
        throw data
      }
    },

    * updateStateChildBalanceSheetType ({ payload }, { select, put }) {
      const listProfitLoss = yield select(({ accountingStatementProfitLoss }) => accountingStatementProfitLoss.listProfitLoss)
      const { listChild, accountType } = payload

      const newListBalanceSheet = generateListBalanceSheetChildType(accountType, listProfitLoss, listChild)

      yield put({
        type: 'updateState',
        payload: {
          listProfitLoss: newListBalanceSheet
        }
      })
    }
  },
  reducers: {
    updateState (state, { payload }) {
      return { ...state, ...payload }
    },
    setListNull (state) {
      return {
        ...state,
        listChildAccountType: [],
        listProfitLoss: [],
        to: undefined,
        date: null,
        storeId: undefined,
        compareFrom: undefined,
        compareTo: undefined,
        activeKey: '1'
      }
    }
  }
}
