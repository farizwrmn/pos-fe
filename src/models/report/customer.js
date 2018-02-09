import modelExtend from 'dva-model-extend'
import { queryCustomerHistory } from '../../services/report/pos'
import { pageModel } from './../common'

export default modelExtend(pageModel, {
  namespace: 'customerReport',

  state: {
    modalVisible: false,
    listPoliceNo: [],
    customerInfo: {},
    listHistory: [],
    from: '',
    to: ''
  },

  subscriptions: {
    setup ({ history }) {
      history.listen((location) => {
        if (location.pathname === '/report/customer/history') {
          //
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
    }
  }
})
