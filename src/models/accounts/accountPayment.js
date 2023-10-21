import moment from 'moment'
import { queryPayable, updatePurchaseById } from '../../services/payment/payable'
import { queryPaymentPos } from '../../services/payment'

export default {

  namespace: 'accountPayment',

  state: {
    activeKey: '1',
    from: null,
    to: null,
    currentItem: {},
    modalVisible: false,
    listPayment: [],
    tmpListPayment: [],
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      current: 1
    }
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        const { activeKey, q, from, to, ...otherQuery } = location.query
        if (location.pathname === '/accounts/payable') {
          let defaultFrom
          let defaultTo
          if (from && to) {
            defaultFrom = from
            defaultTo = to
          }
          if (!q && !from && !to) {
            defaultFrom = moment().startOf('months').format('YYYY-MM-DD')
            defaultTo = moment().endOf('months').format('YYYY-MM-DD')
          }

          dispatch({
            type: 'queryPurchase',
            payload: {
              from: defaultFrom,
              to: defaultTo,
              q,
              ...otherQuery
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
    * openModalTax ({ payload }, { put }) {
      yield put({
        type: 'updateState',
        payload: {
          modalVisible: true,
          currentItem: payload
        }
      })
    },
    * addTax ({ payload }, { put, call }) {
      const data = yield call(updatePurchaseById, payload)
      const { activeKey, q, from, to, ...otherQuery } = location.query
      if (data.success) {
        let defaultFrom
        let defaultTo
        if (from && to) {
          defaultFrom = from
          defaultTo = to
        }
        if (!q && !from && !to) {
          defaultFrom = moment().startOf('months').format('YYYY-MM-DD')
          defaultTo = moment().endOf('months').format('YYYY-MM-DD')
        }
        yield put({
          type: 'queryPurchase',
          payload: {
            from: defaultFrom,
            to: defaultTo,
            q,
            ...otherQuery
          }
        })
      }
    },
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
            pagination: {
              current: Number(payload.page) || 1,
              pageSize: Number(payload.pageSize) || 10,
              // pageSizeOptions: ['5','10','20','50'],
              total: data.total
            }
          }
        })
        if (payload && payload.from && payload.to) {
          yield put({
            type: 'updateState',
            payload: {
              from: payload.from,
              to: payload.to
            }
          })
        }
      }
    }
  },

  reducers: {
    querySuccessPayment (state, action) {
      const { listPayment, pagination, tmpListPayment } = action.payload
      return {
        ...state,
        listPayment,
        tmpListPayment: tmpListPayment || [],
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
    searchPOS (state, action) {
      return { ...state, listPayment: action.payload }
    },
    updateState (state, { payload }) {
      return { ...state, ...payload }
    }
  }
}
