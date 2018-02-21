/**
 * Created by Veirry on 04/10/2017.
 */
import { query as queryReport, queryAll, queryTransCancel, queryPosDaily } from '../../services/report/pos'
import { queryPaymentWithPOS } from '../../services/payment/payment'

export default {
  namespace: 'accountsReport',

  state: {
    list: [],
    listTrans: [],
    listDaily: [],
    from: '',
    to: '',
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
        if (location.pathname === '/report/accounts/payment') {
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
          from: payload.from,
          to: payload.to,
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
          from: payload.from,
          to: payload.to,
          pagination: {
            total: data.total
          }
        }
      })
    },
    * queryTrans ({ payload }, { call, put }) {
      let data = []
      if (payload) {
        data = yield call(queryPaymentWithPOS, payload)
      } else {
        data = yield call(queryPaymentWithPOS)
      }
      yield put({
        type: 'querySuccessTrans',
        payload: {
          listTrans: data.data,
          pagination: {
            total: data.total
          },
          from: payload.from,
          to: payload.to
        }
      })
    },
    * queryDaily ({ payload }, { call, put }) {
      let data = yield call(queryPosDaily, payload)
      yield put({
        type: 'querySuccessDaily',
        payload: {
          listDaily: data.data,
          from: payload.from,
          to: payload.to,
          ...payload
        }
      })
    }
  },
  reducers: {
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
      const { listTrans, pagination, tmpList, from, to } = action.payload

      return {
        ...state,
        listTrans,
        from,
        to,
        tmpList,
        pagination: {
          ...state.pagination,
          ...pagination
        }
      }
    },
    setDate (state, action) {
      return { ...state, from: action.payload.from, to: action.payload.to, ...action.payload }
    },
    setListNull (state) {
      return {
        ...state,
        list: [],
        listTrans: [],
        listDaily: [],
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
