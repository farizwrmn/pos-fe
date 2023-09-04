import {
  queryMainTotal,
  queryChildTotal
} from 'services/report/accounting/accountingStatementProfitLoss'
import { generateListBalanceSheetChildType } from 'utils/accounting'

export default {
  namespace: 'accountingStatementBalanceSheet',

  state: {
    listProfitLoss: [],
    from: undefined,
    to: undefined,
    date: null,
    modalBalanceSheetDetailVisible: false,
    activeKey: '1'
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/report/accounting/statement/balance-sheet') {
          dispatch({
            type: 'setListNull'
          })
          // if (location.query && location.query.compareFrom && location.query.compareTo) {
          //   dispatch({
          //     type: 'queryProfitCompare',
          //     payload: location.query
          //   })
          // }
        }
      })
    }
  },
  effects: {
    * queryMainTotal ({ payload }, { call, put }) {
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

    * queryChildTotalType ({ payload }, { call, put }) {
      const data = yield call(queryChildTotal, {
        storeId: payload.storeId,
        accountType: payload.accountType,
        to: payload.to
      })
      if (data.success) {
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

    * updateStateChildBalanceSheet ({ payload }, { select, put }) {
      const listProfitLoss = yield select(({ accountingStatementBalanceSheet }) => accountingStatementBalanceSheet.listProfitLoss)
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
        listProfitLoss: [],
        from: undefined,
        to: undefined,
        date: null,
        compareFrom: undefined,
        compareTo: undefined,
        activeKey: '1'
      }
    }
  }
}
