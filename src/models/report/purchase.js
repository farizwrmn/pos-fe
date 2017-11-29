/**
 * Created by Veirry on 19/09/2017.
 */
import { query as queryReport, queryTrans, queryReturn } from '../../services/report/purchase'
import { queryMode as miscQuery } from '../../services/misc'

export default {
  namespace: 'purchaseReport',

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
        if (location.pathname === '/report/purchase/return' && location.query.from) {
          dispatch({
            type: 'setListNull'
          })
          dispatch({
            type: 'queryReturn',
            payload: location.query,
          })
        } else if(location.pathname === '/report/purchase/return') {
          dispatch({
            type: 'setListNull'
          })
        } else if (location.pathname === '/report/purchase/summary/trans') {
          dispatch({
            type: 'setListNull'
          })
        }
      })
    },
  },
  effects: {
    * queryTrans({ payload }, { call, put }) {
      let data = new Array()
      data = yield call(queryTrans, payload)
      yield put({
        type: 'querySuccessTrans',
        payload: {
          listTrans: data.data,
          fromDate: payload.from,
          toDate: payload.to,
        },
      })
    },
    * queryReturn({ payload }, { call, put }) {
      let data = new Array()
      if (payload) {
        data = yield call(queryReturn, payload)
        yield put({
          type: 'querySuccessTrans',
          payload: {
            listTrans: data.data,
            fromDate: payload.from,
            toDate: payload.to
          },
        })
      } else {
        data = yield call(queryReturn)
      }
    }
  },
  reducers: {
    querySuccessTrans(state, action) {
      const { listTrans} = action.payload
      return {
        ...state,
        ...action.payload
      }
    },
    setDate(state, action) {
      return { ...state, fromDate: action.payload.from, toDate: action.payload.to }
    },
    setListNull(state, action) {
      return { ...state, list: [], listTrans: [] }
    },
  },
}
