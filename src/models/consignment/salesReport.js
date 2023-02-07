import modelExtend from 'dva-model-extend'
import { getConsignmentId } from 'utils/lstorage'
import {
  query
} from 'services/consignment/salesOrderProducts'
import {
  query as queryVendor
} from 'services/consignment/vendors'
import { pageModel } from '../common'

export default modelExtend(pageModel, {
  namespace: 'consignmentSalesReport',

  state: {
    activeKey: '0',
    list: [],

    vendorList: [],
    selectedVendor: {},

    consignmentId: getConsignmentId(),

    dateRange: null,
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      current: 1
    }
  },

  subscriptions: {
    setup ({ history, dispatch }) {
      history.listen((location) => {
        console.log('location.pathname', location.pathname)
        if (location.pathname === '/integration/consignment/sales-report' ||
          location.pathname === '/integration/consignment/dashboard') {
          dispatch({
            type: 'queryVendor',
            payload: {}
          })
        }
      })
    }
  },

  effects: {
    * query ({ payload = {} }, { call, put }) {
      const consignmentId = getConsignmentId()
      if (consignmentId) {
        const params = {
          vendorId: payload.vendorId,
          outletId: consignmentId,
          from: payload.from,
          to: payload.to
        }
        const response = yield call(query, params)
        yield put({
          type: 'querySuccess',
          payload: {
            list: response.data
          }
        })
      } else {
        yield put({
          type: 'querySuccess',
          payload: {
            list: []
          }
        })
      }
    },
    * queryVendor ({ payload = {} }, { call, put }) {
      const { q } = payload
      const params = {
        q,
        pagination: { current: 1, pageSize: 10 }
      }
      const response = yield call(queryVendor, params)
      const vendors = response.data.list
      yield put({ type: 'querySuccess', payload: { vendorList: vendors, ...payload } })
    }
  },

  reducers: {
    querySuccess (state, action) {
      return {
        ...state,
        ...action.payload
      }
    },
    updateState (state, action) {
      console.log('action.payload', action.payload)
      return {
        ...state,
        ...action.payload
      }
    }
  }
})
