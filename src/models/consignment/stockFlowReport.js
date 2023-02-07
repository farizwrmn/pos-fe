import modelExtend from 'dva-model-extend'
import { getConsignmentId } from 'utils/lstorage'
import {
  query
} from 'services/consignment/stockHistories'
import {
  query as queryVendor
} from 'services/consignment/vendors'
import {
  queryByVendorId as queryProductByVendorId
} from 'services/consignment/products'
import { pageModel } from '../common'


export default modelExtend(pageModel, {
  namespace: 'consignmentStockFlowReport',

  state: {
    activeKey: '0',
    list: [],
    stockData: {},

    consignmentId: getConsignmentId(),

    vendorList: [],
    selectedVendor: {},
    selectedVendorProduct: [],
    selectedProduct: {},

    dateRange: [],
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
        if (location.pathname === '/integration/consignment/stock-flow-report') {
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
          outletId: consignmentId,
          stockId: payload.stockId
        }
        const response = yield call(query, params)
        let data = response.data.list
        let stock = response.data.stock
        if (data.length > 1) {
          data.push(stock)
        }
        console.log('response', response)
        yield put({
          type: 'querySuccess',
          payload: {
            ...payload,
            list: data,
            stockData: response.data.stock
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
    },
    * queryProductByVendorId ({ payload = {} }, { call, put }) {
      const consignmentId = getConsignmentId()
      if (consignmentId) {
        const selectedVendor = payload.selectedVendor
        const params = {
          vendorId: selectedVendor.id,
          outletId: consignmentId
        }
        const response = yield call(queryProductByVendorId, params)
        console.log('data.data', response.data)
        yield put({ type: 'querySuccess', payload: { selectedVendorProduct: response.data, selectedVendor } })
      } else {
        yield put({ type: 'querySuccess', payload: { selectedVendorProduct: [] } })
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
