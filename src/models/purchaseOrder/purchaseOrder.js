import modelExtend from 'dva-model-extend'
import pathToRegexp from 'path-to-regexp'
import { routerRedux } from 'dva/router'
import { message, Modal } from 'antd'
import { lstorage } from 'utils'
import { prefix } from 'utils/config.main'
import moment from 'moment'
import { query, queryById, add, edit, approve, remove } from 'services/purchaseOrder/purchaseOrder'
import { query as querySequence } from 'services/sequence'
import { queryDetail as queryPurchaseDetail, queryDetailByProductId } from 'services/purchase'
import {
  query as queryProductStock,
  queryPOSproduct
} from 'services/master/productstock'
import { pageModel } from './../common'


const success = () => {
  message.success('Purchase Order has been saved')
}

export default modelExtend(pageModel, {
  namespace: 'purchaseOrder',

  state: {
    data: {},
    searchText: '',
    listDetail: [],
    listItem: [],
    listPurchaseLatestDetail: [],
    listProduct: [],
    listInvoice: [],
    list: [],
    currentItem: {},
    currentItemList: {},
    reference: null,
    referenceNo: null,
    modalType: 'add',
    activeKey: '0',
    modalEditItemVisible: false,
    modalProductVisible: false,
    modalInvoiceVisible: false,

    modalReturnVisible: false,
    pagination: {
      // showSizeChanger: true,
      // showQuickJumper: true,
      current: 1
    }
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        const { activeKey, edit, ...other } = location.query
        const { pathname } = location
        const match = pathToRegexp('/transaction/purchase/order/:id').exec(location.pathname)
        if (match) {
          dispatch({
            type: 'queryPurchaseOrderDetail',
            payload: {
              id: decodeURIComponent(match[1]),
              storeId: lstorage.getCurrentUserStore()
            }
          })
        }
        if (pathname === '/transaction/purchase/order') {
          dispatch({
            type: 'updateState',
            payload: {
              listItem: [],
              activeKey: activeKey || '0'
            }
          })
          if (edit && edit !== '' && edit !== '0') {
            dispatch({
              type: 'setEdit',
              payload: {
                edit
              }
            })
          } else {
            dispatch({
              type: 'querySequence',
              payload: {
                seqCode: 'PO',
                type: lstorage.getCurrentUserStore() // diganti dengan StoreId
              }
            })
          }
          if (activeKey === '1') dispatch({ type: 'query', payload: other })
        }
      })
    }
  },

  effects: {
    * getPurchaseLatestDetail ({ payload }, { call, put }) {
      const response = yield call(queryDetailByProductId, payload)
      if (response && response.success) {
        yield put({
          type: 'updateState',
          payload: {
            listPurchaseLatestDetail: response.data
          }
        })
      } else {
        throw response
      }
    },

    * queryPurchaseOrderDetail ({ payload = {} }, { call, put }) {
      const data = yield call(queryById, payload)
      if (data.success && data.data) {
        yield put({
          type: 'updateState',
          payload: {
            data: data.data,
            listDetail: data.detail
          }
        })
      } else {
        throw data
      }
    },

    * queryReturnDetailInvoice ({ payload = {} }, { call, put }) {
      const header = yield call(query, {
        queryType: 'toPayable',
        supplierId: payload.supplierId
      })
      if (header && header.success) {
        yield put({
          type: 'updateState',
          payload: {
            listInvoice: header.data
              .map(data => ({
                ...data,
                amount: data.returnPurchaseDetail.map((returnData) => {
                  if (returnData.DPP > 0) {
                    return returnData.DPP * returnData.qty
                  }
                  return returnData.purchaseDetail ? returnData.purchaseDetail.DPP : 0
                }).reduce((prev, next) => prev + next, 0) * -1,
                paymentTotal: data.returnPurchaseDetail.map((returnData) => {
                  if (returnData.DPP > 0) {
                    return returnData.DPP * returnData.qty
                  }
                  return returnData.purchaseDetail ? returnData.purchaseDetail.DPP : 0
                }).reduce((prev, next) => prev + next, 0) * -1
              }))
          }
        })
      }
    },

    * queryProduct ({ payload = {} }, { call, put }) {
      const data = yield call(queryProductStock, payload)
      let newData = data.data
      if (data.success) {
        yield put({
          type: 'showProductQty',
          payload: {
            data: newData.map(item => ({ ...item, dpp: item.costPrice, DPP: item.costPrice }))
          }
        })
        yield put({
          type: 'updateState',
          payload: {
            listProduct: newData.map(item => ({ ...item, dpp: item.costPrice, DPP: item.costPrice }))
          }
        })
        yield put({
          type: 'updateState',
          payload: {
            pagination: {
              total: data.total,
              current: Number(data.page) || 1,
              pageSize: Number(data.pageSize) || 10
            }
          }
        })
      } else {
        const modal = Modal.warning({
          title: 'Warning',
          content: 'Product Not Found...!'
        })
        setTimeout(() => modal.destroy(), 1000)
      }
    },

    * setEdit ({ payload }, { call, put }) {
      const data = yield call(queryById, { id: payload.edit, relationship: 1 })
      if (data.success) {
        const { purchaseOrderDetail, ...currentItem } = data.data
        yield put({
          type: 'updateState',
          payload: {
            currentItem,
            modalType: 'edit',
            listItem: purchaseOrderDetail && purchaseOrderDetail.length > 0 ?
              purchaseOrderDetail.map((item, index) => ({
                no: index + 1,
                ...item,
                id: item.productId,
                productCode: item.product.productCode,
                productName: item.product.productName
              }))
              : []
          }
        })
      } else {
        throw data
      }
    },

    * showProductQty ({ payload }, { call, put }) {
      let { data } = payload
      const storeInfo = localStorage.getItem(`${prefix}store`) ? JSON.parse(localStorage.getItem(`${prefix}store`)) : {}
      const newData = data.map(x => x.id)

      const listProductData = yield call(queryPOSproduct, { from: storeInfo.startPeriod, to: moment().format('YYYY-MM-DD'), product: (newData || []).toString() })
      if (listProductData.success) {
        for (let n = 0; n < (listProductData.data || []).length; n += 1) {
          data = data.map((x) => {
            if (x.id === listProductData.data[n].id) {
              const { count, ...other } = x
              return {
                ...other,
                ...listProductData.data[n],
                productId: listProductData.data[n].id,
                initialQty: listProductData.data[n].count,
                qty: listProductData.data[n].count,
                DPP: x.costPrice,
                dpp: listProductData.data[n].count * x.costPrice
              }
            }
            return x
          })
        }

        yield put({
          type: 'updateState',
          payload: {
            listProduct: data
          }
        })
      } else {
        throw listProductData
      }
    },

    * query ({ payload = {} }, { call, put }) {
      const data = yield call(query, {
        ...payload,
        order: '-id'
      })
      if (data.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            list: data.data,
            pagination: {
              current: Number(data.page) || 1,
              pageSize: Number(data.pageSize) || 10,
              total: data.total
            }
          }
        })
      }
    },

    * delete ({ payload }, { call, put }) {
      const data = yield call(remove, payload)
      if (data.success) {
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },

    * approve ({ payload }, { call, put }) {
      const data = yield call(approve, payload)
      if (data.success) {
        yield put({ type: 'query' })
        Modal.success({
          title: 'Transaction success',
          content: 'Transaction has been saved'
        })
      } else {
        throw data
      }
    },

    * getInvoiceDetailPurchase ({ payload }, { select, call, put }) {
      const currentItem = yield select(({ purchaseOrder }) => purchaseOrder.currentItem)
      yield put({
        type: 'updateState',
        payload: {
          listProduct: [],
          listItem: []
        }
      })
      const response = yield call(queryPurchaseDetail, {
        transNo: payload.transNo
      })
      if (response.success && response.data) {
        yield put({
          type: 'updateState',
          payload: {
            reference: payload.id,
            referenceNo: payload.transNo
          }
        })
        yield put({
          type: 'updateState',
          payload: {
            listProduct: response.data,
            modalInvoiceVisible: false,
            currentItem: {
              ...currentItem,
              reference: payload.id,
              referenceNo: payload.transNo
            }
          }
        })
      } else {
        throw response
      }
    },

    * addItem ({ payload }, { select, put }) {
      const listItem = yield select(({ purchaseOrder }) => purchaseOrder.listItem)
      const exists = listItem.filter(filtered => filtered.id === payload.item.id)
      if (exists && exists.length > 0) {
        message.warning('Product already exists')
        return
      }
      const newListItem = [
        ...listItem
      ]
      const newData = {
        no: listItem.length + 1,
        id: payload.item.id,
        productId: payload.item.id,
        qty: 1,
        purchasePrice: payload.item.costPrice,
        total: payload.item.costPrice,
        productCode: payload.item.productCode,
        productName: payload.item.productName
      }
      newListItem.push(newData)
      yield put({
        type: 'updateState',
        payload: {
          listItem: newListItem,
          modalProductVisible: false
        }
      })
    },

    * editItem ({ payload }, { select, put }) {
      const listItem = yield select(({ purchaseOrder }) => purchaseOrder.listItem)
      const exists = listItem.filter(filtered => filtered.id === payload.item.id)
      if (exists && exists.length > 0) {
        const { item } = payload
        if (item.qty > item.initialQty) {
          message.warning('Qty of return sales is bigger than sales')
          return
        }
        const newListItem = listItem.map((item) => {
          if (item.id === payload.item.id) {
            return ({
              ...item,
              ...payload.item
            })
          }
          return item
        })
        yield put({
          type: 'updateState',
          payload: {
            listItem: newListItem,
            currentItemList: {},
            modalEditItemVisible: false
          }
        })
      } else {
        message.warning('Product not exists')
      }
    },

    * deleteItem ({ payload }, { select, put }) {
      const listItem = yield select(({ purchaseOrder }) => purchaseOrder.listItem)
      const exists = listItem.filter(filtered => filtered.id === payload.item.id)
      if (exists && exists.length > 0) {
        const newListItem = listItem
          .filter(filtered => filtered.id !== payload.item.id)
          .map((item, index) => {
            return ({
              ...item,
              no: index + 1
            })
          })
        yield put({
          type: 'updateState',
          payload: {
            listItem: newListItem,
            currentItemList: {},
            modalEditItemVisible: false
          }
        })
      } else {
        message.warning('Product not exists')
      }
    },

    * add ({ payload }, { call, put }) {
      const response = yield call(add, {
        data: payload.data,
        detail: payload.detail
      })
      if (response.success) {
        success()
        yield put({
          type: 'updateState',
          payload: {
            currentItem: {},
            currentItemList: {},
            listItem: [],
            listProduct: []
          }
        })
        if (payload.resetFields) {
          payload.resetFields()
        }
        yield put({
          type: 'purchaseOrder/updateState',
          payload: {
            reference: null,
            referenceNo: null,
            formType: 'add',
            currentItem: {},
            currentItemList: {}
          }
        })
        yield put({
          type: 'querySequence',
          payload: {
            seqCode: 'PO',
            type: lstorage.getCurrentUserStore() // diganti dengan StoreId
          }
        })
      } else {
        throw response
      }
    },

    * edit ({ payload }, { select, call, put }) {
      const id = yield select(({ purchaseOrder }) => purchaseOrder.currentItem.id)
      const newCounter = { ...payload, id }
      const data = yield call(edit, newCounter)
      if (data.success) {
        success()
        if (payload.resetFields) {
          payload.resetFields()
        }
        yield put({
          type: 'updateState',
          payload: {
            modalType: 'add',
            currentItem: {},
            listItem: [],
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
      } else {
        throw data
      }
    },

    * querySequence ({ payload }, { call, put }) {
      yield put({ type: 'resetState' })
      const data = yield call(querySequence, payload)
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            currentItem: {
              transNo: data.data,
              storeId: lstorage.getCurrentUserStore()
            },
            listStore: lstorage.getListUserStores()
          }
        })
      } else {
        throw (data)
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
    }
  }
})
