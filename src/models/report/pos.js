/**
 * Created by Veirry on 04/10/2017.
 */
import {
  query as queryReport,
  queryTrans,
  queryAll,
  queryTransCancel,
  queryPosDaily,
  queryPOS,
  queryPOSDetail
} from '../../services/report/pos'

export default {
  namespace: 'posReport',

  state: {
    list: [],
    listTrans: [],
    listDaily: [],
    listPOS: [],
    listPOSDetail: [],
    fromDate: '',
    toDate: '',
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
        if ((location.pathname === '/report/pos/service' && location.query.from) || (location.pathname === '/report/pos/unit' && location.query.from)) {
          dispatch({
            type: 'setListNull'
          })
          dispatch({
            type: 'queryTransAll',
            payload: location.query
          })
        } else if (location.pathname === '/report/pos/service' || location.pathname === '/report/pos/unit' || location.pathname === '/report/pos/summary') {
          dispatch({
            type: 'setListNull'
          })
        } else if (location.pathname === '/report/pos/monthly') {
          dispatch({
            type: 'setListNull'
          })
        }
      })
    }
  },
  effects: {
    * queryPart ({ payload }, { call, put }) {
      let data = []
      if (payload) {
        data = yield call(queryReport, payload)
      } else {
        data = yield call(queryReport)
      }
      yield put({
        type: 'querySuccessPart',
        payload: {
          list: data.data,
          pagination: {
            total: data.total
          }
        }
      })
    },
    * queryTransAll ({ payload }, { call, put }) {
      const data = yield call(queryAll, payload)
      yield put({
        type: 'querySuccessTrans',
        payload: {
          listTrans: data.data,
          fromDate: payload.from,
          toDate: payload.to,
          pagination: {
            total: data.total
          }
        }
      })
    },
    * queryTransCancel ({ payload }, { call, put }) {
      const data = yield call(queryTransCancel, payload)
      yield put({
        type: 'querySuccessTrans',
        payload: {
          listTrans: data.data,
          fromDate: payload.from,
          toDate: payload.to,
          pagination: {
            total: data.total
          }
        }
      })
    },
    * queryTrans ({ payload }, { call, put }) {
      let data = []
      if (payload) {
        data = yield call(queryTrans, payload)
      } else {
        data = yield call(queryTrans)
      }
      yield put({
        type: 'querySuccessTrans',
        payload: {
          listTrans: data.data,
          pagination: {
            total: data.total
          },
          fromDate: payload.from,
          toDate: payload.to
        }
      })
    },
    * queryDaily ({ payload }, { call, put }) {
      let data = yield call(queryPosDaily, payload)
      yield put({
        type: 'querySuccessDaily',
        payload: {
          listDaily: data.data,
          fromDate: payload.from,
          toDate: payload.to,
          ...payload
        }
      })
    },
    * queryPOS ({ payload }, { call, put }) {
      let data = yield call(queryPOS, payload)
      if (data.success) {
        yield put({
          type: 'querySuccessPOS',
          payload: {
            listPOS: data.data,
            fromDate: payload.startPeriod,
            toDate: payload.endPeriod
          }
        })
      }
    },
    * queryPOSDetail ({ payload }, { call, put }) {
      let data = yield call(queryPOSDetail, payload)
      if (data.success) {
        yield put({
          type: 'querySuccessPOSDetail',
          payload: {
            listPOSDetail: data.data
          }
        })
      } else {
        throw data
      }
    }
  },
  reducers: {
    querySuccessPOS (state, { payload }) {
      const { listPOS } = payload

      return {
        ...state,
        listPOS,
        ...payload
      }
    },
    querySuccessPOSDetail (state, { payload }) {
      const { listPOSDetail } = payload

      return {
        ...state,
        listPOSDetail,
        ...payload
      }
    },
    querySuccessPart (state, action) {
      const { list, tmpList } = action.payload

      return {
        ...state,
        list,
        tmpList
      }
    },
    querySuccessDaily (state, action) {
      return {
        ...state,
        ...action.payload
      }
    },
    querySuccessTrans (state, action) {
      const { listTrans, pagination, tmpList, fromDate, toDate } = action.payload

      return {
        ...state,
        listTrans,
        fromDate,
        toDate,
        tmpList,
        pagination: {
          ...state.pagination,
          ...pagination
        }
      }
    },
    setDate (state, action) {
      return { ...state, fromDate: action.payload.from, toDate: action.payload.to, ...action.payload }
    },
    setListNull (state) {
      return {
        ...state,
        list: [],
        listTrans: [],
        listDaily: [],
        listPOS: [],
        listPOSDetail: [],
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
