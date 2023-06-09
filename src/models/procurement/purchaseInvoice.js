import modelExtend from 'dva-model-extend'
import { routerRedux } from 'dva/router'
import { message } from 'antd'
import pathToRegexp from 'path-to-regexp'
import { getDenominatorDppInclude, getDenominatorPPNInclude, getDenominatorPPNExclude } from 'utils/tax'
import { query as querySequence } from 'services/sequence'
import { queryId as queryPurchaseReceiveById, query as queryReceive } from 'services/procurement/purchaseReceive'
import { queryById, query, add, edit, remove } from 'services/procurement/purchaseInvoice'
import { query as queryProductCost } from 'services/product/productCost'
import { pageModel } from 'models/common'
import { lstorage } from 'utils'

const success = () => {
  message.success('Purchase Invoice has been saved')
}

export default modelExtend(pageModel, {
  namespace: 'purchaseInvoice',

  state: {
    currentItem: false,
    listItem: false,
    modalEditVisible: false,
    modalEditItem: false,
    modalAddProductVisible: false,
    modalProductVisible: false,
    modalReceiveVisible: false,

    searchReceive: '',
    listReceive: [],

    filterPurchaseReceive: {

    },
    paginationReceive: {
      showSizeChanger: true,
      showQuickJumper: true,
      current: 1
    },

    modalType: 'add',
    activeKey: '0',
    list: [],
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
        if (pathname === '/transaction/procurement/invoice') {
          dispatch({
            type: 'updateState',
            payload: {
              listItem: [],
              currentItem: {},
              filterPurchaseReceive: {}
            }
          })
          dispatch({ type: 'querySequence' })
        }
        const match = pathToRegexp('/transaction/procurement/invoice/:id').exec(location.pathname)
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
      } else {
        throw response
      }
    },

    * querySequence (payload, { select, call, put }) {
      const invoice = {
        seqCode: 'PRC',
        type: lstorage.getCurrentUserStore()
      }
      const data = yield call(querySequence, invoice)
      const currentItem = yield select(({ purchaseInvoice }) => purchaseInvoice.currentItem)
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
      const listItem = yield select(({ purchaseInvoice }) => purchaseInvoice.listItem)
      const modalEditHeader = yield select(({ purchaseInvoice }) => purchaseInvoice.modalEditHeader)
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
      const totalPrice = listItem.reduce((prev, next) => prev + ((((next.qty * next.purchasePrice) * (1 - ((next.discPercent / 100)))) - next.discNominal) * (1 - (header.discInvoicePercent / 100))), 0)
      const dataProduct = listItem
      for (let key = 0; key < dataProduct.length; key += 1) {
        const discItem = ((((dataProduct[key].qty * dataProduct[key].purchasePrice) * (1 - ((dataProduct[key].discPercent / 100)))) - dataProduct[key].discNominal) * (1 - (header.discInvoicePercent / 100)))
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

    * chooseReceive ({ payload = {} }, { select, call, put }) {
      const { header } = payload
      const response = yield call(queryPurchaseReceiveById, { id: header.id, storeId: lstorage.getCurrentUserStore() })
      const currentItem = yield select(({ purchaseInvoice }) => purchaseInvoice.currentItem)
      const modalEditHeader = yield select(({ purchaseInvoice }) => purchaseInvoice.modalEditHeader)

      if (response.success) {
        const { detail: listDetail } = response
        if (listDetail && listDetail.length > 0) {
          const newListItem = []
          for (let key in listDetail) {
            const detail = listDetail[key]
            newListItem.push({
              no: newListItem.length + 1,
              productId: detail.productId,
              productCode: detail.productCode,
              productName: detail.productName,
              dimension: detail.dimension,
              dimensionBox: detail.dimensionBox,
              dimensionPack: detail.dimensionPack,
              qty: detail.qty,
              purchasePrice: detail.purchasePrice,
              discPercent: detail.discPercent,
              discNominal: detail.discNominal,
              deliveryFee: detail.deliveryFee,
              portion: detail.portion,
              DPP: detail.DPP,
              PPN: detail.PPN,
              total: detail.DPP + detail.PPN
            })
          }

          modalEditHeader.reference = header.referenceTransNo
          modalEditHeader.supplierId = header.supplierId
          modalEditHeader.discInvoiceNominal = header.discInvoiceNominal
          modalEditHeader.discInvoicePercent = header.discInvoicePercent
          modalEditHeader.deliveryFee = header.deliveryFee
          modalEditHeader.description = header.description
          modalEditHeader.taxType = header.taxType

          yield put({
            type: 'updateState',
            payload: {
              currentItem: {
                ...currentItem,
                taxType: header.taxType,
                reference: header.referenceTransNo,
                supplierId: header.supplierId,
                discInvoiceNominal: header.discInvoiceNominal,
                discInvoicePercent: header.discInvoicePercent,
                deliveryFee: header.deliveryFee,
                description: header.description,
                purchaseReceiveId: header.id,
                purchaseOrderId: header.purchaseOrderId,
                addProduct: false,
                receiveItem: true
              },
              modalReceiveVisible: false
            }
          })

          yield put({
            type: 'changeTotalData',
            payload: {
              header: modalEditHeader,
              listItem: newListItem
            }
          })
        } else {
          message.error('This Purchase Receive has no Item')
        }
      } else {
        throw response
      }
    },

    * addItem ({ payload = {} }, { select, call, put }) {
      const currentItem = yield select(({ purchaseInvoice }) => purchaseInvoice.currentItem)
      const listItem = yield select(({ purchaseInvoice }) => purchaseInvoice.listItem)
      const modalEditHeader = yield select(({ purchaseInvoice }) => purchaseInvoice.modalEditHeader)
      const newListItem = [
        ...listItem
      ]
      const productCost = yield call(queryProductCost, {
        productId: payload.id,
        storeId: lstorage.getCurrentUserStore()
      })
      if (productCost && productCost.success && productCost.data && productCost.data[0]) {
        const item = productCost.data[0]
        payload.costPrice = item.costPrice
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
          type: 'updateState',
          payload: {
            currentItem: {
              ...currentItem,
              addProduct: true,
              receiveItem: false
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

    * updateFilterReceive ({ payload = {} }, { put }) {
      yield put({
        type: 'updateState',
        payload: {
          filterPurchaseReceive: payload
        }
      })
      yield put({
        type: 'queryReceive',
        payload: {}
      })
    },

    * queryReceive (payload, { select, call, put }) {
      const filterPurchaseReceive = yield select(({ purchaseInvoice }) => purchaseInvoice.filterPurchaseReceive)
      const response = yield call(queryReceive, {
        ...filterPurchaseReceive,
        status: 1,
        storeId: lstorage.getCurrentUserStore(),
        pageSize: 25,
        order: '-id'
      })
      if (response.success) {
        yield put({
          type: 'updateState',
          payload: {
            listReceive: response.data,
            paginationReceive: {
              current: Number(response.page) || 1,
              pageSize: Number(response.pageSize) || 10,
              total: response.total
            }
          }
        })
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

    * add ({ payload = {} }, { select, call, put }) {
      const listItem = yield select(({ purchaseInvoice }) => purchaseInvoice.listItem)
      const header = payload.data
      let ppnType = header.taxType
      const totalPrice = listItem.reduce((prev, next) => prev + ((((next.qty * next.purchasePrice) * (1 - ((next.discPercent / 100)))) - next.discNominal) * (1 - (header.discInvoicePercent / 100))), 0)
      const dataProduct = [
        ...listItem
      ]
      for (let key = 0; key < dataProduct.length; key += 1) {
        const discItem = ((((dataProduct[key].qty * dataProduct[key].purchasePrice) * (1 - ((dataProduct[key].discPercent / 100)))) - dataProduct[key].discNominal) * (1 - (header.discInvoicePercent / 100)))
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
          storeId: lstorage.getCurrentUserStore(),
          productId: item.productId,
          productName: item.productName,
          qty: item.qty,
          purchasePrice: item.purchasePrice,
          sellingPrice: 0,
          discPercent: item.discPercent,
          discNominal: item.discNominal,
          deliveryFee: item.deliveryFee,
          DPP: item.DPP,
          PPN: item.PPN,
          portion: item.portion,
          void: 0,
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
        yield put(routerRedux.push(`/transaction/procurement/invoice/${response.data.id}`))
      } else {
        throw response
      }
    },

    * edit ({ payload }, { select, call, put }) {
      const id = yield select(({ purchaseInvoice }) => purchaseInvoice.currentItem.id)
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
