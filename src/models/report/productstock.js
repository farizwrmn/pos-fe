import moment from 'moment'
import { queryProductsBelowMinimum } from '../../services/master/productstock'
import { query as queryTransferStockOut } from '../../services/transferStockOut'
import { queryLastActive } from '../../services/period'

export default {
  namespace: 'productstockReport',

  state: {
    listProductsBelowQty: [],
    listStockInTransit: [],
    start: '',
    end: '',
    showStockInTransit: false
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        switch (location.pathname) {
          case '/report/product/stock/quantity-alerts':
            dispatch({
              type: 'queryPeriod'
            })
            break
          case '/report/product/stock-in-transit':
            dispatch({
              type: 'queryTransferStockOut'
            })
            break
          default:
            break
        }
      })
    }
  },

  effects: {
    * queryPeriod (payload, { call, put }) {
      const data = yield call(queryLastActive)
      if (data.success) {
        const start = data.data[0].startPeriod
        yield put({
          type: 'queryProductsBelowMinimum',
          payload: {
            start,
            end: moment().format('YYYY-MM-DD')
          }
        })
        yield put({
          type: 'updateState',
          payload: {
            start,
            end: moment().format('YYYY-MM-DD')
          }
        })
      }
    },
    * queryProductsBelowMinimum ({ payload = {} }, { call, put }) {
      const data = yield call(queryProductsBelowMinimum, payload)
      if (data) {
        yield put({
          type: 'querySuccess',
          payload: {
            listProductsBelowQty: data.data,
            start: payload.start,
            end: payload.end
          }
        })
      }
    },
    * queryTransferStockOut ({ payload = {} }, { call, put }) {
      const data = yield call(queryTransferStockOut, payload)
      if (data) {
        yield put({
          type: 'querySuccess',
          payload: {
            listStockInTransit: data.data
          }
        })
      }
    }
  },

  reducers: {
    querySuccess (state, { payload }) {
      return { ...state, ...payload }
    },

    updateState (state, { payload }) {
      return { ...state, ...payload }
    }
  }
}
