/**
 * Created by Veirry on 19/09/2017.
 */
import { queryFifo } from '../../services/report/fifo'

export default {
  namespace: 'fifoReport',

  state: {
    listRekap: [],
    period: '',
    year: '',
    productCode: 'ALL TYPE',
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => `Total ${total} Records`,
      current: 1,
      total: null,
    },
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/report/fifo/summary' && location.query.period && location.query.year) {
          dispatch({
            type: 'queryInAdj',
            payload: location.query,
          })
        } else if (location.pathname === '/report/fifo/balance' && location.query.period && location.query.year) {
          dispatch({
            type: 'queryInAdj',
            payload: location.query,
          })
        } else {
          dispatch({
            type: 'setNull',
          })
        }
      })
    },
  },
  effects: {
    * queryInAdj ({ payload = {} }, { call, put }) {
      const date = payload
      yield put({
        type: 'setPeriod',
        payload: date,
      })
      yield put({
        type: 'setNull',
        payload: date,
      })
      const data = yield call(queryFifo, payload)
      if (data.data.length > 0) {
        yield put({
          type: 'querySuccessTrans',
          payload: {
            listRekap: data.data,
            pagination: {
              current: Number(payload.page) || 1,
              pageSize: Number(payload.pageSize) || 5,
              total: data.total,
            },
            date: date,
          },
        })
      } else {
        console.log('no Data')
        yield put({ type: 'setNull' })
      }
    },
  },
  reducers: {
    querySuccessTrans (state, action) {
      const { listRekap, date, pagination } = action.payload
      return { ...state,
        listRekap,
        fromDate: date.period,
        toDate: date.year,
        pagination: {
          ...state.pagination,
          ...pagination,
        },
      }
    },
    setPeriod (state, action) {
      return { ...state, period: action.payload.period, year: action.payload.year}
    },
    setNull (state) {
      return { ...state, listRekap: []}
    },
  },
};
