/**
 * Created by Veirry on 04/10/2017.
 */
import { query as queryReport, queryTrans, queryAll, queryTransCancel } from '../../services/report/pos'

export default {
  namespace: 'posReport',

  state: {
    list: [],
    listTrans: [],
    fromDate: '',
    toDate: '',
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
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/report/pos/service' && location.query.from) {
          dispatch({
            type: 'setListNull'
          })
          dispatch({
            type: 'queryTransAll',
            payload: location.query,
          })
        } else if (location.pathname === '/report/pos/summary/trans') {
          dispatch({
            type: 'setListNull'
          })
        } else if (location.pathname === '/report/pos/monthly') {
          dispatch({
            type: 'setListNull'
          })
        } else if (location.pathname === '/report/pos/cancel' && location.query.from && location.query.to) {
          dispatch({
            type: 'setListNull'
          })
          dispatch({
            type: 'queryTransCancel',
            payload: location.query,
          })
        } else if (location.pathname === '/report/pos/service') {
          dispatch({
            type: 'setListNull'
          })
        } else if (location.pathname === '/report/pos/service') {
          dispatch({
            type: 'setListNull'
          })
        } else if (location.pathname === '/report/pos/cancel') {
          dispatch({
            type: 'setListNull'
          })
        }
      })
    },
  },
  effects: {
    * queryPart({ payload }, { call, put }) {
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
            total: data.total,
          },
        },
      })
    },
    * queryTransAll({ payload }, { call, put }) {
      const data = yield call(queryAll, payload)
      yield put({
        type: 'querySuccessTrans',
        payload: {
          listTrans: data.data,
          fromDate: payload.from,
          toDate: payload.to,
          pagination: {
            total: data.total,
          },
        },
      })
    },
    * queryTransCancel({ payload }, { call, put }) {
      const data = yield call(queryTransCancel, payload)
      yield put({
        type: 'querySuccessTrans',
        payload: {
          listTrans: data.data,
          fromDate: payload.from,
          toDate: payload.to,
          pagination: {
            total: data.total,
          },
        },
      })
    },
    * queryTrans({ payload }, { call, put }) {
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
            total: data.total,
          },
          fromDate: payload.from,
          toDate: payload.to,
        },
      })
    },
  },
  reducers: {
    querySuccessPart(state, action) {
      const { list, pagination, tmpList } = action.payload

      return {
        ...state,
        list,
        tmpList,
        pagination: {
          ...state.pagination,
          ...pagination,
        },
      }
    },
    querySuccessTrans(state, action) {
      const { listTrans, pagination, tmpList, fromDate, toDate } = action.payload

      return {
        ...state,
        listTrans,
        fromDate,
        toDate,
        tmpList,
        pagination: {
          ...state.pagination,
          ...pagination,
        },
      }
    },
    setDate(state, action) {
      return { ...state, fromDate: action.payload.from, toDate: action.payload.to }
    },
    setListNull(state) {
      return {
        ...state,
        list: [],
        listTrans: [],
        pagination: {
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: total => `Total ${total} Records`,
          current: 1,
          total: null,
        },
      }
    },
  },
}
