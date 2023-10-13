import { message } from 'antd'
import modelExtend from 'dva-model-extend'
import {
  query,
  add
} from 'services/consignment/vendorCommission'
import { pageModel } from '../common'

const success = () => {
  message.success('Consignment has been saved')
}

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
    },
    * add ({ payload }, { call, put }) {
      const response = yield call(add, payload.data)
      if (response.success) {
        success()
        if (payload.reset) {
          payload.reset()
        }
        yield put({
          type: 'consignmentVendor/updateState',
          payload: {
            modalCommissionVisible: false
          }
        })
        yield put({
          type: 'query',
          payload: {
            vendorId: payload.data.vendorId
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
