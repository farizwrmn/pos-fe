/**
 * Created by Veirry on 25/04/2018.
 */
import moment from 'moment'
import {
  query
} from '../../services/report/woReport'

export default {
  namespace: 'woReport',

  state: {
    listTrans: [],
    fromDate: moment().format('YYYY-MM-DD'),
    toDate: moment().format('YYYY-MM-DD'),
    activeKey: '1',
    modalFilterPeakHour: false,
    pagination: {
      current: 1,
      total: null
    }
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        const { activeKey } = location.query
        dispatch({
          type: 'updateState',
          payload: {
            activeKey: activeKey || '1',
            listTrans: []
          }
        })
        if (location.pathname === '/report/pos/summary') {
          dispatch({
            type: 'setListNull'
          })
        }
      })
    }
  },
  effects: {
    * queryPeakHour ({ payload }, { call, put }) {
      const data = yield call(query, payload)
      if (data.success) {
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
      } else {
        throw data
      }
    }
  },
  reducers: {
    querySuccessTrans (state, { payload }) {
      return {
        ...state,
        payload,
        pagination: {
          ...state.pagination,
          ...payload.pagination
        }
      }
    },
    setListNull (state) {
      return {
        ...state,
        listTrans: [],
        fromDate: moment().format('YYYY-MM-DD'),
        toDate: moment().format('YYYY-MM-DD'),
        activeKey: '1',
        modalFilterPeakHour: false,
        pagination: {
          current: 1,
          total: null
        }
      }
    }
  }
}
