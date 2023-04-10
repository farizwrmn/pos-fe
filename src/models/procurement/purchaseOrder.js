import modelExtend from 'dva-model-extend'
import { routerRedux } from 'dva/router'
import { lstorage } from 'utils'
import { message } from 'antd'
import { query as querySequence } from 'services/sequence'
import {
  queryCount,
  querySupplierCount,
  querySupplierDetail,
  query,
  add,
  edit,
  remove
} from 'services/procurement/purchaseOrder'
import { pageModel } from 'models/common'

const success = () => {
  message.success('Purchase Order has been saved')
}

export default modelExtend(pageModel, {
  namespace: 'purchaseOrder',

  state: {
    currentItem: {},
    modalType: 'add',
    activeKey: '0',
    list: [],
    listQuotationTrans: [],
    listQuotationSupplier: [],
    modalQuotationVisible: false,
    listItem: [],
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      current: 1
    }
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        const { pathname } = location
        if (pathname === '/transaction/procurement/order') {
          dispatch({ type: 'querySequence' })
        }
      })
    }
  },

  effects: {
    * querySequence (payload, { select, call, put }) {
      const invoice = {
        seqCode: 'PO',
        type: lstorage.getCurrentUserStore()
      }
      const data = yield call(querySequence, invoice)
      const currentItem = yield select(({ purchaseOrder }) => purchaseOrder.currentItem)
      const transNo = data.data
      yield put({
        type: 'updateState',
        payload: {
          currentItem: {
            ...currentItem,
            transNo
          }
        }
      })
    },

    * chooseQuotation ({ payload = {} }, { select, call, put }) {
      const currentItem = yield select(({ purchaseOrder }) => purchaseOrder.currentItem)
      const response = yield call(querySupplierDetail, {
        transId: payload.transId,
        storeId: lstorage.getCurrentUserStore(),
        supplierId: payload.supplierId
      })
      if (response.success && response.data) {
        if (response.data[0]) {
          const listItem = response.data.map((item, index) => {
            return ({
              no: index + 1,
              productId: item.productId,
              productCode: item.productCode,
              productName: item.productName,
              qty: item.qty,
              purchasePrice: item.purchasePrice,
              total: item.total
            })
          })
          currentItem.supplierId = response.data[0].supplierId
          currentItem.supplierName = response.data[0].supplierName
          yield put({
            type: 'updateState',
            payload: {
              listItem,
              modalQuotationVisible: false
            }
          })
        } else {
          message.error('Not found item')
        }
      } else {
        throw response
      }
    },

    * querySupplierDetail ({ payload = {} }, { select, call, put }) {
      const response = yield call(querySupplierDetail, {
        transId: payload.transId,
        storeId: lstorage.getCurrentUserStore(),
        supplierId: payload.supplierId
      })
      if (response.success && response.data) {
        const currentItem = yield select(({ purchaseOrder }) => purchaseOrder.currentItem)
        if (response.data[0]) {
          currentItem.hasRFQ = response.data[0].hasRFQ
          currentItem.supplierId = response.data[0].supplierId
          currentItem.supplierName = response.data[0].supplierName
          yield put({
            type: 'updateState',
            payload: {
              currentItem
            }
          })
        }
        yield put({
          type: 'updateState',
          payload: {
            listSupplierDetail: response.data.map((item, index) => ({ ...item, no: index + 1 }))
          }
        })
      } else {
        yield put({
          type: 'updateState',
          payload: {
            listSupplierDetail: []
          }
        })
        throw response
      }
    },

    * queryCount (payload, { call, put }) {
      const response = yield call(queryCount, {
        storeId: lstorage.getCurrentUserStore()
      })
      if (response.success) {
        yield put({
          type: 'updateState',
          payload: {
            listQuotationTrans: response.data
          }
        })
      } else {
        yield put({
          type: 'updateState',
          payload: {
            listQuotationTrans: []
          }
        })
        throw response
      }
    },

    * querySupplierCount ({ payload = {} }, { call, put }) {
      yield put({
        type: 'updateState',
        payload: {
          listQuotationSupplier: []
        }
      })
      const response = yield call(querySupplierCount, {
        storeId: lstorage.getCurrentUserStore(),
        transId: payload.transId
      })
      if (response.success) {
        yield put({
          type: 'updateState',
          payload: {
            listQuotationSupplier: response.data
          }
        })
      } else {
        yield put({
          type: 'updateState',
          payload: {
            listQuotationSupplier: []
          }
        })
        throw response
      }
    },

    * query ({ payload = {} }, { call, put }) {
      const response = yield call(query, payload)
      if (response.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            list: response.data,
            pagination: {
              current: Number(response.page) || 1,
              pageSize: Number(response.pageSize) || 10,
              total: response.total
            }
          }
        })
      }
    },

    * delete ({ payload }, { call, put }) {
      const response = yield call(remove, payload)
      if (response.success) {
        yield put({ type: 'query' })
      } else {
        throw response
      }
    },

    * add ({ payload }, { call, put }) {
      const response = yield call(add, payload.data)
      if (response.success) {
        success()
        yield put({
          type: 'updateState',
          payload: {
            modalType: 'add',
            currentItem: {}
          }
        })
        yield put({
          type: 'query'
        })
        if (payload.reset) {
          payload.reset()
        }
      } else {
        yield put({
          type: 'updateState',
          payload: {
            currentItem: payload
          }
        })
        throw response
      }
    },

    * edit ({ payload }, { select, call, put }) {
      const id = yield select(({ purchaseOrder }) => purchaseOrder.currentItem.id)
      const newCounter = { ...payload.data, id }
      const response = yield call(edit, newCounter)
      if (response.success) {
        success()
        yield put({
          type: 'updateState',
          payload: {
            modalType: 'add',
            currentItem: {},
            activeKey: '1'
          }
        })
        const { pathname } = location
        yield put(routerRedux.push({
          pathname,
          query: {
            activeKey: '1'
          }
        }))
        yield put({ type: 'query' })
        if (payload.reset) {
          payload.reset()
        }
      } else {
        yield put({
          type: 'updateState',
          payload: {
            currentItem: payload
          }
        })
        throw response
      }
    }
  },

  reducers: {
    querySuccess (state, action) {
      const { list, pagination } = action.payload
      return {
        ...state,
        list,
        pagination: {
          ...state.pagination,
          ...pagination
        }
      }
    },

    updateState (state, { payload }) {
      return { ...state, ...payload }
    },

    changeTab (state, { payload }) {
      const { key } = payload
      return {
        ...state,
        activeKey: key,
        modalType: 'add',
        currentItem: {}
      }
    },

    editItem (state, { payload }) {
      const { item } = payload
      return {
        ...state,
        modalType: 'edit',
        activeKey: '0',
        currentItem: item
      }
    }
  }
})
