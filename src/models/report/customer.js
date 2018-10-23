import modelExtend from 'dva-model-extend'
import { queryCustomerHistory, queryCustomerAsset } from '../../services/report/pos'
import { queryUnits } from '../../services/master/customer'
import { queryReportCashback } from '../../services/report/customer'
import { pageModel } from './../common'

export default modelExtend(pageModel, {
  namespace: 'customerReport',

  state: {
    modalVisible: { showChoice: false, showCustomer: false },
    listPoliceNo: [],
    listAsset: [],
    listCashback: [],
    customerInfo: {},
    listHistory: [],
    from: '',
    to: '',
    activeKey: '0'
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        const { activeKey } = location.query
        if (location.pathname === '/report/customer/history') {
          dispatch({
            type: 'updateState',
            payload: {
              activeKey: activeKey || '0'
            }
          })
        }
      })
    }
  },

  effects: {

    * query ({ payload = {} }, { call, put }) {
      const data = yield call(queryCustomerHistory, payload)
      if (data.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            listHistory: data.data,
            pagination: {
              current: Number(payload.page) || 1,
              pageSize: Number(payload.pageSize) || 10,
              total: data.total
            }
          }
        })
      }
    },
    * queryPoliceNo ({ payload = {} }, { call, put }) {
      // const data = yield call(queryCustomerHistory, payload)
      const data = yield call(queryUnits, payload)
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            listPoliceNo: data.data
          }
        })
      } else {
        throw data
      }
    },
    * queryCustomerAsset ({ payload = {} }, { call, put }) {
      const data = yield call(queryCustomerAsset, payload)
      if (data.success) {
        yield put({
          type: 'querySuccessAsset',
          payload: {
            listAsset: data.data
          }
        })
      } else {
        throw data
      }
    },

    * queryCustomerCashbackHistory ({ payload = {} }, { call, put }) {
      const data = yield call(queryReportCashback, payload)
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            listCashback: data.data
          }
        })
        if (payload.posDate) {
          yield put({
            type: 'updateState',
            payload: {
              from: payload.posDate[0],
              to: payload.posDate[1]
            }
          })
        }
      } else {
        throw data
      }
    }

  },

  reducers: {
    querySuccess (state, action) {
      const { listHistory, pagination } = action.payload
      return {
        ...state,
        listHistory,
        pagination: {
          ...state.pagination,
          ...pagination
        }
      }
    },
    querySuccessAsset (state, action) {
      const { listAsset, pagination } = action.payload
      return {
        ...state,
        listAsset,
        pagination: {
          ...state.pagination,
          ...pagination
        }
      }
    }
  }
})
