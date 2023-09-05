import {
  queryMainTotal,
  queryChildTotal
} from 'services/report/accounting/accountingStatementBalanceSheet'
import { generateListBalanceSheetChildType } from 'utils/accounting'

export default {
  namespace: 'accountingStatementBalanceSheet',

  state: {
    listChildAccountType: [],
    listBalanceSheet: [],
    to: undefined,
    storeId: undefined,
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
          to: payload.to
        }
      })
      const data = yield call(queryMainTotal, {
        storeId: payload.storeId,
        to: payload.to
      })
      if (data.success) {
        if (data.data && data.data.length > 0) {
          yield put({
            type: 'updateState',
            payload: {
              listBalanceSheet: data.data,
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
      const listChildAccountType = yield select(({ accountingStatementBalanceSheet }) => accountingStatementBalanceSheet.listChildAccountType)
      const selectedAccountType = listChildAccountType.filter(filtered => payload.accountType === filtered)
      if (selectedAccountType && selectedAccountType.length > 0) {
        return
      }
      const data = yield call(queryChildTotal, {
        storeId: payload.storeId,
        accountType: payload.accountType,
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
      const listBalanceSheet = yield select(({ accountingStatementBalanceSheet }) => accountingStatementBalanceSheet.listBalanceSheet)
      const { listChild, accountType } = payload

      const newListBalanceSheet = generateListBalanceSheetChildType(accountType, listBalanceSheet, listChild)

      yield put({
        type: 'updateState',
        payload: {
          listBalanceSheet: newListBalanceSheet
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
        listBalanceSheet: [],
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
