import modelExtend from 'dva-model-extend'
import {
  query
} from 'services/consignment/vendorCommission'
import { pageModel } from '../common'


export default modelExtend(pageModel, {
  namespace: 'consignmentVendorCommission',

  state: {
    modalState: false,
    activeKey: '0',
    formType: 'add',
    list: [],
    selectedVendor: {},
    lastVendor: {},
    q: null,
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      current: 1
    }
  },

  subscriptions: {},

  effects: {
    * query ({ payload = {} }, { call, put }) {
      console.log('consignmentVendorCommission/query', payload)
      const params = {
        vendorId: payload.vendorId,
        type: 'all',
        order: 'outletId'
      }
      const response = yield call(query, params)

      if (response && response.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            ...payload,
            list: response.data
          }
        })
      } else {
        throw response
      }
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
      return {
        ...state,
        ...action.payload
      }
    }
  }
})
