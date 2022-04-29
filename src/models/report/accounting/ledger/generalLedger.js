/**
 * Created by Veirry on 22/06/2020.
 */
import moment from 'moment'
import {
  generalLedger,
  trialBalance
} from 'services/report/accounting/ledger'

export default {
  namespace: 'generalLedger',

  state: {
    listRekap: [],
    period: moment().format('MM'),
    year: moment().format('YYYY'),
    from: moment().startOf('month'),
    to: moment().endOf('month'),
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
        if (location.query.from && location.query.to && (
          location.pathname === '/report/accounting/consolidation/general-ledger'
          || location.pathname === '/report/accounting/general-ledger'
        )) {
          dispatch({
            type: 'queryGeneralLedger',
            payload: location.query
          })
        }
        if (location.pathname === '/report/accounting/consolidation/trial-balance' && location.query.from && location.query.to) {
          dispatch({
            type: 'queryTrialBalance',
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
            from: payload.from,
            to: payload.to,
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
    },
    * queryTrialBalance ({ payload = {} }, { call, put }) {
      const date = payload
      yield put({
        type: 'updateState',
        payload: {
          from: payload.from,
          to: payload.to
        }
      })
      yield put({
        type: 'setNull',
        payload: date
      })
      const data = yield call(trialBalance, payload)
      if (data.success) {
        yield put({
          type: 'querySuccessTrans',
          payload: {
            listRekap: data.data,
            period: payload.period,
            year: payload.year,
            from: payload.from,
            to: payload.to,
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
      return { ...state, period: action.payload.period, year: action.payload.year, from: action.payload.from, to: action.payload.to }
    },
    setNull (state) {
      return { ...state, listRekap: [] }
    },
    updateState (state, { payload }) {
      return { ...state, ...payload }
    }
  }
}
