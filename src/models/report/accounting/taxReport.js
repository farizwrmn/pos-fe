/**
 * Created by Veirry on 07/07/2020.
 */
import {
  queryTaxReport
} from 'services/report/accounting/taxReport'

export default {
  namespace: 'taxReport',

  state: {
    listVAT: [],
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
        if (location.pathname === '/report/accounting/tax-report') {
          dispatch({
            type: 'setListNull'
          })
          dispatch({
            type: 'query',
            payload: location.query
          })
        }
      })
    }
  },
  effects: {
    * query ({ payload }, { call, put }) {
      if (payload.from && payload.to) {
        const data = yield call(queryTaxReport, payload)
        if (data.success) {
          yield put({
            type: 'querySuccessTrans',
            payload: {
              listVAT: data.data,
              pagination: {
                total: data.total
              },
              from: payload.from,
              to: payload.to
            }
          })
        } else {
          yield put({
            type: 'updateState',
            payload: {
              listVAT: []
            }
          })
          throw data
        }
      } else {
        yield put({
          type: 'updateState',
          payload: {
            listVAT: []
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
        listVAT: [],
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
