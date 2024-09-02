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
import moment from 'moment'
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
        if (location.pathname === '/integration/consignment/stock-flow-report') {
          dispatch({
            type: 'queryVendor',
            payload: {}
          })
          if (location.query && location.query.activeKey) {
            dispatch({
              type: 'updateState',
              payload: {
                activeKey: location.query.activeKey
              }
            })
          } else {
            dispatch({
              type: 'updateState',
              payload: {
                activeKey: '0'
              }
            })
          }
        }
      })
    }
  },

  effects: {
    * query ({ payload = {} }, { call, put }) {
      const consignmentId = getConsignmentId()
      const { stockId, dateRange } = payload
      if (consignmentId) {
        const params = {
          outletId: consignmentId,
          stockId,
          from: moment(dateRange[0]).format('YYYY-MM-DD'),
          to: moment(dateRange[1]).format('YYYY-MM-DD')
        }
        const response = yield call(query, params)
        let data = response.data.list
        let stock = response.data.stock
        if (data.length > 0) {
          data.push(stock)
        }
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
