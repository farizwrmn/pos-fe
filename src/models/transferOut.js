import modelExtend from 'dva-model-extend'
import moment from 'moment'
import { Modal, message } from 'antd'
import { prefix } from 'utils/config.main'
import { lstorage, color, alertModal } from 'utils'
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

const error = (err) => {
  message.error(typeof err.message === 'string' ? err.message : err.detail)
}
export default modelExtend(pageModel, {
  namespace: 'transferOut',
  state: {
    listTrans: [],
    listItem: [],
    listStore: [],
    listHeader: [],
    listChangeTransferOut: [],
    listChangeTransferIn: [],
    currentItem: {},
    currentItemList: {},
    currentItemPrint: {},
    filterSearch: {},
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
    listTransOut: [],
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
        if (location.pathname === '/inventory/transfer/out') {
          dispatch({
            type: 'querySequence',
            payload: {
              seqCode: 'MUOUT',
              type: lstorage.getCurrentUserStore() // diganti dengan StoreId
            }
          })
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
    * query ({ payload = {} }, { call, put }) {
      console.log('payload', payload)
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
      }
    },
    * queryLov ({ payload = {} }, { call, put }) {
      const data = yield call(queryLov, payload)
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
      let response = yield call(add, payload)
      if (response.success) {
        if (response.data && response.data.id && payload.data.deliveryOrder) {
          if (payload && payload.reset) {
            payload.reset()
          }
          yield put({
            type: 'updateState',
            payload: {
              modalConfirmVisible: true,
              currentItemPrint: response.data
            }
          })
        } else {
          success()
          if (payload && payload.reset) {
            payload.reset()
          }
          yield put({
            type: 'updateState',
            payload: {
              modalConfirmVisible: true,
              currentItemPrint: response.data
            }
          })
        }
      } else {
        error(response)
        if (response && response.data && response.data[0]) {
          stockMinusAlert(response)
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
          description: arrayProd[n].description
        })
      }
      yield put({ type: 'updateState', payload: { listItem: ary, modalVisible: false } })
    },

    * queryTransferOut ({ payload = {} }, { call, put }) {
      const data = yield call(queryTransferOut, payload)
      if (data) {
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
      }
    },

    * queryProducts ({ payload = {} }, { call, put }) {
      const data = yield call(queryDetail, payload)
      if (data) {
        yield put({
          type: 'querySuccessProducts',
          payload: data.mutasi
        })
      }
    },

    * queryByTrans ({ payload = {} }, { call, put }) {
      const data = yield call(queryByTrans, payload)
      if (data.mutasi) {
        yield put({
          type: 'querySuccessTrans',
          payload: data.mutasi
        })
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
      console.log('getInvoiceDetailPurchase')
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
        activeKey: '0',
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
