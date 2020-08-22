import moment from 'moment'
import { queryPayable } from '../../services/payment/payable'
import { queryPaymentPos } from '../../services/payment'

export default {

  namespace: 'accountPayment',

  state: {
    activeKey: '1',
    listPayment: [],
    tmpListPayment: []
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        const { activeKey } = location.query
        if (location.pathname === '/accounts/payable') {
          dispatch({
            type: 'updateState',
            payload: {
              listPayment: [],
              tmpListPayment: [],
              changed: false,
              activeKey: activeKey || '2'
            }
          })
          dispatch({
            type: 'queryPurchase',
            payload: {
              from: moment().startOf('month').format('YYYY-MM-DD'),
              to: moment().endOf('month').format('YYYY-MM-DD')
            }
          })
        }
        if (location.pathname === '/accounts/payment') {
          dispatch({
            type: 'updateState',
            payload: {
              listPayment: [],
              tmpListPayment: [],
              changed: false,
              activeKey: activeKey || '1'
            }
          })
          dispatch({
            type: 'queryHistoryPayment',
            payload: {
              from: moment().startOf('month').format('YYYY-MM-DD'),
              to: moment().endOf('month').format('YYYY-MM-DD'),
              ...location.query
            }
          })
        }
      })
    }
  },

  effects: {
    * queryHistoryPayment ({ payload = {} }, { call, put }) {
      const data = yield call(queryPaymentPos, payload)
      if (data) {
        yield put({
          type: 'querySuccessPayment',
          payload: {
            listPayment: data.data,
            tmpListPayment: data.data,
            pagination: {
              current: Number(payload.page) || 1,
              pageSize: Number(payload.pageSize) || 5,
              // pageSizeOptions: ['5','10','20','50'],
              total: data.total
            }
          }
        })
      }
    },
    * queryPurchase ({ payload = {} }, { call, put }) {
      const data = yield call(queryPayable, payload)
      if (data) {
        yield put({
          type: 'querySuccessPayment',
          payload: {
            listPayment: data.data,
            tmpListPayment: data.data,
            pagination: {
              current: Number(payload.page) || 1,
              pageSize: Number(payload.pageSize) || 5,
              // pageSizeOptions: ['5','10','20','50'],
              total: data.total
            }
          }
        })
      }
    }
  },

  reducers: {
    querySuccessPayment (state, action) {
      const { listPayment, pagination, tmpListPayment } = action.payload
      return {
        ...state,
        listPayment,
        tmpListPayment,
        pagination: {
          ...state.pagination,
          ...pagination
        }
      }
    },
    querySuccess (state, { payload }) {
      const { data } = payload
      return {
        ...state,
        data
      }
    },
    updateState (state, { payload }) {
      return { ...state, ...payload }
    }
  }
}
