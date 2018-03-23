/**
 * Created by Veirry on 19/09/2017.
 */
import { queryTrans, queryReturn, queryPurchaseDaily } from '../../services/report/purchase'
import { query, queryDetail } from '../../services/purchase'

export default {
  namespace: 'purchaseReport',

  state: {
    list: [],
    listTrans: [],
    listDaily: [],
    category: 'ALL CATEGORY',
    brand: 'ALL BRAND',
    fromDate: '',
    toDate: '',
    listPurchase: [],
    listPurchaseDetail: [],
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
        if (location.pathname === '/report/purchase/return' && location.query.from) {
          dispatch({
            type: 'setListNull'
          })
          dispatch({
            type: 'queryReturn',
            payload: location.query
          })
        } else if (location.pathname === '/report/purchase/return') {
          dispatch({
            type: 'setListNull'
          })
        } else if (location.pathname === '/report/purchase/summary/trans') {
          dispatch({
            type: 'setListNull'
          })
        }
      })
    }
  },
  effects: {
    * queryTrans ({ payload }, { call, put }) {
      let data = []
      data = yield call(queryTrans, payload)
      yield put({
        type: 'querySuccessTrans',
        payload: {
          listTrans: data.data,
          fromDate: payload.from,
          toDate: payload.to
        }
      })
    },
    * queryReturn ({ payload }, { call, put }) {
      let data = []
      if (payload) {
        data = yield call(queryReturn, payload)
        yield put({
          type: 'querySuccessTrans',
          payload: {
            listTrans: data.data,
            fromDate: payload.from,
            toDate: payload.to
          }
        })
      } else {
        data = yield call(queryReturn)
      }
    },
    * queryDaily ({ payload }, { call, put }) {
      let data = yield call(queryPurchaseDaily, payload)
      yield put({
        type: 'querySuccessTrans',
        payload: {
          listDaily: data.data,
          fromDate: payload.from,
          toDate: payload.to,
          ...payload
        }
      })
    },
    * queryPurchase ({ payload }, { call, put }) {
      let data = yield call(query, payload)
      if (data.success) {
        yield put({
          type: 'querySuccessPurchase',
          payload: {
            listPurchase: data.data,
            fromDate: payload.startPeriod,
            toDate: payload.endPeriod
          }
        })
      }
    },
    * queryPurchaseDetail ({ payload }, { call, put }) {
      let data = yield call(queryDetail, payload)
      if (data.success) {
        yield put({
          type: 'querySuccessPurchaseDetail',
          payload: {
            listPurchaseDetail: data.data
          }
        })
      } else {
        throw data
      }
    }
  },
  reducers: {
    querySuccessPurchase (state, { payload }) {
      const { listPurchase, fromDate, toDate } = payload

      return {
        ...state,
        listPurchase,
        fromDate,
        toDate,
        ...payload
      }
    },
    querySuccessPurchaseDetail (state, { payload }) {
      const { listPurchaseDetail } = payload

      return {
        ...state,
        listPurchaseDetail,
        ...payload
      }
    },
    querySuccessTrans (state, action) {
      const { listTrans } = action.payload
      return {
        listTrans,
        ...state,
        ...action.payload
      }
    },
    setDate (state, action) {
      return { ...state, fromDate: action.payload.from, toDate: action.payload.to, ...action.payload }
    },
    setListNull (state, action) {
      return {
        ...state,
        list: [],
        listTrans: [],
        listDaily: [],
        listPurchase: [],
        listPurchaseDetail: [],
        ...action.payload
      }
    }
  }
}
