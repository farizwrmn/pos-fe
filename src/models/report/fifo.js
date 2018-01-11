/**
 * Created by Veirry on 19/09/2017.
 */
import { queryFifo, queryFifoValue, queryFifoCard } from '../../services/report/fifo'
import { Modal } from 'antd'
import moment from 'moment'
import { error } from 'util';

export default {
  namespace: 'fifoReport',

  state: {
    listRekap: [],
    period: moment().format('MM'),
    year: moment().format('YYYY'),
    productCode: [],
    productName: [],
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => `Total ${total} Records`,
      current: 1,
      total: null,
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
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
        } else if (location.pathname === '/report/fifo/card') {
          if (location.query.period && location.query.year) {
            dispatch({
              type: 'queryProductCode',
              payload: location.query,
            })
          } else {
            dispatch({
              type: 'queryProductCode',
              payload: {
                period: moment().format('MM'),
                year: moment().format('YYYY'),
              },
            })
          }
        } else if (location.pathname === '/report/fifo/value' && location.query.period && location.query.year) {
          dispatch({
            type: 'queryFifoValues',
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
    * queryInAdj({ payload = {} }, { call, put }) {
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
            period: payload.period,
            year: payload.year,
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
        Modal.warning({
          title: 'No Data',
          content: 'No data inside storage',
        })
        yield put({ type: 'setNull' })
      }
    },
    * queryFifoValues({ payload = {} }, { call, put }) {
      const date = payload
      yield put({
        type: 'setPeriod',
        payload: date,
      })
      yield put({
        type: 'setNull',
        payload: date,
      })
      const data = yield call(queryFifoValue, payload)
      if (data.data.length > 0) {
        yield put({
          type: 'querySuccessTrans',
          payload: {
            listRekap: data.data,
            period: payload.period,
            year: payload.year,
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
        Modal.warning({
          title: 'No Data',
          content: 'No data inside storage',
        })
        yield put({ type: 'setNull' })
      }
    },
    * queryCard({ payload = {} }, { call, put }) {
      const date = payload
      yield put({
        type: 'setPeriod',
        payload: date,
      })
      let data
      try {
        data = yield call(queryFifoCard, payload)
        if (data.success === false) {
          Modal.warning({
            title: 'Something Went Wrong',
            content: 'Please Refresh the page or change params'
          })
          console.log(`error Message: ${data.message}`)
        }
      } catch (e) {
        console.log('error', e)
      }
      if (data.success) {
        if (data.data.length > 0) {
          yield put({
            type: 'querySuccessTrans',
            payload: {
              listRekap: data.data,
              period: payload.period,
              year: payload.year,
              pagination: {
                current: Number(payload.page) || 1,
                pageSize: Number(payload.pageSize) || 5,
                total: data.total,
              },
              date: date,
            },
          })
        } else {
          Modal.warning({
            title: 'No Data',
            content: `No data inside storage, ${data.message}`,
          })
        }
      }
    },
    * queryProductCode({ payload = {} }, { call, put }) {
      const date = payload
      yield put({
        type: 'setPeriod',
        payload: date,
      })
      yield put({
        type: 'setNullProduct',
        payload: date,
      })
      const data = yield call(queryFifoValue, payload)
      const productCode = data.data.map((n) => n.productCode)
      const productName = data.data.map((n) => n.productName)
      if (data.data.length > 0) {
        yield put({
          type: 'queryProductCodeSuccess',
          payload: {
            productCode: productCode,
            productName: productName,
            ...payload
          },
        })
      } else {
        Modal.warning({
          title: 'No Data',
          content: 'No data inside storage',
        })
      }
    }
  },
  reducers: {
    querySuccessTrans(state, action) {
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
          ...pagination,
        },
      }
    },
    queryProductCodeSuccess(state, action) {
      return { ...state, ...action.payload }
    },
    setPeriod(state, action) {
      return { ...state, period: action.payload.period, year: action.payload.year }
    },
    setNull(state) {
      return { ...state, listRekap: [] }
    },
    setNullProduct(state) {
      return { ...state, listRekap: [], productCode: [] }
    },
  },
};
