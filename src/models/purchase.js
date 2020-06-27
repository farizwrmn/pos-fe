import modelExtend from 'dva-model-extend'
import { Modal } from 'antd'
import { lstorage, configMain, alertModal } from 'utils'
import { routerRedux } from 'dva/router'
import moment from 'moment'
import {
  query,
  queryDetail,
  create,
  editPurchase,
  remove,
  queryHistories,
  queryHistory,
  queryHistoryDetail,
  queryDetailByProductId
} from '../services/purchase'
import { pageModel } from './common'
import { query as queryProducts } from '../services/master/productstock'
import { query as querySupplier } from '../services/master/supplier'

const { stockMinusAlert } = alertModal
const { prefix } = configMain
const infoStore = localStorage.getItem(`${prefix}store`) ? JSON.parse(localStorage.getItem(`${prefix}store`)) : null

export default modelExtend(pageModel, {
  namespace: 'purchase',

  state: {
    currentItem: {},
    date: '',
    readOnly: false,
    addItem: {},
    searchTextSupplier: '',
    curHead: {
      discInvoiceNominal: 0,
      discInvoicePercent: 0,
      taxType: localStorage.getItem('taxType') ? localStorage.getItem('taxType') : 'E'
    },
    curTotal: 0,
    tmpSupplierData: [],
    item: {},
    tempo: 0,
    transNo: {},
    discNML: 0,
    discPRC: 0,
    rounding: 0,
    curRecord: 1,
    curQty: 1,
    modalVisible: false,
    searchVisible: false,
    modalType: '',
    modalPaymentVisible: false,
    modalSupplierVisible: false,
    disableItem: {},
    modalProductVisible: false,
    selectedRowKeys: [],
    tmpProductList: [],
    tmpInvoiceList: [],
    listProduct: [],
    listInvoice: [],
    listVoid: [],
    dataBrowse: localStorage.getItem('product_detail') ? JSON.parse(localStorage.getItem('product_detail')) : [],
    curDiscPercent: 0,
    curDiscNominal: 0,
    supplierInformation: {},
    pagination: {
      current: 1
    },
    datePicker: '',
    purchaseHistory: {},
    listPurchaseLatestDetail: [],
    listPurchaseHistoryDetail: [],
    listPurchaseHistories: [],
    modalPrintInvoice: false,
    period: moment(infoStore.startPeriod).format('YYYY-MM')
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/transaction/purchase/add') {
          localStorage.removeItem('product_detail')
          localStorage.removeItem('purchase_void')
          dispatch({ type: 'modalEditHide' })
          dispatch({ type: 'changeRounding', payload: 0 })
        } else if (location.pathname === '/transaction/purchase/edit') {
          localStorage.removeItem('product_detail')
          localStorage.removeItem('purchase_void')
          dispatch({ type: 'modalEditHide' })
        } else if (location.pathname === '/transaction/purchase/history') {
          dispatch({
            type: 'queryHistory',
            payload: {
              startPeriod: moment().startOf('month').format('YYYY-MM-DD'),
              endPeriod: moment().endOf('month').format('YYYY-MM-DD')
            }
          })
        }
      })
    }
  },

  effects: {
    * querySupplier ({ payload = {} }, { call, put }) {
      const data = yield call(querySupplier, payload)
      if (data.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            listSupplier: data.data,
            tmpSupplierData: data.data,
            paginationSupplier: {
              current: Number(payload.page) || 1,
              pageSize: Number(payload.pageSize) || 10,
              total: data.total
            }
          }
        })
      } else {
        throw data
      }
    },

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

    * delete ({ payload }, { call, put, select }) {
      const data = yield call(remove, payload)
      const { selectedRowKeys } = yield select(_ => _.purchaseId)
      if (data.success) {
        yield put({ type: 'updateState', payload: { selectedRowKeys: selectedRowKeys.filter(_ => _ !== payload) } })
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },

    * deleteBatch ({ payload }, { call, put }) {
      const data = yield call(remove, payload)
      if (data.success) {
        yield put({ type: 'updateState', payload: { selectedRowKeys: [] } })
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },

    * editPurchaseList ({ payload }, { put }) {
      function hdlChangePercent (payload) {
        const data = payload.head
        let dataProduct = localStorage.getItem('product_detail') ? JSON.parse(localStorage.getItem('product_detail')) : []
        let ppnType = localStorage.getItem('taxType') ? localStorage.getItem('taxType') : 'E'
        const totalPrice = dataProduct.reduce((cnt, o) => cnt + (o.qty * o.price), 0)
        const x = dataProduct
        for (let key = 0; key < (x || []).length; key += 1) {
          const total = (x[key].qty * x[key].price)
          const discPercentItem = (1 - ((x[key].disc1 / 100)))
          const discNominalItem = x[key].discount
          const discPercentInvoice = (1 - (data.discInvoicePercent / 100))
          const totalSellingPrice = (x[key].qty * x[key].price)
          const discItem = ((totalSellingPrice * discPercentItem) - discNominalItem) * discPercentInvoice
          const totalDpp = parseFloat(discItem - ((total / (totalPrice === 0 ? 1 : totalPrice)) * data.discInvoiceNominal))
          x[key].dpp = parseFloat(totalDpp / (ppnType === 'I' ? 1.1 : 1))
          x[key].ppn = parseFloat((ppnType === 'I' ? totalDpp / 11 : ppnType === 'S' ? (x[key].dpp * 0.1) : 0))
          x[key].total = x[key].dpp + x[key].ppn
        }
        localStorage.setItem('product_detail', JSON.stringify(x))
      }
      let dataPos = (localStorage.getItem('product_detail') === null ? [] : JSON.parse(localStorage.getItem('product_detail')))
      dataPos[payload.data.no - 1] = payload.data
      localStorage.setItem('product_detail', JSON.stringify(dataPos))
      hdlChangePercent(payload)
      yield put({ type: 'modalEditHide' })
    },

    * voidPurchaseList ({ payload }, { put }) {
      let dataPos = (localStorage.getItem('purchase_void') === null ? [] : JSON.parse(localStorage.getItem('purchase_void')))
      dataPos.push(payload)
      localStorage.setItem('purchase_void', JSON.stringify(dataPos))
      yield put({ type: 'modalEditHide' })
    },

    * add ({ payload }, { call, put }) {
      const storeId = lstorage.getCurrentUserStore()
      let purchase_detail = localStorage.getItem('product_detail') ? JSON.parse(localStorage.getItem('product_detail')) : []
      if ((purchase_detail || []).length !== 0) {
        let arrayProd = []
        for (let n = 0; n < purchase_detail.length; n += 1) {
          arrayProd.push({
            storeId,
            transNo: payload.transNo,
            productId: purchase_detail[n].code,
            productName: purchase_detail[n].name,
            qty: purchase_detail[n].qty,
            purchasePrice: purchase_detail[n].price,
            DPP: purchase_detail[n].dpp,
            PPN: purchase_detail[n].ppn,
            discPercent: purchase_detail[n].disc1,
            discNominal: purchase_detail[n].discount,
            transType: payload.transType
          })
        }
        const data = yield call(create, { id: payload.transNo, data: payload, add: arrayProd })
        if (data.success) {
          localStorage.removeItem('product_detail')
          localStorage.removeItem('purchase_void')
          yield put({ type: 'resetBrowse' })
          yield put({ type: 'changeRounding', payload: 0 })
          const modalMember = () => {
            return new Promise((resolve, reject) => {
              Modal.confirm({
                title: 'Transaction Success',
                content: `Go To Payment (${payload.transNo}) ?`,
                onOk () {
                  resolve()
                },
                onCancel () {
                  reject()
                }
              })
            })
          }
          yield modalMember()
          yield put(routerRedux.push({
            pathname: `/accounts/payable/${payload.transNo}`
          }))
        } else {
          Modal.warning({
            title: 'Something went wrong',
            content: `${JSON.stringify(data.message)}`
          })
        }
      } else {
        Modal.warning({
          title: 'Something went wrong',
          content: 'No data to insert'
        })
      }
    },

    * update ({ payload }, { call, put }) {
      const storeId = lstorage.getCurrentUserStore()
      let addData = payload.data.filter(x => x.ket === 'add')
      let editData = payload.data.filter(x => x.ket === 'edit')
      let voidData = []
      if ((payload.dataVoid || []).length > 0) {
        voidData = payload.dataVoid.map((dataVoidMap) => {
          return ({
            storeId,
            transNo: payload.id.transNo,
            productId: dataVoidMap.code,
            productName: dataVoidMap.name,
            qty: dataVoidMap.qty,
            purchasePrice: dataVoidMap.price,
            DPP: dataVoidMap.dpp,
            PPN: dataVoidMap.ppn,
            discPercent: dataVoidMap.disc1,
            discNominal: dataVoidMap.discount
          })
        })
        // yield call(createVoidDetail, { id: payload.id.transNo, data: voidData })
      }
      let arrayProdAdd = []
      let arrayProdEdit = []
      arrayProdAdd = addData.map((dataArrayProdAddtMap) => {
        return ({
          storeId,
          transNo: payload.id.transNo,
          id: dataArrayProdAddtMap.id,
          productId: dataArrayProdAddtMap.code,
          productName: dataArrayProdAddtMap.name,
          qty: dataArrayProdAddtMap.qty,
          purchasePrice: dataArrayProdAddtMap.price,
          DPP: dataArrayProdAddtMap.dpp,
          PPN: dataArrayProdAddtMap.ppn,
          discPercent: dataArrayProdAddtMap.disc1,
          discNominal: dataArrayProdAddtMap.discount,
          void: dataArrayProdAddtMap.void
        })
      })
      arrayProdEdit = editData.map((dataArrayProdEditMap) => {
        return ({
          storeId,
          transNo: payload.id.transNo,
          id: dataArrayProdEditMap.id,
          productId: dataArrayProdEditMap.code,
          productName: dataArrayProdEditMap.name,
          qty: dataArrayProdEditMap.qty,
          purchasePrice: dataArrayProdEditMap.price,
          DPP: dataArrayProdEditMap.dpp,
          PPN: dataArrayProdEditMap.ppn,
          discPercent: dataArrayProdEditMap.disc1,
          discNominal: dataArrayProdEditMap.discount,
          void: dataArrayProdEditMap.void
        })
      })

      if (payload.data.length > 0) {
        const data = yield call(editPurchase, {
          id: payload.id.transNo,
          data: payload.e,
          add: arrayProdAdd,
          edit: arrayProdEdit,
          void: voidData
        })
        if (data.success) {
          Modal.info({
            title: 'Information',
            content: 'Transaction has been saved...!'
          })
          localStorage.removeItem('product_detail')
          localStorage.removeItem('purchase_void')
          yield put({ type: 'resetBrowse' })
          yield put({ type: 'modalHide' })
          yield put({ type: 'changeRounding', payload: 0 })
          yield put({ type: 'query' })
        } else {
          if (data.data && (data.data || []).length > 0) {
            stockMinusAlert(data)
          } else {
            Modal.warning({
              title: 'Something went wrong',
              content: data.message
            })
          }
          throw data
        }
      } else {
        Modal.warning({
          title: 'Your payment list not exists',
          content: 'Please select an Invoice'
        })
      }
    },

    * getProducts ({ payload }, { call, put }) {
      let data
      let dataDetail
      if (payload ? payload.modalType === 'browseInvoice' : false) {
        const storeInfo = localStorage.getItem(`${prefix}store`) ? JSON.parse(localStorage.getItem(`${prefix}store`)) : {}
        const period = {
          startPeriod: storeInfo.startPeriod,
          endPeriod: storeInfo.endPeriod
        }
        dataDetail = yield call(query, period)
      } else {
        data = yield call(queryProducts, payload)
      }
      if (data && data.success) {
        let newData = data.data
        yield put({
          type: 'queryGetProductsSuccess',
          payload: {
            productInformation: newData,
            pagination: {
              total: Number(data.total || 0),
              pageSize: Number(data.pageSize || 10),
              current: Number(data.page || 1)
            }
          }
        })
      }
      if (dataDetail && dataDetail.success) {
        let dataInvoice = dataDetail.data
        yield put({
          type: 'queryGetInvoiceSuccess',
          payload: {
            dataInvoice,
            tmpInvoiceList: dataInvoice
          }
        })
      }
    },
    * getInvoiceHeader ({ payload }, { call, put }) {
      const dataDetail = yield call(query, payload)
      let dataInvoice = dataDetail.data
      if (dataDetail.data.length > 0) {
        yield put({
          type: 'queryGetInvoiceSuccess',
          payload: {
            dataInvoice,
            tmpInvoiceList: dataInvoice,
            pagination: {
              total: Number(dataDetail.total || 0)
            }
          }
        })
      } else {
        const modal = Modal.warning({
          title: 'Warning',
          content: 'Content Not Found...!'
        })
        setTimeout(() => modal.destroy(), 1000)
      }
    },
    * getInvoiceDetail ({ payload }, { call, put }) {
      localStorage.setItem('taxType', payload.taxType)
      const data = yield call(queryDetail, { transNo: payload.transNo })
      if (data.success) {
        let arrayProd = []
        for (let n = 0; n < data.data.length; n += 1) {
          arrayProd.push({
            no: arrayProd.length + 1,
            id: data.data[n].id,
            code: data.data[n].productId,
            productCode: data.data[n].productCode,
            name: data.data[n].productName,
            qty: data.data[n].qty,
            price: data.data[n].purchasePrice,
            discount: data.data[n].discNominal,
            disc1: data.data[n].discPercent,
            dpp: data.data[n].dpp,
            ppn: data.data[n].ppn,
            total: data.data[n].dpp + data.data[n].ppn,
            ket: 'edit'
          })
        }
        localStorage.setItem('product_detail', JSON.stringify(arrayProd))
        localStorage.removeItem('purchase_void')
        yield put({
          type: 'hideProductModal'
        })
        yield put({
          type: 'updateState',
          payload: {
            curHead: {
              discInvoiceNominal: payload.discInvoiceNominal,
              discInvoicePercent: payload.discInvoicePercent,
              taxType: localStorage.getItem('taxType') ? localStorage.getItem('taxType') : 'E'
            }
          }
        })
        yield put({
          type: 'setTransNo',
          payload
        })
      } else {
        throw data
      }
    },
    * deleteList ({ payload }, { put }) {
      let dataPos = (localStorage.getItem('product_detail') === null ? [] : JSON.parse(localStorage.getItem('product_detail')))
      let arrayProd = dataPos.slice()
      Array.prototype.remove = function () {
        let what
        let a = arguments
        let L = a.length
        let ax
        while (L && this.length) {
          what = a[L -= 1]
          while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1)
          }
        }
        return this
      }
      let ary = arrayProd
      ary.remove(arrayProd[payload.no - 1])
      arrayProd = []
      for (let n = 0; n < ary.length; n += 1) {
        arrayProd.push({
          no: n + 1,
          code: ary[n].code,
          productCode: ary[n].productCode,
          name: ary[n].name,
          disc1: ary[n].disc1,
          discount: ary[n].discount,
          price: ary[n].price,
          dpp: ary[n].dpp,
          ppn: ary[n].ppn,
          ket: ary[n].ket,
          qty: ary[n].qty,
          total: ary[n].total,
          void: ary[n].void
        })
      }
      if (arrayProd.length === 0) {
        localStorage.removeItem('product_detail')
        yield put({
          type: 'modalEditHide'
        })
      } else {
        localStorage.setItem('product_detail', JSON.stringify(arrayProd))
        yield put({
          type: 'modalEditHide'
        })
      }
    },
    * deleteVoidList ({ payload }, { put }) {
      let dataPos = (localStorage.getItem('purchase_void') === null ? [] : JSON.parse(localStorage.getItem('purchase_void')))
      let arrayProd = dataPos.slice()
      Array.prototype.remove = function () {
        let what
        let a = arguments
        let L = a.length
        let ax
        while (L && this.length) {
          what = a[L -= 1]
          while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1)
          }
        }
        return this
      }
      let ary = arrayProd
      ary.remove(arrayProd[payload.count - 1])
      arrayProd = []
      for (let n = 0; n < ary.length; n += 1) {
        arrayProd.push({
          count: n + 1,
          no: ary[n].no,
          code: ary[n].code,
          productCode: ary[n].productCode,
          name: ary[n].name,
          disc1: ary[n].disc1,
          discount: ary[n].discount,
          price: ary[n].price,
          dpp: ary[n].dpp,
          ppn: ary[n].ppn,
          ket: ary[n].ket,
          qty: ary[n].qty,
          total: ary[n].total,
          void: ary[n].void
        })
      }
      if (arrayProd.length === 0) {
        localStorage.removeItem('purchase_void')
        yield put({
          type: 'modalEditHide'
        })
      } else {
        localStorage.setItem('purchase_void', JSON.stringify(arrayProd))
        yield put({
          type: 'modalEditHide'
        })
      }
    },

    * queryHistory ({ payload }, { call, put }) {
      const data = yield call(queryHistories, payload)
      if (data.success) {
        yield put({
          type: 'querySuccessHistory',
          payload: {
            listPurchaseHistories: data.data,
            pagination: {
              current: Number(payload.page) || 1,
              pageSize: Number(payload.pageSize) || 10,
              total: Number(data.total || 0)
            }
          }
        })
      }
    },

    * queryHistoryByTransNo ({ payload }, { call, put }) {
      const data = yield call(queryHistory, payload)
      if (data.success && data.purchase) {
        let listPurchaseHistories = [data.purchase]
        yield put({
          type: 'updateState',
          payload: {
            listPurchaseHistories
          }
        })
      } else {
        yield put({
          type: 'updateState',
          payload: {
            listPurchaseHistories: []
          }
        })
      }
    },

    * queryHistoryDetail ({ payload }, { call, put }) {
      const data = yield call(queryHistory, payload)
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: { purchaseHistory: data.purchase }
        })
        const detail = yield call(queryHistoryDetail, payload)
        if (detail.success && (detail.data || []).length > 0) {
          yield put({
            type: 'updateState',
            payload: {
              listPurchaseHistoryDetail: detail.data,
              modalPrintInvoice: true
            }
          })
        }
      }
    }
  },

  reducers: {

    querySuccess (state, action) {
      const { listPurchase, listSupplier, tmpSupplierData, paginationSupplier } = action.payload
      return {
        ...state,
        listPurchase,
        listSupplier,
        tmpSupplierData,
        paginationSupplier: {
          ...state.pagination,
          ...paginationSupplier
        }
      }
    },

    updateState (state, { payload }) {
      return { ...state, ...payload }
    },

    querySuccessHistory (state, { payload }) {
      const { listPurchaseHistories, pagination } = payload
      return {
        ...state,
        listPurchaseHistories,
        pagination: {
          ...state.pagination,
          ...pagination
        }
      }
    },

    queryGetProductsSuccess (state, action) {
      const { productInformation, tmpProductList, pagination } = action.payload
      let dataPurchase = (localStorage.getItem('purchase_detail') === null ? [] : JSON.parse(localStorage.getItem('purchase_detail')))
      let a = dataPurchase
      let grandTotal = a.reduce((cnt, o) => {
        return cnt + o.total
      }, 0)
      return {
        ...state,
        listProduct: productInformation,
        tmpProductList,
        curTotal: grandTotal,
        pagination: {
          ...state.pagination,
          ...pagination
        }
      }
    },
    queryGetInvoiceSuccess (state, action) {
      const { dataInvoice, tmpInvoiceList } = action.payload
      return {
        ...state,
        listInvoice: dataInvoice,
        tmpInvoiceList
      }
    },
    onInvoiceSearch (state, action) {
      const { searchText, tmpInvoiceList } = action.payload
      const reg = new RegExp(searchText, 'gi')
      let newData
      newData = tmpInvoiceList.map((record) => {
        const match = record.transNo.match(reg) || record.transDate.match(reg) || record.supplierName.match(reg)
        if (!match) {
          return null
        }
        return {
          ...record
        }
      }).filter(record => !!record)

      return { ...state, listInvoice: newData }
    },
    onSupplierSearch (state, action) {
      const { searchText, tmpSupplierData } = action.payload
      const reg = new RegExp(searchText, 'gi')
      let newData
      newData = tmpSupplierData.map((record) => {
        const match = record.supplierName.match(reg) || record.supplierCode.match(reg)
        if (!match) {
          return null
        }
        return {
          ...record
        }
      }).filter(record => !!record)

      return { ...state, listSupplier: newData }
    },
    onSupplierReset (state, action) {
      const { searchText, tmpSupplierData } = action.payload
      const reg = new RegExp(searchText, 'gi')
      let newData

      newData = tmpSupplierData.map((record) => {
        const match = record.supplierName.match(reg) || record.supplierCode.match(reg)
        if (!match) {
          return null
        }
        return {
          ...record
        }
      }).filter(record => !!record)

      return { ...state, listSupplier: newData, searchText }
    },
    onInvoiceReset (state, action) {
      const { searchText, tmpInvoiceList } = action.payload
      const reg = new RegExp(searchText, 'gi')
      let newData

      newData = tmpInvoiceList.map((record) => {
        const match = record.transNo.match(reg)
        if (!match) {
          return null
        }
        return {
          ...record
        }
      }).filter(record => !!record)

      return { ...state, listInvoice: newData, searchText }
    },
    querySuccessByCode (state, action) {
      const { listByCode, curRecord } = action.payload

      let dataPos = (localStorage.getItem('purchase_detail') === null ? [] : JSON.parse(localStorage.getItem('purchase_detail')))
      let a = dataPos
      let grandTotal = a.reduce((cnt, o) => cnt + o.total, 0)

      return {
        ...state,
        listByCode,
        curTotal: grandTotal,
        curRecord
      }
    },
    onDiscPercent (state, action) {
      return { ...state, curDiscPercent: action.payload }
    },
    onDiscNominal (state, action) {
      return { ...state, curDiscNominal: action.payload }
    },
    chooseDate (state, action) {
      return { ...state, date: action.payload }
    },
    showProductModal (state, action) {
      return { ...state, ...action.payload, modalProductVisible: true }
    },
    modalEditShow (state, action) {
      return { ...state, ...action.payload, modalPurchaseVisible: true, item: action.payload.data }
    },
    modalEditHide (state, action) {
      return { ...state, ...action.payload, modalPurchaseVisible: false, dataBrowse: localStorage.getItem('product_detail') ? JSON.parse(localStorage.getItem('product_detail')) : [] }
    },
    setAllNull (state, action) {
      return { ...state, ...action.payload, item: '' }
    },
    onChooseSupplier (state, action) {
      return { ...state, supplierInformation: action.payload }
    },
    hideProductModal (state) {
      return { ...state, modalProductVisible: false, dataBrowse: localStorage.getItem('product_detail') ? JSON.parse(localStorage.getItem('product_detail')) : [] }
    },
    modalHide (state) {
      return { ...state, modalVisible: false }
    },
    setDiscountNominal (state, action) {
      return { ...state, discNML: action.payload }
    },
    setDiscountPerc (state, action) {
      return { ...state, discPRC: action.payload }
    },
    searchShow (state) {
      return { ...state, searchVisible: true }
    },
    resetBrowse (state) {
      return { ...state, dataBrowse: [], supplierInformation: [], transNo: {} }
    },
    searchHide (state) {
      return { ...state, searchVisible: false }
    },
    setTransNo (state, action) {
      return { ...state, transNo: action.payload, rounding: action.payload.rounding }
    },
    changeRounding (state, action) {
      return { ...state, rounding: action.payload }
    },
    setTotalItem (state, action) {
      return { ...state, item: action.payload }
    },
    getVoid (state, action) {
      return { ...state, ...action.payload, dataBrowse: localStorage.getItem('product_detail') ? JSON.parse(localStorage.getItem('product_detail')) : [] }
    },
    returnState (state, action) {
      return { ...state, ...action.payload }
    }
  }
})
