/**
 * Created by Veirry on 19/09/2017.
 */
// import { query as queryReport, queryTrans } from '../../services/report/purchase'
import { queryIn , queryOut } from '../../services/report/adjust'

export default {
  namespace: 'adjustReport',

  state: {
    list: [],
    listTrans: [],
    listOut: [],
    fromDate: null,
    toDate: null,
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
        if (location.pathname === '/report/adjust/in') {
          dispatch({
            type: 'queryInAdj',
            payload: location.query,
          })
        } else if (location.pathname === '/report/adjust/out') {
          dispatch({
            type: 'queryOutAdj',
            payload: location.query,
          })
        }
      })
    },
  },
  effects: {
    * queryInAdj ({ payload = {} }, { call, put }) {
      const date = payload
      yield put({
        type: 'setDate',
        payload: date,
      })
      const data = yield call(queryIn, payload)
      if (data.data.length > 0) {
        yield put({
          type: 'querySuccessTrans',
          payload: {
            listTrans: data.data,
            listOut: [],
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
      }
    },
    * queryOutAdj ({ payload = {} }, { call, put }) {
      const date = payload
      yield put({
        type: 'setDate',
        payload: date,
      })
      const data = yield call(queryOut, payload)
      if (data.data.length > 0) {
        yield put({
          type: 'querySuccessTrans',
          payload: {
            listTrans: [],
            listOut: data.data,
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
      }
    },
  },
  reducers: {
    querySuccessTrans (state, action) {
      const { listTrans, listOut, date, pagination, tmpList } = action.payload
      return { ...state,
        listTrans,
        listOut,
        fromDate: date.from,
        toDate: date.to,
        tmpList,
        pagination: {
          ...state.pagination,
          ...pagination,
        },
      }
    },
    setDate (state, action) {
      return { ...state, fromDate: action.payload.from, toDate: action.payload.to}
    },
    setListNull (state, action) {
      return { ...state, list: [], listTrans: []}
    },
  },
}
