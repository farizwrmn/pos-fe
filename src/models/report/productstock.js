import modelExtend from 'dva-model-extend'
import moment from 'moment'
import { queryProductsBelowMinimum } from '../../services/master/productstock'
import { queryLastActive } from '../../services/period'
import { pageModel } from './../common'

export default modelExtend(pageModel, {
  namespace: 'productstockReport',

  state: {
    listProductsBelowQty: []
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/report/product/stock/quantity-alerts') {
          dispatch({
            type: 'queryPeriod'
          })
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
      }
    },
    * queryProductsBelowMinimum ({ payload = {} }, { call, put }) {
      const data = yield call(queryProductsBelowMinimum, payload)
      if (data) {
        yield put({
          type: 'querySuccess',
          payload: {
            listProductsBelowQty: data.data
          }
        })
      }
    }
  },

  reducers: {
    querySuccess (state, action) {
      const { listProductsBelowQty, pagination } = action.payload
      return {
        ...state,
        listProductsBelowQty,
        pagination: {
          ...state.pagination,
          ...pagination
        }
      }
    }
  }
})
