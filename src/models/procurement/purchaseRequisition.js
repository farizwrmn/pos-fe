import modelExtend from 'dva-model-extend'
import { routerRedux } from 'dva/router'
import { message } from 'antd'
import {
  query as querySafetyStock,
  queryDetail,
  querySupplier,
  queryBrand,
  queryCategory
} from 'services/procurement/purchaseSafetyStock'
import { query as queryProductCost } from 'services/product/productCost'
import { query as queryStorePrice } from 'services/storePrice/stockExtraPriceStore'
import { query as querySequence } from 'services/sequence'
import { query, add, edit, remove } from 'services/procurement/purchaseRequisition'
import {
  querySearchSupplier,
  querySupplierHistory,
  queryPurchaseHistory,
  queryPurchaseOrderProduct,
  queryStockProcurement
} from 'services/procurement/purchaseHistory'
import { pageModel } from 'models/common'
import { lstorage } from 'utils'
import { getRecommendedQtyToBuy, getRecommendedBoxToBuy } from 'utils/safetyStockUtils'

const success = () => {
  message.success('Purchase Requisition has been saved')
}

export default modelExtend(pageModel, {
  namespace: 'purchaseRequisition',

  state: {
    currentSafety: {},
    listSafety: [],

    listSafetySupplier: [],
    listSafetyBrand: [],
    listSafetyCategory: [],

    filterSafety: {},

    listItem: [],
    selectedRowKeysSafety: [],

    listSupplier: [],
    listSupplierHistory: [],
    listPurchaseHistory: [],
    listPurchaseOrder: [],
    listStock: [],

    currentItemEdit: {},
    modalEditCostVisible: false,
    modalEditQtyVisible: false,
    modalEditSupplierVisible: false,
    modalStockVisible: false,

    currentItem: {},
    modalType: 'add',
    activeKey: '0',
    list: [],

    paginationSafety: {
      showSizeChanger: true,
      showQuickJumper: false,
      current: 1
    },

    pagination: {
      showSizeChanger: true,
      showQuickJumper: false,
      current: 1
    }
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        const { pathname } = location
        if (pathname === '/transaction/procurement/requisition') {
          dispatch({ type: 'querySequence' })
          dispatch({
            type: 'querySafetyStock',
            payload: {
              storeId: lstorage.getCurrentUserStore()
            }
          })
        }
      })
    }
  },

  effects: {
    * queryDetailSafety ({ payload = {} }, { select, call, put }) {
      const currentSafety = yield select(({ purchaseRequisition }) => purchaseRequisition.currentSafety)
      const filterSafety = yield select(({ purchaseRequisition }) => purchaseRequisition.filterSafety)
      const response = yield call(queryDetail, {
        ...filterSafety,
        ...payload,
        id: currentSafety.id
      })
      if (response.success && response.data && response.data.length > 0) {
        const productCost = yield call(queryProductCost, {
          productId: response.data.map(item => item.productId),
          storeId: lstorage.getCurrentUserStore()
        })
        let listSafety = response.data

        const listStorePrice = yield call(queryStorePrice, {
          productId: response.data.map(item => item.productId),
          storeId: lstorage.getCurrentUserStore()
        })


        const listPrice = listStorePrice.success && listStorePrice.data && listStorePrice.data.length > 0 ? listStorePrice.data : []

        if (productCost && productCost.data && productCost.data.length > 0) {
          listSafety = response.data.map((item, index) => {
            const filteredProductCost = productCost.data.filter(filtered => filtered.productId === item.productId)
            const filteredPrice = listPrice.filter(filtered => filtered.productId === item.productId)
            if (filteredPrice && filteredPrice.length > 0) {
              const price = filteredPrice[0]
              item.product.sellPrice = price.sellPrice
            }
            if (filteredProductCost && filteredProductCost[0]) {
              item.storeSupplier = {
                id: filteredProductCost[0].supplierId,
                supplierCode: filteredProductCost[0].supplierCode,
                supplierName: filteredProductCost[0].supplierName
              }
              item.desiredSupplierChange = true
              item.desiredSupplier = {
                id: filteredProductCost[0].supplierId,
                supplierCode: filteredProductCost[0].supplierCode,
                supplierName: filteredProductCost[0].supplierName
              }
              item.product.costPrice = filteredProductCost[0].costPrice
            }
            item.no = index + 1
            return item
          })
        }
        yield put({
          type: 'updateState',
          payload: {
            listSafety,
            selectedRowKeysSafety: [],
            paginationSafety: {
              showSizeChanger: true,
              showQuickJumper: false,
              current: Number(response.page) || 1,
              pageSize: Number(response.pageSize) || 10,
              total: response.total,
              showTotal: total => `${total} Items`
            }
          }
        })
      } else {
        yield put({
          type: 'updateState',
          payload: {
            listSafety: [],
            selectedRowKeysSafety: [],
            pagination: {
              showSizeChanger: true,
              showQuickJumper: false,
              current: 1
            }
          }
        })
        throw response
      }
    },

    * querySupplierSafety ({ payload = {} }, { select, call, put }) {
      const currentSafety = yield select(({ purchaseRequisition }) => purchaseRequisition.currentSafety)
      const response = yield call(querySupplier, {
        ...payload,
        id: currentSafety.id
      })
      if (response.success && response.data && response.data.length > 0) {
        yield put({
          type: 'updateState',
          payload: {
            listSafetySupplier: response.data
          }
        })
      } else {
        yield put({
          type: 'updateState',
          payload: {
            listSafetySupplier: []
          }
        })
        throw response
      }
    },

    * queryBrandSafety ({ payload = {} }, { select, call, put }) {
      const currentSafety = yield select(({ purchaseRequisition }) => purchaseRequisition.currentSafety)
      const response = yield call(queryBrand, {
        ...payload,
        id: currentSafety.id
      })
      if (response.success && response.data && response.data.length > 0) {
        yield put({
          type: 'updateState',
          payload: {
            listSafetyBrand: response.data
          }
        })
      } else {
        yield put({
          type: 'updateState',
          payload: {
            listSafetyBrand: []
          }
        })
        throw response
      }
    },

    * changeSupplier ({ payload = {} }, { select, put }) {
      const listItem = yield select(({ purchaseRequisition }) => purchaseRequisition.listItem)
      const { currentItemEdit, supplier } = payload
      message.success('Supplier Changed')
      yield put({
        type: 'updateState',
        payload: {
          modalEditSupplierVisible: false,
          listItem: listItem.map((item) => {
            if (item.id === currentItemEdit.id) {
              item.desiredSupplier = {
                id: supplier.id,
                supplierCode: supplier.supplierCode,
                supplierName: supplier.supplierName
              }
              item.storeSupplier = {
                id: supplier.id,
                supplierCode: supplier.supplierCode,
                supplierName: supplier.supplierName
              }
            }
            return item
          })
        }
      })
    },

    * querySupplier ({ payload = {} }, { call, put }) {
      yield put({
        type: 'updateState',
        payload: {
          listSupplier: []
        }
      })
      const response = yield call(querySearchSupplier, {
        q: payload.q,
        page: 1,
        pageSize: 10
      })
      if (response.success && response.data && response.data.length > 0) {
        yield put({
          type: 'updateState',
          payload: {
            listSupplier: response.data
          }
        })
      } else {
        yield put({
          type: 'updateState',
          payload: {
            listSupplier: []
          }
        })
        throw response
      }
    },

    * queryCategorySafety ({ payload = {} }, { select, call, put }) {
      const currentSafety = yield select(({ purchaseRequisition }) => purchaseRequisition.currentSafety)
      const response = yield call(queryCategory, {
        ...payload,
        id: currentSafety.id
      })
      if (response.success && response.data && response.data.length > 0) {
        yield put({
          type: 'updateState',
          payload: {
            listSafetyCategory: response.data
          }
        })
      } else {
        yield put({
          type: 'updateState',
          payload: {
            listSafetyCategory: []
          }
        })
        throw response
      }
    },

    * querySequence ({ payload = {} }, { select, call, put }) {
      const invoice = {
        seqCode: 'PR',
        type: lstorage.getCurrentUserStore(),
        ...payload
      }
      const data = yield call(querySequence, invoice)
      const currentItem = yield select(({ purchaseRequisition }) => purchaseRequisition.currentItem)
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

    * querySafetyStock ({ payload = {} }, { call, put }) {
      const response = yield call(querySafetyStock, {
        storeId: payload.storeId,
        order: '-rangeDateTo',
        pageSize: 1
      })
      if (response.success && response.data && response.data[0]) {
        const currentSafety = response.data[0]
        yield put({
          type: 'updateState',
          payload: {
            currentSafety,
            filterSafety: {},
            paginationSafety: {
              showSizeChanger: true,
              showQuickJumper: false,
              current: 1
            }
          }
        })
        yield put({ type: 'queryDetailSafety', payload: { id: currentSafety.id } })
        yield put({ type: 'querySupplierSafety', payload: { id: currentSafety.id } })
        yield put({ type: 'queryBrandSafety', payload: { id: currentSafety.id } })
        yield put({ type: 'queryCategorySafety', payload: { id: currentSafety.id } })
      } else {
        message.error('Safety Stock not found, please generate one first')
        throw response
      }
    },

    * addMultiItem ({ payload = {} }, { put }) {
      const {
        selectedRowKeysSafety,
        listItem,
        listSafety
      } = payload
      let newListItem = [
        ...listItem
      ]
      for (let key in selectedRowKeysSafety) {
        const id = selectedRowKeysSafety[key]
        const filteredSafety = listSafety.filter(filtered => filtered.id === id)
        if (filteredSafety && filteredSafety[0]) {
          const filteredExists = listItem.filter(filtered => filtered.id === id)
          if (filteredExists && filteredExists.length === 0) {
            const qtyToBuy = getRecommendedQtyToBuy({
              stock: filteredSafety[0].stock,
              orderedQty: filteredSafety[0].orderedQty,
              safetyStock: filteredSafety[0].safetyStock
            })
            let boxToBuy = getRecommendedBoxToBuy({
              dimensionBox: filteredSafety[0].product.dimensionBox,
              stock: 0,
              orderedQty: 0,
              safetyStock: qtyToBuy
            })

            filteredSafety[0].qty = boxToBuy > 0 ? boxToBuy * Number(filteredSafety[0].product.dimensionBox) : qtyToBuy

            newListItem = newListItem.concat([filteredSafety[0]])
          }
        }
      }
      yield put({
        type: 'updateState',
        payload: {
          listItem: newListItem.map((item, index) => {
            item.no = index + 1
            return item
          }),
          selectedRowKeysSafety: []
        }
      })
    },

    * showModalEditSupplier ({ payload = {} }, { call, put }) {
      yield put({
        type: 'updateState',
        payload: {
          modalEditSupplierVisible: true,
          currentItemEdit: payload.currentItemEdit
        }
      })
      const response = yield call(querySupplierHistory, {
        productId: payload.currentItemEdit.productId,
        storeId: lstorage.getCurrentUserStore()
      })
      if (response && response.success) {
        yield put({
          type: 'updateState',
          payload: {
            listSupplierHistory: response.data
          }
        })
      } else {
        throw response
      }
    },

    * showModalEditCost ({ payload = {} }, { call, put }) {
      yield put({
        type: 'updateState',
        payload: {
          modalEditCostVisible: true,
          currentItemEdit: payload.currentItemEdit
        }
      })
      const response = yield call(queryPurchaseHistory, {
        productId: payload.currentItemEdit.productId,
        storeId: lstorage.getCurrentUserStore()
      })
      if (response && response.success) {
        yield put({
          type: 'updateState',
          payload: {
            listPurchaseHistory: response.data
          }
        })
      } else {
        throw response
      }
    },

    * showModalEditQty ({ payload = {} }, { call, put }) {
      yield put({
        type: 'updateState',
        payload: {
          modalEditQtyVisible: true,
          currentItemEdit: payload.currentItemEdit
        }
      })
      const response = yield call(queryStockProcurement, {
        productId: payload.currentItemEdit.productId,
        storeId: lstorage.getCurrentUserStore()
      })
      if (response && response.success) {
        yield put({
          type: 'updateState',
          payload: {
            listStock: response.data
          }
        })
      } else {
        throw response
      }
      const responseStore = yield call(queryPurchaseOrderProduct, {
        productId: payload.currentItemEdit.productId,
        storeId: lstorage.getCurrentUserStore()
      })
      if (responseStore && responseStore.success) {
        yield put({
          type: 'updateState',
          payload: {
            listPurchaseOrder: responseStore.data
          }
        })
      } else {
        throw response
      }
    },

    * showModalStock ({ payload = {} }, { call, put }) {
      yield put({
        type: 'updateState',
        payload: {
          modalStockVisible: true,
          currentItemEdit: payload.currentItemEdit
        }
      })
      const response = yield call(queryStockProcurement, {
        productId: payload.currentItemEdit.productId,
        storeId: lstorage.getCurrentUserStore()
      })
      if (response && response.success) {
        yield put({
          type: 'updateState',
          payload: {
            listStock: response.data
          }
        })
      } else {
        throw response
      }
    },

    * hideModalEditSupplier ({ payload = {} }, { put }) {
      yield put({
        type: 'updateState',
        payload: {
          modalEditSupplierVisible: false,
          currentItemEdit: payload.currentItemEdit,
          listSupplierHistory: []
        }
      })
    },

    * hideModalEditCost ({ payload = {} }, { put }) {
      yield put({
        type: 'updateState',
        payload: {
          modalEditCostVisible: false,
          currentItemEdit: payload.currentItemEdit,
          listPurchaseHistory: []
        }
      })
    },

    * hideModalEditQty ({ payload = {} }, { put }) {
      yield put({
        type: 'updateState',
        payload: {
          modalEditQtyVisible: false,
          currentItemEdit: payload.currentItemEdit,
          listStock: []
        }
      })
    },

    * hideModalStock ({ payload = {} }, { put }) {
      yield put({
        type: 'updateState',
        payload: {
          modalStockVisible: false,
          currentItemEdit: payload.currentItemEdit,
          listStock: []
        }
      })
    },

    * deleteItem ({ payload = {} }, { select, put }) {
      const listItem = yield select(({ purchaseRequisition }) => purchaseRequisition.listItem)
      const newListItem = listItem
        .filter(filtered => filtered.id !== payload.currentItemEdit.id)
        .map((item, index) => {
          item.no = index + 1
          return item
        })
      message.success(`Item ${payload.currentItemEdit.product.productName} Deleted`)
      yield put({
        type: 'updateState',
        payload: {
          listItem: newListItem
        }
      })
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
      const id = yield select(({ purchaseRequisition }) => purchaseRequisition.currentItem.id)
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
