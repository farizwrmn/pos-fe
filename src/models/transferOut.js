import modelExtend from 'dva-model-extend'
import moment from 'moment'
import { Modal, message } from 'antd'
import { prefix } from 'utils/config.main'
import { lstorage, color, alertModal } from 'utils'
import { query as queryStore } from 'services/store/store'
import { queryActive } from 'services/transferRequest/transferDemand'
import { query as queryParameter } from 'services/utils/parameter'
import { queryPOSproduct } from 'services/master/productstock'
import { query, queryLov, queryHpokok, queryChangeHpokokTransferOut, updateTransferOutHpokok, add, queryTransferOut, queryDetail, queryByTrans } from '../services/transferStockOut'
import { queryChangeHpokokTransferIn, updateTransferInHpokok } from '../services/transferStockIn'
import { queryPOSstock as queryProductsInStock } from '../services/master/productstock'
import { query as queryInvoice, queryDetail as queryDetailInvoice } from '../services/purchase'
import {
  query as querySequence
} from '../services/sequence'
import { pageModel } from './common'

const { stockMinusAlert } = alertModal
const success = () => {
  message.success('Transfer process has been saved, waiting for confirmation.')
}

function getSetting (setting) {
  let json = setting.Inventory
  let jsondata = JSON.stringify(eval(`(${json})`))
  const outOfStock = JSON.parse(jsondata).posOrder.outOfStock
  return outOfStock
}

const error = (err) => {
  message.error(typeof err.message === 'string' ? err.message : err.detail)
}
export default modelExtend(pageModel, {
  namespace: 'transferOut',
  state: {
    listTransferOut: [],
    listTrans: [],
    listItem: [],
    listTransGroup: [],
    listStore: [],
    listHeader: [],
    listChangeTransferOut: [],
    listChangeTransferIn: [],
    listProductDemand: [],
    listReason: [],
    selectedRowKeys: [],
    currentItem: {},
    currentItemList: {},
    currentItemPrint: {},
    filterSearch: {},
    modalImportProductVisible: false,
    modalProductDemandVisible: false,
    modalVisible: false,
    modalConfirmVisible: false,
    modalInvoiceVisible: false, // purchase modal visible
    searchVisible: false,
    listInvoice: [], // purchase data invoice
    tmpInvoiceList: [], // purchase search index list
    formType: 'add',
    display: 'none',
    activeKey: '0',
    disable: '',
    period: null,
    filter: null,
    sort: null,
    listProducts: [],
    listTransOut: {},
    showPrintModal: false,
    pagination: {
      // showSizeChanger: true,
      // showQuickJumper: true,
      current: 1,
      total: null,
      pageSize: 10
    }
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/inventory/transfer/auto-replenish'
          || location.pathname === '/inventory/transfer/auto-replenish-import') {
          dispatch({
            type: 'querySequence',
            payload: {
              seqCode: 'MUOUT',
              type: lstorage.getCurrentUserStore() // diganti dengan StoreId
            }
          })
        }
        if (location.pathname === '/inventory/transfer/out') {
          dispatch({
            type: 'queryReason'
          })
          const { activeKey, start, end, page, pageSize } = location.query
          if (activeKey === '1') {
            if (start && end) {
              dispatch({
                type: 'transferOut/queryTransferOut',
                payload: {
                  type: 'load',
                  start,
                  end,
                  page,
                  pageSize
                }
              })
            } else {
              dispatch({
                type: 'transferOut/queryTransferOut',
                payload: {
                  type: 'load',
                  start: moment().startOf('month').format('YYYY-MM-DD'),
                  end: moment().endOf('month').format('YYYY-MM-DD'),
                  page,
                  pageSize
                }
              })
            }
          }
          if (activeKey !== '1') {
            dispatch({
              type: 'querySequence',
              payload: {
                seqCode: 'MUOUT',
                type: lstorage.getCurrentUserStore() // diganti dengan StoreId
              }
            })
          }
          const { deliveryOrderNo } = location.query
          if (deliveryOrderNo) {
            dispatch({
              type: 'queryTransferOut',
              payload: {
                deliveryOrderNo
              }
            })
          }
          if (activeKey) {
            dispatch({
              type: 'updateState',
              payload: {
                activeKey: activeKey || '0'
              }
            })
          }
        }
        // else if (location.pathname === '/inventory/transfer/in') {
        //   dispatch({
        //     type: 'query',
        //   })
        // }
      })
    }
  },

  effects: {
    * queryReason (payload, { call, put }) {
      const response = yield call(queryParameter, {
        paramCode: 'transferOutReason',
        type: 'all',
        order: 'sort'
      })
      if (response && response.success) {
        yield put({
          type: 'updateState',
          payload: {
            listReason: response.data
          }
        })
      } else {
        throw response
      }
    },

    * query ({ payload = {} }, { call, put }) {
      const data = yield call(query, payload)
      if (data) {
        yield put({
          type: 'querySuccessTransferOut',
          payload: {
            listTrans: data.data,
            pagination: {
              current: Number(payload.page) || 1,
              pageSize: Number(payload.pageSize) || 5,
              total: data.total
            }
          }
        })
        if (payload.page && payload.pageSize) {
          yield put({
            type: 'updateState',
            payload: {
              pagination: {
                current: Number(payload.page) || 1,
                pageSize: Number(payload.pageSize) || 10
              }
            }
          })
        }
      }
    },

    * queryLov ({ payload = {} }, { call, put }) {
      yield put({
        type: 'updateState',
        payload: {
          listTransGroup: []
        }
      })
      const data = yield call(queryLov, payload)
      let listTransGroup = []
      if (data) {
        const listTransDelivery = data.data.filter(filtered => filtered.deliveryOrderNo)
        const listTransNormal = data.data.filter(filtered => !filtered.deliveryOrderNo)
        for (let key in listTransDelivery) {
          const item = listTransDelivery[key]
          const filteredExists = listTransGroup.filter(filtered => filtered.deliveryOrderNo === item.deliveryOrderNo)
          if (filteredExists && filteredExists.length === 0) {
            listTransGroup.push(item)
          }
        }
        yield put({
          type: 'updateState',
          payload: {
            listTransGroup: listTransNormal.concat(listTransGroup)
          }
        })
        yield put({
          type: 'querySuccessTransferOut',
          payload: {
            listTrans: data.data,
            pagination: {
              current: Number(payload.page) || 1,
              pageSize: Number(payload.pageSize) || 5,
              total: data.total
            }
          }
        })
      }
    },
    * queryHpokok ({ payload = {} }, { call, put }) {
      const data = yield call(queryHpokok, payload)
      if (data) {
        yield put({
          type: 'querySuccessTransferOut',
          payload: {
            listTrans: data.data,
            pagination: {
              current: Number(data.page) || 1,
              pageSize: Number(data.pageSize) || 5,
              total: data.total
            }
          }
        })
        yield put({
          type: 'updateState',
          payload: {
            filterSearch: payload,
            searchText: payload.q
          }
        })
      } else {
        throw data
      }
    },
    * queryHeader ({ payload = {} }, { call, put }) {
      payload.type = 'all'
      const data = yield call(queryHpokok, payload)
      if (data.success) {
        yield put({
          type: 'querySuccessHeader',
          payload: {
            listHeader: data.data,
            pagination: {
              current: Number(data.page) || 1,
              pageSize: Number(data.pageSize) || 5,
              total: data.total
            }
          }
        })
      } else {
        throw data
      }
    },

    * updateQty ({ payload = {} }, { call, put, select }) {
      const { listItem, item, form, events } = payload
      const setting = yield select(({ app }) => app.setting)
      const storeInfo = localStorage.getItem(`${prefix}store`) ? JSON.parse(localStorage.getItem(`${prefix}store`)) : {}
      const listProductData = yield call(queryPOSproduct, { from: storeInfo.startPeriod, to: moment().format('YYYY-MM-DD'), product: item.productId })
      let totalListProduct = 0
      if (listProductData.success) {
        totalListProduct = listProductData.data.filter(filtered => filtered.productId === item.productId)
          .reduce((prev, next) => prev + next.count, 0)
        const outOfStock = getSetting(setting)
        if (item.qty > totalListProduct && outOfStock === 0) {
          Modal.warning({
            title: 'No available stock',
            content: `Your input: ${item.qty}, Available: ${totalListProduct}`
          })
          return
        }
      }
      if (totalListProduct > 0) {
        item.stock = totalListProduct
      }
      listItem[item.no - 1] = item
      yield put({
        type: 'transferOut/updateState',
        payload: {
          currentItemList: {},
          modalVisible: false,
          listItem
        }
      })
      if (form && events) {
        const index = [...form].indexOf(events.target)
        if (form.elements[index + 1]) {
          form.elements[index + 1].focus()
        }
      }
    },

    * editDemandDetail ({ payload = {} }, { put }) {
      const { listProductDemand, item, form, events } = payload
      let newProductDemand = listProductDemand.map((record) => {
        if (record.id === item.id) {
          return item
        }
        return record
      })
      yield put({
        type: 'updateState',
        payload: {
          listProductDemand: newProductDemand
        }
      })
      if (form && events) {
        const index = [...form].indexOf(events.target)
        if (form.elements[index + 1]) {
          form.elements[index + 1].focus()
        }
      }
    },

    * showModalDemand ({ payload = {} }, { call, put }) {
      const response = yield call(queryActive, {
        storeId: lstorage.getCurrentUserStore(),
        storeIdReceiver: payload.storeId,
        type: payload.type
      })
      if (response && response.success) {
        yield put({
          type: 'updateState',
          payload: {
            modalProductDemandVisible: true,
            listProductDemand: response.data
          }
        })
      }
    },

    * submitProductDemand ({ payload = {} }, { put, select }) {
      const { selectedRowKeys, listProductDemand } = payload
      const listItem = yield select(({ transferOut }) => transferOut.listItem)
      const mapListItem = listItem.map(item => item.productId)
      const newListItem = listProductDemand.filter((filtered) => {
        return selectedRowKeys.includes(filtered.productId)
      }).filter((filtered) => {
        return !mapListItem.includes(filtered.productId)
      }).map((item, index) => {
        return ({
          no: index + 1,
          brandName: item.brandName,
          categoryName: item.categoryName,
          productImage: item.productImage,
          productCode: item.productCode,
          productId: item.id,
          transType: 'MUOUT',
          qtyStore: item.qtyStore,
          qtyDemand: item.qtyDemand,
          dimension: item.dimension,
          dimensionBox: item.dimensionBox,
          dimensionPack: item.dimensionPack,
          stock: item.stock,
          productName: item.productName,
          qty: item.qty,
          description: null
        })
      })
      yield put({
        type: 'updateState',
        payload: {
          listItem: listItem.concat(newListItem).map((item, index) => ({ ...item, no: index + 1 })),
          modalProductDemandVisible: false,
          selectedRowKeys: []
        }
      })
    },

    * hideModalDemand (payload, { put }) {
      yield put({
        type: 'updateState',
        payload: {
          modalProductDemandVisible: false,
          listProductDemand: [],
          selectedRowKeys: []
        }
      })
    },

    * queryChangeHpokokTransferOut ({ payload = {} }, { call, put }) {
      const data = yield call(queryChangeHpokokTransferOut, payload)
      if (data.success) {
        yield put({
          type: 'querySuccessChangeTransferOut',
          payload: {
            listChangeTransferOut: data.data,
            pagination: {
              current: Number(data.page) || 1,
              pageSize: Number(data.pageSize) || 5,
              total: data.total
            }
          }
        })
      } else {
        throw data
      }
    },
    * queryChangeHpokokTransferIn ({ payload = {} }, { call, put }) {
      const data = yield call(queryChangeHpokokTransferIn, payload)
      if (data.success) {
        yield put({
          type: 'querySuccessChangeTransferIn',
          payload: {
            listChangeTransferIn: data.data,
            pagination: {
              current: Number(data.page) || 1,
              pageSize: Number(data.pageSize) || 5,
              total: data.total
            }
          }
        })
      } else {
        throw data
      }
    },
    * queryStore (payload, { call, put }) {
      const listStore = lstorage.getListUserStores()
      if (listStore && listStore.length === 1) {
        const response = yield call(queryStore, {
          id: listStore[0].value
        })
        console.log('response', response)
        if (response.success && response.data && response.data.length > 0 && response.data[0].storeParentId) {
          const responseParent = yield call(queryStore, {
            id: response.data[0].storeParentId
          })
          if (responseParent.success && responseParent.data && responseParent.data.length > 0) {
            listStore.push({
              value: responseParent.data[0].id,
              label: responseParent.data[0].storeName
            })
          }
          if (response.data[0].centralKitchenParent) {
            const responseCentral = yield call(queryStore, {
              id: response.data[0].centralKitchenParent
            })
            if (responseCentral.success && responseCentral.data && responseCentral.data.length > 0) {
              listStore.push({
                value: responseCentral.data[0].id,
                label: responseCentral.data[0].storeName
              })
            }
          }
        }
      }
      yield put({
        type: 'updateState',
        payload: {
          listStore
        }
      })
    },

    * querySequence ({ payload }, { call, put }) {
      yield put({ type: 'resetState' })
      const data = yield call(querySequence, payload)
      yield put({ type: 'queryStore' })
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            currentItem: {
              transNo: data.data,
              storeId: lstorage.getCurrentUserStore()
            }
          }
        })
      } else {
        throw (data)
      }
    },
    * updateTransfer ({ payload = {} }, { call, put }) {
      const { transferOutId } = payload
      const dataOut = yield call(updateTransferOutHpokok, { id: transferOutId })
      const dataIn = yield call(updateTransferInHpokok, { id: transferOutId })
      if (dataOut.success && dataIn.success) {
        yield put({
          type: 'updateState',
          payload: {
            listTrans: []
          }
        })
      } else {
        throw dataOut
      }
    },
    * add ({ payload }, { call, put }) {
      const sequenceData = {
        seqCode: 'MUOUT',
        type: lstorage.getCurrentUserStore() // diganti dengan StoreId
      }
      const sequence = yield call(querySequence, sequenceData)
      payload.transNo = sequence.data
      // payload.detail is null
      if (payload && payload.detail.length === 0) {
        message.error('data product must be entered')
        return
      }
      let response = yield call(add, payload)
      if (response.success) {
        if (response.data && response.data.id && payload.data.deliveryOrder) {
          if (payload && payload.reset) {
            payload.reset()
          }
        } else {
          success()
          if (payload && payload.reset) {
            payload.reset()
          }
        }
        success()
        if (response.data && response.data.transNo && (payload.data && !payload.data.deliveryOrder)) {
          window.open(`/inventory/transfer/out/${encodeURIComponent(response.data.transNo)}`, '_blank')
        }
        yield put({
          type: 'updateState',
          payload: {
            listItem: []
          }
        })
      } else {
        error(response)
        if (response && typeof response.message === 'object') {
          stockMinusAlert(response.message)
        }
        // throw data
      }
    },
    * deleteListState ({ payload }, { put }) {
      let effectedRecord = payload.no
      let arrayProd = payload.listItem
      arrayProd.splice(effectedRecord, 1)
      let ary = []
      for (let n = 0; n < arrayProd.length; n += 1) {
        ary.push({
          no: n + 1,
          productId: arrayProd[n].productId,
          productCode: arrayProd[n].productCode,
          productName: arrayProd[n].productName,
          transType: arrayProd[n].transType,
          qty: arrayProd[n].qty,
          description: arrayProd[n].description,
          stock: arrayProd[n].stock
        })
      }
      yield put({ type: 'updateState', payload: { listItem: ary, modalVisible: false } })
    },

    * queryTransferOut ({ payload = {} }, { call, put, select }) {
      const { type, ...otherPayload } = payload
      const listTransferOut = yield select(({ transferOut }) => transferOut.listTransferOut)
      if (type === 'load' && listTransferOut.length > 0) {
        yield put({
          type: 'updateState',
          payload: {
            current: Number(payload.page) || 1,
            pageSize: Number(payload.pageSize) || 10,
            total: listTransferOut.length
          }
        })
        return
      }
      const data = yield call(queryTransferOut, otherPayload)
      if (data && data.success && data.data.length > 0) {
        yield put({
          type: 'querySuccessListTransferOut',
          payload: {
            listTransferOut: data.data,
            pagination: {
              current: Number(payload.page) || 1,
              pageSize: Number(payload.pageSize) || 10,
              total: data.total
            }
          }
        })
        if (payload.page && payload.pageSize) {
          yield put({
            type: 'updateState',
            payload: {
              pagination: {
                current: Number(payload.page) || 1,
                pageSize: Number(payload.pageSize) || 10
              }
            }
          })
        }
      }
      if (payload.transNo && data && data.success && data.data.length === 0) {
        const response = yield call(queryTransferOut, {
          deliveryOrderNo: payload.transNo
        })
        if (response && response.success && response.data.length > 0) {
          yield put({
            type: 'querySuccessListTransferOut',
            payload: {
              listTransferOut: response.data,
              pagination: {
                current: Number(payload.page) || 1,
                pageSize: Number(payload.pageSize) || 10,
                total: response.total
              }
            }
          })
        }
      }
    },

    * queryProducts ({ payload = {} }, { call, put }) {
      const { type, ...other } = payload
      const data = yield call(queryDetail, other)
      if (data) {
        yield put({
          type: 'querySuccessProducts',
          payload: data.mutasi
        })
        if (payload.type === 'detail') {
          yield put({
            type: 'transferOutDetail/updateState',
            payload: {
              showPrint: true
            }
          })
        } else {
          yield put({
            type: 'transferOut/updateState',
            payload: {
              showPrintModal: true
            }
          })
        }
      }
    },

    * queryByTrans ({ payload = {} }, { call, put }) {
      const { type, ...other } = payload
      const data = yield call(queryByTrans, other)
      if (data.mutasi) {
        yield put({
          type: 'transferOut/queryProducts',
          payload: {
            transNo: payload.transNo,
            storeId: payload.storeId,
            type: payload.type
          }
        })
        yield put({
          type: 'querySuccessTrans',
          payload: data.mutasi
        })
      } else {
        throw data
      }
    },
    // Get purchase invoice
    * getInvoice ({ payload = {} }, { call, put }) {
      const storeInfo = localStorage.getItem(`${prefix}store`) ? JSON.parse(localStorage.getItem(`${prefix}store`)) : {}
      const period = {
        startPeriod: storeInfo.startPeriod,
        endPeriod: storeInfo.endPeriod,
        ...payload
      }
      let dataDetail = yield call(queryInvoice, period)
      if (dataDetail && dataDetail.success) {
        let dataInvoice = dataDetail.data
        yield put({
          type: 'updateState',
          payload: {
            listInvoice: dataInvoice,
            tmpInvoiceList: dataInvoice
          }
        })
      } else {
        Modal.warning({
          title: 'No Data',
          content: 'No data inside storage'
        })
      }
    },
    // Get Purchase Detail
    * getInvoiceDetailPurchase ({ payload }, { call, put }) {
      const storeInfo = localStorage.getItem(`${prefix}store`) ? JSON.parse(localStorage.getItem(`${prefix}store`)) : {}
      let product = []
      yield put({
        type: 'showProductModal',
        payload: {
          modalType: 'browseProductFree'
        }
      })
      const data = yield call(queryDetailInvoice, { transNo: payload.transNo })
      product = yield call(queryProductsInStock, {
        from: storeInfo.startPeriod,
        to: moment().format('YYYY-MM-DD'),
        product: data.data.map(editData => editData.productId).toString()
      })
      let arrayProd = []
      for (let n = 0; n < data.data.length; n += 1) {
        const productCheck = product.data.filter(el => el.productId === data.data[n].productId)
        arrayProd.push({
          no: arrayProd.length + 1,
          id: data.data[n].id,
          productId: data.data[n].productId,
          productCode: data.data[n].productCode,
          productName: data.data[n].productName,
          qty: data.data[n].qty <= productCheck[0].count ? data.data[n].qty : productCheck[0].count,
          color: data.data[n].qty <= productCheck[0].count ? color.borderBase : color.wewak,
          transType: 'MUOUT',
          description: data.data[n].description,
          ket: 'edit'
        })
      }
      yield put({
        type: 'updateState',
        payload: {
          modalInvoiceVisible: false,
          listItem: arrayProd
        }
      })
      yield put({
        type: 'updateItem',
        payload: {
          reference: payload.id,
          referenceNo: payload.transNo
        }
      })
    },
    * getInvoiceDetail ({ payload }, { call, put }) {
      const data = yield call(queryDetailInvoice, { transNo: payload.transNo })
      let arrayProd = []
      for (let n = 0; n < data.data.length; n += 1) {
        arrayProd.push({
          no: arrayProd.length + 1,
          id: data.data[n].id,
          code: data.data[n].productId,
          productCode: data.data[n].productCode,
          name: data.data[n].productName,
          qty: data.data[n].qty,
          ket: 'add'
        })
      }
      yield put({
        type: 'hideProductModal'
      })
      yield put({
        type: 'setTransNo',
        payload
      })
    }
  },

  reducers: {

    querySuccessTransferOut (state, action) {
      const {
        listSuppliers,
        listTrans,
        pagination
      } = action.payload
      return {
        ...state,
        listSuppliers: listSuppliers || [],
        listTrans: listTrans || [],
        pagination: {
          ...state.pagination,
          ...pagination
        }
      }
    },
    querySuccessHeader (state, action) {
      const {
        listHeader,
        pagination
      } = action.payload
      return {
        ...state,
        listHeader: listHeader || [],
        pagination: {
          ...state.pagination,
          ...pagination
        }
      }
    },
    querySuccessChangeTransferOut (state, action) {
      const {
        listChangeTransferOut,
        pagination
      } = action.payload
      return {
        ...state,
        listChangeTransferOut: listChangeTransferOut || [],
        pagination: {
          ...state.pagination,
          ...pagination
        }
      }
    },
    querySuccessChangeTransferIn (state, action) {
      const {
        listChangeTransferIn,
        pagination
      } = action.payload
      return {
        ...state,
        listChangeTransferIn: listChangeTransferIn || [],
        pagination: {
          ...state.pagination,
          ...pagination
        }
      }
    },
    querySuccessListTransferOut (state, action) {
      const {
        listTransferOut,
        pagination
      } = action.payload
      return {
        ...state,
        listTransferOut,
        pagination: {
          ...state.pagination,
          ...pagination
        }
      }
    },
    querySuccessProducts (state, action) {
      return { ...state, listProducts: action.payload }
    },
    querySuccessTrans (state, action) {
      return { ...state, listTransOut: action.payload }
    },
    updateState (state, { payload }) {
      return {
        ...state,
        ...payload
      }
    },
    updateItem (state, { payload }) {
      return {
        ...state,
        currentItem: {
          ...state.currentItem,
          ...payload
        }
      }
    },
    resetState (state) {
      const defaultState = {
        listTrans: [],
        listItem: [],
        listStore: [],
        currentItem: {},
        currentItemList: {},
        modalVisible: false,
        searchVisible: false,
        formType: 'add',
        display: 'none',
        disable: '',
        pagination: {
          // showSizeChanger: true,
          // showQuickJumper: true,
          showTotal: total => `Total ${total} Records`,
          current: 1,
          total: null,
          pageSize: 5
        }
      }
      return {
        ...state,
        ...defaultState
      }
    },
    onSearch (state, action) {
      const { data, search } = action.payload
      const reg = new RegExp(search, 'gi')
      let transNo
      transNo = data.map((record) => {
        const match = record.transNo.match(reg)
        if (!match) {
          return null
        }
        return {
          ...record
        }
      }).filter(record => !!record)
      return { ...state, listTransferOut: transNo }
    }
  }
})
