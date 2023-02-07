import modelExtend from 'dva-model-extend'
import { getConsignmentId } from 'utils/lstorage'
import { query, insertData as queryInsertData } from 'services/consignment/stockAdjustment'
import {
  queryById as queryProductById
} from 'services/consignment/stockFlowRequestProductService'
import {
  query as queryVendor,
  querySearch as querySearchVendor
} from 'services/consignment/vendors'
import {
  queryByVendorId as queryProductByVendorId
} from 'services/consignment/products'
import { message } from 'antd'
import { pageModel } from '../common'

const success = () => {
  return message.success('Berhasil')
}

const error = (msg) => {
  return message.error(msg)
}

export default modelExtend(pageModel, {
  namespace: 'consignmentStockAdjustment',

  state: {
    activeKey: '0',
    list: [],

    consignmentId: getConsignmentId(),

    vendorList: [],
    selectedVendor: [],

    productList: [],
    selectedVendorProductList: [],

    currentItem: [],

    q: '',
    typeFilter: null,
    statusFilter: null,
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      current: 1
    }
  },

  subscriptions: {
    setup ({ history, dispatch }) {
      history.listen((location) => {
        if (location.pathname === '/integration/consignment/stock-adjustment') {
          dispatch({
            type: 'queryVendor',
            payload: {
              productList: [
                {
                  id: null,
                  product_name: null,
                  stockId: null,
                  quantity: 1,
                  normalPrice: 1,
                  grabPrice: 1,
                  grabMartPrice: 1,
                  commercePrice: 1
                }
              ]
            }
          })
          dispatch({
            type: 'query',
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
          q: payload.q,
          typeFilter: payload.typeFilter,
          statusFilter: payload.statusFilter,
          pagination: payload.pagination || { current: 1, pageSize: 10 }
        }
        const response = yield call(query, params)
        console.log('query data', response)
        yield put({
          type: 'querySuccess',
          payload: {
            list: response.data.list,
            pagination: {
              showSizeChanger: true,
              showQuickJumper: true,
              current: response.data.page,
              pageSize: response.data.pageSize,
              total: response.data.count
            },
            typeFilter: payload.typeFilter,
            statusFilter: payload.statusFilter,
            q: payload.q
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
    * queryAdd ({ payload = {} }, { call, put }) {
      const inserted = yield call(queryInsertData, payload)
      if (inserted.success) {
        success()
        yield put({
          type: 'querySuccess',
          payload: {
            productList: [
              {
                id: null,
                product_name: null,
                stockId: null,
                quantity: 1,
                normalPrice: 1,
                grabPrice: 1,
                grabMartPrice: 1,
                commercePrice: 1
              }
            ],
            selectedVendorProductList: [],
            ...payload
          }
        })
      } else {
        error(inserted.message)
        yield put({
          type: 'querySuccess',
          payload: {}
        })
      }
    },
    * queryProductById ({ payload = {} }, { call, put }) {
      const data = yield call(queryProductById, payload)
      console.log('query data', data)
      yield put({ type: 'querySuccess', payload: { currentItem: data.data, ...payload } })
    },
    * queryVendor ({ payload = {} }, { call, put }) {
      const { q, pagination } = payload
      const params = {
        q,
        pagination: pagination || { current: 1, pageSize: 10 }
      }
      const response = yield call(queryVendor, params)
      yield put({ type: 'querySuccess', payload: { vendorList: response.data.list, ...payload } })
    },
    * querySearchVendor ({ payload = {} }, { call, put }) {
      const params = {
        q: payload.q
      }
      const response = yield call(querySearchVendor, params)
      yield put({ type: 'querySuccess', payload: { vendorList: response.data, ...payload } })
    },
    * queryByVendorId ({ payload = {} }, { call, put }) {
      const consignmentId = getConsignmentId()
      const params = {
        vendorId: payload.selectedVendor.id,
        outletId: consignmentId
      }
      const response = yield call(queryProductByVendorId, params)
      yield put({ type: 'querySuccess', payload: { selectedVendorProductList: response.data, ...payload } })
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
