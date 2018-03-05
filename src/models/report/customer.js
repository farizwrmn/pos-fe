import modelExtend from 'dva-model-extend'
import { queryCustomerHistory, queryCustomerAsset } from '../../services/report/pos'
import { pageModel } from './../common'

export default modelExtend(pageModel, {
  namespace: 'customerReport',

  state: {
    modalVisible: false,
    listPoliceNo: [],
    listAsset: [],
    customerInfo: {},
    listHistory: [],
    from: '',
    to: '',
    activeKey: 0
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        const { activeKey, ...other } = location.query
        if (location.pathname === '/report/customer/history') {
          dispatch({ type: 'queryCustomerAsset', payload: other })
          dispatch({
            type: 'updateState',
            payload: {
              activeKey: activeKey || 0
            }
          })
        }
      })
    }
  },

  effects: {

    * query ({ payload = {} }, { call, put }) {
      const data = yield call(queryCustomerHistory, payload)
      if (data) {
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
      const data = yield call(queryCustomerHistory, payload)
      if (data) {
        yield put({
          type: 'updateState',
          payload: {
            listPoliceNo: data.data
          }
        })
      }
    },
    * queryCustomerAsset ({ payload = {} }, { call, put }) {
      const data = yield call(queryCustomerAsset, payload)
      if (data) {
        yield put({
          type: 'querySuccessAsset',
          payload: {
            listAsset: data.data
          }
        })
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
