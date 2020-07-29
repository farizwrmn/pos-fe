/**
 * Created by Veirry on 07/07/2020.
 */
import {
  queryProfitLoss,
  queryBalanceSheet,
  queryCashFlow
} from 'services/report/accounting/accountingStatement'

export default {
  namespace: 'accountingStatementReport',

  state: {
    listTrans: [],
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
        if (location.pathname === '/report/accounting/profit-loss') {
          dispatch({
            type: 'setListNull'
          })
          dispatch({
            type: 'query',
            payload: location.query
          })
        }
        if (location.pathname === '/report/accounting/balance-sheet') {
          dispatch({
            type: 'setListNull'
          })
          dispatch({
            type: 'queryBalanceSheet',
            payload: location.query
          })
        }
        if (location.pathname === '/report/accounting/cash-flow') {
          dispatch({
            type: 'setListNull'
          })
          dispatch({
            type: 'queryCashFlow',
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
          listTrans: data.data,
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
      yield put({
        type: 'querySuccessTrans',
        payload: {
          listTrans: data.data,
          pagination: {
            total: data.total
          },
          from: payload.from,
          to: payload.to
        }
      })
    },
    * queryCashFlow ({ payload }, { call, put }) {
      const data = yield call(queryCashFlow, payload)
      yield put({
        type: 'querySuccessTrans',
        payload: {
          listTrans: data.data,
          pagination: {
            total: data.total
          },
          from: payload.from,
          to: payload.to
        }
      })
    }
  },
  reducers: {
    querySuccessTrans (state, action) {
      const { listTrans, pagination, tmpList, from, to } = action.payload

      return {
        ...state,
        listTrans,
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
        listTrans: [],
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
