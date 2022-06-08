/**
 * Created by Veirry on 07/07/2020.
 */
import {
  queryProfitLoss,
  queryBalanceSheet
} from 'services/taxReport/accountingStatement'

export default {
  namespace: 'accountingStatementReport',

  state: {
    listProfit: [],
    listBalanceSheet: [],
    listCashflow: [],
    from: '',
    to: '',
    date: null,
    activeKey: '1',
    category: 'ALL CATEGORY',
    brand: 'ALL BRAND',
    productCode: 'ALL TYPE',
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => `Total ${total} Records`,
      current: 1,
      total: null
    }
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/tools/report/profit-loss') {
          dispatch({
            type: 'setListNull'
          })
          dispatch({
            type: 'query',
            payload: location.query
          })
        }
        if (location.pathname === '/tools/report/balance-sheet') {
          dispatch({
            type: 'setListNull'
          })
          dispatch({
            type: 'queryBalanceSheet',
            payload: location.query
          })
        }
      })
    }
  },
  effects: {
    * query ({ payload }, { call, put }) {
      const data = yield call(queryProfitLoss, payload)
      yield put({
        type: 'querySuccessTrans',
        payload: {
          listProfit: data.data,
          pagination: {
            total: data.total
          },
          from: payload.from,
          to: payload.to
        }
      })
    },
    * queryBalanceSheet ({ payload }, { call, put }) {
      const data = yield call(queryBalanceSheet, payload)
      if (data.success) {
        yield put({
          type: 'query',
          payload: {
            storeId: payload.storeId || undefined,
            to: payload.to
          }
        })
        yield put({
          type: 'querySuccessTrans',
          payload: {
            listBalanceSheet: data.data,
            pagination: {
              total: data.total
            },
            to: payload.to
          }
        })
      }
    }
  },
  reducers: {
    querySuccessTrans (state, action) {
      const { pagination, tmpList, from, to, ...other } = action.payload

      return {
        ...state,
        ...other,
        from,
        to,
        tmpList,
        pagination: {
          ...state.pagination,
          ...pagination
        }
      }
    },
    updateState (state, { payload }) {
      return { ...state, ...payload }
    },
    setListNull (state) {
      return {
        ...state,
        listBalanceSheet: [],
        listProfit: [],
        listCashflow: [],
        pagination: {
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: total => `Total ${total} Records`,
          current: 1,
          total: null
        }
      }
    }
  }
}
