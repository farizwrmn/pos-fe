/**
 * Created by Veirry on 22/06/2020.
 */
import moment from 'moment'
import {
  generalLedger
} from 'services/report/accounting/ledger'

export default {
  namespace: 'generalLedger',

  state: {
    listRekap: [],
    period: moment().format('MM'),
    year: moment().format('YYYY'),
    listProduct: [],
    // productCode: [],
    // productName: [],
    activeKey: '0',
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
        if (location.pathname === '/report/accounting/general-ledger' && location.query.period && location.query.year) {
          dispatch({
            type: 'queryGeneralLedger',
            payload: location.query
          })
        }
      })
    }
  },
  effects: {
    * queryGeneralLedger ({ payload = {} }, { call, put }) {
      const date = payload
      yield put({
        type: 'setPeriod',
        payload: date
      })
      yield put({
        type: 'setNull',
        payload: date
      })
      const data = yield call(generalLedger, payload)
      if (data.success) {
        yield put({
          type: 'querySuccessTrans',
          payload: {
            listRekap: data.data,
            period: payload.period,
            year: payload.year,
            pagination: {
              current: Number(payload.page) || 1,
              pageSize: Number(payload.pageSize) || 5,
              total: data.total
            },
            date
          }
        })
      } else {
        yield put({ type: 'setNull' })
        throw data
      }
    }
  },
  reducers: {
    querySuccessTrans (state, action) {
      const { listRekap, date, pagination, period, year } = action.payload
      return {
        ...state,
        period,
        year,
        listRekap,
        fromDate: date.period,
        toDate: date.year,
        pagination: {
          ...state.pagination,
          ...pagination
        }
      }
    },
    setPeriod (state, action) {
      return { ...state, period: action.payload.period, year: action.payload.year }
    },
    setNull (state) {
      return { ...state, listRekap: [] }
    },
    updateState (state, { payload }) {
      return { ...state, ...payload }
    }
  }
}
