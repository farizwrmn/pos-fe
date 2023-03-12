/**
 * Created by Veirry on 07/07/2020.
 */
import moment from 'moment'
import {
  queryProfitLoss,
  queryBalanceSheet,
  queryCashFlow
} from 'services/report/accounting/accountingStatement'

export default {
  namespace: 'accountingStatementReport',

  state: {
    listProfit: [],
    listProfitCompare: [],
    listBalanceSheet: [],
    listBalanceSheetCompare: [],
    listCashflow: [],
    from: '',
    to: '',
    date: null,
    activeKey: '1',
    category: 'ALL CATEGORY',
    brand: 'ALL BRAND',
    productCode: 'ALL TYPE',
    compareFrom: '',
    compareTo: '',
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
          if (location.query && location.query.compareFrom && location.query.compareTo) {
            dispatch({
              type: 'queryProfitCompare',
              payload: location.query
            })
          }
        }
        if (location.pathname === '/report/accounting/balance-sheet') {
          dispatch({
            type: 'setListNull'
          })
          dispatch({
            type: 'queryBalanceSheet',
            payload: location.query
          })
          dispatch({
            type: 'query',
            payload: {
              storeId: location.query.storeId || undefined,
              to: location.query.to
            }
          })
          if (location.query && location.query.compareTo) {
            dispatch({
              type: 'queryBalanceSheetCompare',
              payload: location.query
            })
            dispatch({
              type: 'queryProfitCompare',
              payload: {
                storeId: location.query.storeId || undefined,
                compareTo: location.query.compareTo
              }
            })
          } else {
            dispatch({
              type: 'queryBalanceSheetCompare',
              payload: {
                storeId: location.query.storeId || undefined,
                to: moment(location.query.to, 'YYYY-MM-DD').startOf('year').subtract(1, 'days').format('YYYY-MM-DD')
              }
            })
            dispatch({
              type: 'queryProfitCompare',
              payload: {
                storeId: location.query.storeId || undefined,
                compareTo: moment(location.query.to, 'YYYY-MM-DD').startOf('year').subtract(1, 'days').format('YYYY-MM-DD')
              }
            })
          }
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
      const data = yield call(queryProfitLoss, {
        storeId: payload.storeId,
        from: payload.from,
        to: payload.to
      })
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
    * queryProfitCompare ({ payload }, { call, put }) {
      const data = yield call(queryProfitLoss, {
        storeId: payload.storeId,
        from: payload.compareFrom,
        to: payload.compareTo
      })
      yield put({
        type: 'updateState',
        payload: {
          listProfitCompare: data.data,
          compareFrom: payload.compareFrom,
          compareTo: payload.compareTo
        }
      })
    },

    * queryBalanceSheet ({ payload }, { call, put }) {
      const data = yield call(queryBalanceSheet, payload)
      if (data.success) {
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
    },
    * queryBalanceSheetCompare ({ payload }, { call, put }) {
      const data = yield call(queryBalanceSheet, {
        to: payload.compareTo,
        storeId: payload.storeId
      })
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            listBalanceSheetCompare: data.data,
            pagination: {
              total: data.total
            },
            compareTo: payload.compareTo
          }
        })
      }
    },
    * queryCashFlow ({ payload }, { call, put }) {
      const data = yield call(queryCashFlow, payload)
      yield put({
        type: 'querySuccessTrans',
        payload: {
          listCashflow: data.data,
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
        listBalanceSheetCompare: [],
        listProfitCompare: [],
        from: '',
        to: '',
        compareFrom: '',
        compareTo: '',
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
