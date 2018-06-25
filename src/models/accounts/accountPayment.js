import { configMain } from 'utils'
import { queryPayable } from '../../services/payment/payable'
import { query as queryPos } from '../../services/payment'

const { prefix } = configMain

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
        if (location.pathname === '/accounts/payment') {
          const { activeKey } = location.query
          const infoStore = localStorage.getItem(`${prefix}store`) ? JSON.parse(localStorage.getItem(`${prefix}store`)) : null
          if (activeKey === '2') {
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
                from: infoStore.startPeriod,
                to: infoStore.endPeriod
              }
            })
          } else {
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
              type: 'queryHistory',
              payload: {
                startPeriod: infoStore.startPeriod,
                endPeriod: infoStore.endPeriod
              }
            })
          }
        }
      })
    }
  },

  effects: {
    * queryHistory ({ payload = {} }, { call, put }) {
      const data = yield call(queryPos, payload)
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
