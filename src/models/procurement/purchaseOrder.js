import modelExtend from 'dva-model-extend'
import { routerRedux } from 'dva/router'
import { lstorage } from 'utils'
import { message } from 'antd'
import { query as querySequence } from 'services/sequence'
import { getDenominatorDppInclude, getDenominatorPPNInclude, getDenominatorPPNExclude } from 'utils/tax'
import pathToRegexp from 'path-to-regexp'
import {
  queryCount,
  querySupplierCount,
  querySupplierDetail,
  query,
  add,
  edit,
  remove,
  queryById,
  updateFinish,
  updateCancel
} from 'services/procurement/purchaseOrder'
import {
  query as queryPurchaseReceive
} from 'services/procurement/purchaseReceive'
import { query as queryProductCost } from 'services/product/productCost'
import {
  add as addStagingProduct
} from 'services/procurement/purchaseStaging'
import { pageModel } from 'models/common'

const success = () => {
  message.success('Purchase Order has been saved')
}

export default modelExtend(pageModel, {
  namespace: 'purchaseOrder',

  state: {
    currentItem: {},
    modalEditHeader: {},
    modalEditItem: {},
    modalType: 'add',
    activeKey: '0',
    list: [],
    listPurchaseReceive: [],
    listQuotationTrans: [],
    listQuotationSupplier: [],
    modalQuotationVisible: false,
    modalAddProductVisible: false,
    modalProductVisible: false,
    modalEditVisible: false,
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
          dispatch({
            type: 'updateState',
            payload: {
              listItem: [],
              currentItem: {}
            }
          })
          dispatch({ type: 'querySequence' })
        }
        if (pathname === '/transaction/procurement/order-history') {
          dispatch({
            type: 'query',
            payload: location.query
          })
        }
        const match = pathToRegexp('/transaction/procurement/order/:id').exec(location.pathname)
        if (match) {
          dispatch({
            type: 'queryDetail',
            payload: {
              id: decodeURIComponent(match[1]),
              storeId: lstorage.getCurrentUserStore()
            }
          })
        }
      })
    }
  },

  effects: {
    * queryDetail ({ payload = {} }, { call, put }) {
      const response = yield call(queryById, payload)
      if (response.success && response.data) {
        yield put({
          type: 'updateState',
          payload: {
            data: response.data,
            listDetail: response.detail
          }
        })
        yield put({
          type: 'queryPurchaseReceive',
          payload: {
            id: response.data.id
          }
        })
      } else {
        yield put({
          type: 'updateState',
          payload: {
            data: {},
            listDetail: []
          }
        })
        throw response
      }
    },

    * queryPurchaseReceive ({ payload = {} }, { call, put }) {
      const response = yield call(
        queryPurchaseReceive,
        {
          purchaseOrderId: payload.id
        })
      if (response.success && response.data) {
        yield put({
          type: 'updateState',
          payload: {
            listPurchaseReceive: response.data
          }
        })
      } else {
        yield put({
          type: 'updateState',
          payload: {
            listPurchaseReceive: []
          }
        })
        throw response
      }
    },

    * updateFinish ({ payload = {} }, { call, put }) {
      const response = yield call(updateFinish, {
        id: payload.id,
        storeId: lstorage.getCurrentUserStore()
      })
      if (response.success) {
        yield put({
          type: 'updateState',
          payload: {
            data: {},
            listDetail: [],
            listPurchaseReceive: []
          }
        })
        success()
        yield put(routerRedux.push('/transaction/procurement/order-history'))
      } else {
        throw response
      }
    },

    * updateCancel ({ payload = {} }, { call, put }) {
      const response = yield call(updateCancel, {
        id: payload.id,
        storeId: lstorage.getCurrentUserStore()
      })
      if (response.success) {
        yield put({
          type: 'updateState',
          payload: {
            data: {},
            listDetail: [],
            listPurchaseReceive: []
          }
        })
        success()
        yield put(routerRedux.push('/transaction/procurement/order-history'))
      } else {
        throw response
      }
    },

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

    * editItem ({ payload }, { select, put }) {
      const { data } = payload
      const listItem = yield select(({ purchaseOrder }) => purchaseOrder.listItem)
      const modalEditHeader = yield select(({ purchaseOrder }) => purchaseOrder.modalEditHeader)
      const exists = listItem.filter(filtered => filtered.productId === data.productId)
      if (exists && exists.length > 0) {
        const newListItem = listItem.map((item) => {
          if (item.productId === data.productId) {
            return ({
              ...item,
              ...data
            })
          }
          return item
        })
        yield put({
          type: 'changeTotalData',
          payload: {
            header: modalEditHeader,
            listItem: newListItem
          }
        })
        yield put({
          type: 'updateState',
          payload: {
            modalEditHeader: {},
            modalEditItem: {},
            modalEditVisible: false
          }
        })
      } else {
        message.warning('Product not exists')
      }
    },

    * changeTotalData ({ payload = {} }, { put }) {
      const { listItem, header } = payload
      let ppnType = header.taxType
      const totalPrice = listItem.reduce((prev, next) => prev + ((((next.qty * next.purchasePrice) * (1 - (((next.discPercent || 0) / 100))) * (1 - (((next.discPercent02 || 0) / 100))) * (1 - (((next.discPercent03 || 0) / 100)))) - next.discNominal) * (1 - (header.discInvoicePercent / 100))), 0)
      const dataProduct = listItem
      for (let key = 0; key < dataProduct.length; key += 1) {
        const discItem = ((((dataProduct[key].qty * dataProduct[key].purchasePrice) * (1 - (((dataProduct[key].discPercent || 0) / 100))) * (1 - (((dataProduct[key].discPercent02 || 0) / 100))) * (1 - (((dataProduct[key].discPercent03 || 0) / 100)))) - dataProduct[key].discNominal) * (1 - (header.discInvoicePercent / 100)))
        dataProduct[key].portion = totalPrice > 0 ? discItem / totalPrice : 0
        const totalDpp = parseFloat(discItem - (header.discInvoiceNominal * dataProduct[key].portion))
        if (header.deliveryFee && header.deliveryFee !== '' && header.deliveryFee > 0) {
          dataProduct[key].deliveryFee = dataProduct[key].portion * header.deliveryFee
        } else {
          dataProduct[key].deliveryFee = 0
        }
        dataProduct[key].DPP = parseFloat(totalDpp / (ppnType === 'I' ? getDenominatorDppInclude() : 1))
        dataProduct[key].PPN = parseFloat((ppnType === 'I' ? totalDpp / getDenominatorPPNInclude() : ppnType === 'S' ? (dataProduct[key].DPP * getDenominatorPPNExclude()) : 0))
        dataProduct[key].total = parseFloat(dataProduct[key].DPP + dataProduct[key].PPN)
      }
      yield put({
        type: 'updateState',
        payload: {
          listItem: dataProduct
        }
      })
    },

    * addStagingProduct ({ payload = {} }, { select, call, put }) {
      const response = yield call(addStagingProduct, payload.data)
      const currentItem = yield select(({ purchaseOrder }) => purchaseOrder.currentItem)
      const listItem = yield select(({ purchaseOrder }) => purchaseOrder.listItem)
      const modalEditHeader = yield select(({ purchaseOrder }) => purchaseOrder.modalEditHeader)
      const newListItem = [
        ...listItem
      ]
      if (response.success && response.data) {
        if (payload.reset) {
          payload.reset()
        }
        newListItem.push({
          no: newListItem.length + 1,
          productId: response.data.id,
          productCode: payload.data.productCode,
          productName: payload.data.productName,
          dimension: payload.data.dimension,
          dimensionBox: payload.data.dimensionBox,
          dimensionPack: payload.data.dimensionPack,
          qty: 1,
          purchasePrice: 0,
          discPercent: 0,
          discPercent02: 0,
          discPercent03: 0,
          discNominal: 0,
          deliveryFee: 0,
          portion: 0,
          DPP: 0,
          PPN: 0,
          total: 0
        })
        yield put({
          type: 'changeTotalData',
          payload: {
            header: modalEditHeader,
            listItem: newListItem
          }
        })
        yield put({
          type: 'updateState',
          payload: {
            modalAddProductVisible: false
          }
        })

        const filteredItem = newListItem.filter(filtered => filtered.productId === response.data.id)
        if (filteredItem && filteredItem[0]) {
          const record = filteredItem[0]
          yield put({
            type: 'purchaseOrder/updateState',
            payload: {
              currentItem: {
                ...currentItem,
                addProduct: true
              },
              modalEditItem: record,
              modalEditVisible: true
            }
          })
        }

        yield put({
          type: 'purchase/getPurchaseLatestDetail',
          payload: {
            productId: response.data.id
          }
        })
      } else {
        throw response
      }
    },

    * addItem ({ payload = {} }, { select, call, put }) {
      const currentItem = yield select(({ purchaseOrder }) => purchaseOrder.currentItem)
      const listItem = yield select(({ purchaseOrder }) => purchaseOrder.listItem)
      const modalEditHeader = yield select(({ purchaseOrder }) => purchaseOrder.modalEditHeader)
      const newListItem = [
        ...listItem
      ]
      const productCost = yield call(queryProductCost, {
        productId: payload.id,
        storeId: lstorage.getCurrentUserStore()
      })
      let hasPPN = false
      if (productCost && productCost.success && productCost.data && productCost.data[0]) {
        const item = productCost.data[0]
        if (payload.PPN > 0) {
          hasPPN = true
        }
        if (item.costPrice) {
          payload.costPrice = item.costPrice
          if (hasPPN) {
            const PPN = (payload.costPrice || 0) * (11 / 100)
            payload.costPrice += PPN
          }
        }
      } else {
        if (payload.PPN > 0) {
          hasPPN = true
        }

        if (hasPPN) {
          const PPN = (payload.costPrice || 0) * (11 / 100)
          payload.costPrice += PPN
        }
      }

      newListItem.push({
        no: newListItem.length + 1,
        productId: payload.id,
        productCode: payload.productCode,
        productName: payload.productName,
        dimension: payload.dimension,
        dimensionBox: payload.dimensionBox,
        dimensionPack: payload.dimensionPack,
        qty: 1,
        purchasePrice: payload.costPrice,
        discPercent: 0,
        discPercent02: 0,
        discPercent03: 0,
        discNominal: 0,
        deliveryFee: 0,
        portion: 0,
        DPP: payload.costPrice,
        PPN: 0,
        total: payload.costPrice
      })
      yield put({
        type: 'changeTotalData',
        payload: {
          header: modalEditHeader,
          listItem: newListItem
        }
      })
      yield put({
        type: 'updateState',
        payload: {
          modalProductVisible: false
        }
      })

      const filteredItem = newListItem.filter(filtered => filtered.productId === payload.id)
      if (filteredItem && filteredItem[0]) {
        const record = filteredItem[0]
        yield put({
          type: 'purchaseOrder/updateState',
          payload: {
            currentItem: {
              ...currentItem,
              addProduct: true
            },
            modalEditItem: record,
            modalEditVisible: true
          }
        })
      }

      yield put({
        type: 'purchase/getPurchaseLatestDetail',
        payload: {
          productId: payload.id
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
          const totalPrice = response.data.reduce((prev, next) => prev + (next.qty * next.purchasePrice), 0)
          const listItem = response.data.map((item, index) => {
            const total = item.qty * item.purchasePrice
            return ({
              no: index + 1,
              productId: item.productId,
              productCode: item.productCode,
              productName: item.productName,
              dimension: item.dimension,
              dimensionBox: item.dimensionBox,
              dimensionPack: item.dimensionPack,
              qty: item.qty,
              purchasePrice: item.purchasePrice,
              discPercent: 0,
              discNominal: 0,
              deliveryFee: 0,
              portion: totalPrice > 0 ? total / totalPrice : 0,
              DPP: total,
              PPN: 0,
              total
            })
          })
          currentItem.requisitionId = payload.transId
          currentItem.supplierId = response.data[0].supplierId
          currentItem.supplierName = response.data[0].supplierName
          yield put({
            type: 'updateState',
            payload: {
              listItem,
              currentItem: {
                ...currentItem,
                addProduct: false
              },
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
      const response = yield call(query, { order: '-id', storeId: lstorage.getCurrentUserStore(), ...payload })
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

    * add ({ payload = {} }, { select, call, put }) {
      const listItem = yield select(({ purchaseOrder }) => purchaseOrder.listItem)
      const header = payload.data
      let ppnType = header.taxType
      const totalPrice = listItem.reduce((prev, next) => prev + ((((next.qty * next.purchasePrice) * (1 - ((next.discPercent / 100))) * (1 - ((next.discPercent02 / 100))) * (1 - ((next.discPercent03 / 100)))) - next.discNominal) * (1 - (header.discInvoicePercent / 100))), 0)
      const dataProduct = [
        ...listItem
      ]
      for (let key = 0; key < dataProduct.length; key += 1) {
        const discItem = ((((dataProduct[key].qty * dataProduct[key].purchasePrice) * (1 - ((dataProduct[key].discPercent / 100))) * (1 - ((dataProduct[key].discPercent02 / 100))) * (1 - ((dataProduct[key].discPercent03 / 100)))) - dataProduct[key].discNominal) * (1 - (header.discInvoicePercent / 100)))
        dataProduct[key].portion = totalPrice > 0 ? discItem / totalPrice : 0
        const totalDpp = parseFloat(discItem - (header.discInvoiceNominal * dataProduct[key].portion))
        if (header.deliveryFee && header.deliveryFee !== '' && header.deliveryFee > 0) {
          dataProduct[key].deliveryFee = dataProduct[key].portion * header.deliveryFee
        } else {
          dataProduct[key].deliveryFee = 0
        }
        dataProduct[key].DPP = parseFloat(totalDpp / (ppnType === 'I' ? getDenominatorDppInclude() : 1))
        dataProduct[key].PPN = parseFloat((ppnType === 'I' ? totalDpp / getDenominatorPPNInclude() : ppnType === 'S' ? (dataProduct[key].DPP * getDenominatorPPNExclude()) : 0))
        dataProduct[key].total = parseFloat(dataProduct[key].DPP + dataProduct[key].PPN)
      }

      const response = yield call(add, {
        header: payload.data,
        detail: dataProduct.map(item => ({
          productId: item.productId,
          qty: item.qty,
          purchasePrice: item.purchasePrice,
          discPercent: item.discPercent,
          discPercent02: item.discPercent02,
          discPercent03: item.discPercent03,
          discNominal: item.discNominal,
          deliveryFee: item.deliveryFee,
          DPP: item.DPP,
          PPN: item.PPN,
          portion: item.portion,
          total: item.total
        }))
      })
      if (response.success) {
        success()
        yield put({
          type: 'updateState',
          payload: {
            modalType: 'add',
            currentItem: {},
            listItem: [],
            modalEditHeader: {},
            modalEditItem: {}
          }
        })
        yield put({
          type: 'querySequence'
        })
        if (payload.reset) {
          payload.reset()
        }
        yield put(routerRedux.push(`/transaction/procurement/order/${response.data.id}`))
      } else {
        throw response
      }
    },

    * deleteItem ({ payload }, { select, put }) {
      console.log('payload.item', payload.item)
      const modalEditHeader = yield select(({ purchaseOrder }) => purchaseOrder.modalEditHeader)
      const listItem = yield select(({ purchaseOrder }) => purchaseOrder.listItem)
      const newListItem = listItem.filter(filtered => filtered.productId !== payload.item.productId)
        .map((item, index) => {
          item.no = index + 1
          return item
        })
      yield put({
        type: 'updateState',
        payload: {
          listItem: listItem.filter(filtered => filtered.productId !== payload.item.productId)
            .map((item, index) => {
              item.no = index + 1
              return item
            }),
          modalEditVisible: false
        }
      })
      yield put({
        type: 'changeTotalData',
        payload: {
          header: modalEditHeader,
          listItem: newListItem
        }
      })
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
    }
  }
})
