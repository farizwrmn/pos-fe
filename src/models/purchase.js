import modelExtend from 'dva-model-extend'
import { query, createDetail, create, edit, remove } from '../services/purchase'
import { pageModel } from './common'
import { query as queryProducts } from '../services/stock'
import { query as querySupplier } from '../services/suppliers'
import { Modal } from 'antd'
import moment from 'moment'

export default modelExtend(pageModel, {
  namespace: 'purchase',

  state: {
    currentItem: {},
    date: '',
    addItem: {},
    curTotal: 0,
    tempo: 0,
    curRecord: 1,
    curQty: 1,
    modalVisible: false,
    searchVisible: false,
    modalType: '',
    modalPaymentVisible: false,
    disableItem: {},
    modalProductVisible: false,
    selectedRowKeys: [],
    tmpProductList: [],
    listProduct: [],
    dataBrowse: localStorage.getItem('product_detail') ? JSON.parse(localStorage.getItem('product_detail')) : [],
    curDiscPercent: 0,
    curDiscNominal: 0,
    datePicker: '',
  },

  subscriptions: {
  },

  effects: {

    *query ({payload = {}}, {call, put}) {
      const data = yield call(query, payload)
      console.log('purchase query', data);
      if (data) {
        yield put({
          type: 'querySuccess',
          payload: {
            listPurchase: data.data,
            pagination: {
              current: Number(payload.page) || 1,
              pageSize: Number(payload.pageSize) || 5,
              total: data.total,
            },
          },
        })
      }
    },

    * querySupplier ({payload = {}}, {call, put}) {
      const data = yield call(querySupplier, payload)
      if (data) {
        yield put({
          type: 'querySuccess',
          payload: {
              listSupplier: data.data,
            pagination: {
              current: Number(payload.page) || 1,
              pageSize: Number(payload.pageSize) || 5,
              total: data.total,
            },
          },
        })
      }
    },

    *'delete' ({payload}, {call, put, select}) {
      const data = yield call(remove, payload)
      const {selectedRowKeys} = yield select(_ => _.purchaseId)
      if (data.success) {
        yield put({type: 'updateState', payload: {selectedRowKeys: selectedRowKeys.filter(_ => _ !== payload)}})
        yield put({type: 'query'})
      } else {
        throw data
      }
    },

    *'deleteBatch' ({payload}, {call, put}) {
      const data = yield call(remove, payload)
      if (data.success) {
        yield put({type: 'updateState', payload: {selectedRowKeys: []}})
        yield put({type: 'query'})
      } else {
        throw data
      }
    },

    * add ({ payload }, { call, put }) {
      let purchase_detail = localStorage.getItem('product_detail') ? JSON.parse(localStorage.getItem('product_detail')) : []
      if (purchase_detail.length != 0) {
        const data = yield call(create, {id: payload.transNo, data: payload})
        if (data.success) {
          let arrayProd = []
          for (let n = 0; n < purchase_detail.length; n++) {
            if (payload.taxType === 'I') {
              purchase_detail[n].ppn = 0.1 * purchase_detail[n].price
            } else if (payload.taxType === 'E') {
              purchase_detail[n].ppn = 0
            }
            arrayProd.push({
              transNo: payload.transNo,
              productId: purchase_detail[n].code,
              productName: purchase_detail[n].name,
              qty: purchase_detail[n].qty,
              purchasePrice: purchase_detail[n].price,
              DPP: ((purchase_detail[n].price) - (((purchase_detail[n].disc1 / 100) * purchase_detail[n].price)) - (purchase_detail[n].discount)),
              PPN: purchase_detail[n].ppn,
              discPercent: purchase_detail[n].disc1,
              discNominal: purchase_detail[n].discount,
              transType: payload.transType,
              year: moment().format('YYYY'),
              periode: moment().format('M')
            })
          }
          const detail = yield call(createDetail, { id: payload.transNo ,data: arrayProd })
          if (detail.success) {
            const modal = Modal.info({
              title: 'Transaction Success',
              content: `Transaction ${payload.transNo} has been saved`
            })
            localStorage.removeItem('product_detail')
            yield put({ type: 'resetBrowse' })
          }
        } else {
          const modal = Modal.error({
            title: 'Error Saving Payment',
            content: 'Your Data not saved',
          })
        }
      } else {
        Modal.warning({
          title: 'Error Saving Payment',
          content: 'Please complete your payment',
        })
      }
    },

    *edit ({payload}, {select, call, put}) {
      const stockCode = yield select(({purchase}) => purchase.currentItem.transNo)
      const newStock = {...payload, stockCode}
      const data = yield call(edit, newStock)
      if (data.success) {
        yield put({type: 'modalHide'})
        yield put({type: 'query'})
      } else {
        throw data
      }
    },
    *getProducts ({payload}, {call, put}) {
      const data = yield call(queryProducts, payload)
      let newData = payload ? data.product : data.data
      if (data.success) {
        yield put({
          type: 'queryGetProductsSuccess',
          payload: {
            productInformation: newData,
            tmpProductList: newData,
          },
        })
      }
      else {
        const modal = Modal.warning({
          title: 'Warning',
          content: 'Product Not Found...!',
        })
        setTimeout(() => modal.destroy(), 1000)
        //throw data
      }
    },
    *editPurchase ({payload}, {put}) {
      var dataPos = (localStorage.getItem('product_detail') === null ? [] : JSON.parse(localStorage.getItem('product_detail')))
      var arrayProd = dataPos.slice()
      var price = payload.effectedRecord === 0 ? '' : arrayProd[payload.effectedRecord - 1].price
      var qty = payload.effectedRecord === 0 ? '' : arrayProd[payload.effectedRecord - 1].qty
      var discount = payload.effectedRecord === 0 ? '' : arrayProd[payload.effectedRecord - 1].discount
      var disc1 = payload.effectedRecord === 0 ? '' : arrayProd[payload.effectedRecord - 1].disc1
      var ppn = payload.effectedRecord === 0 ? '' : arrayProd[payload.effectedRecord - 1].ppn
      var dpp = payload.effectedRecord === 0 ? '' : arrayProd[payload.effectedRecord - 1].dpp
      var ppnValue
      if ( payload.kodeUtil == 'price' ) {
        price = payload.value
        arrayProd[payload.effectedRecord - 1].price = price
        arrayProd[payload.effectedRecord - 1].discount = discount
        arrayProd[payload.effectedRecord - 1].disc1 = disc1
        arrayProd[payload.effectedRecord - 1].qty = qty
        var ppnTempValue = arrayProd[payload.effectedRecord - 1].ppn === 0 ? 0 : 0.1
        ppn = ((ppnTempValue * price) * qty)
        dpp = ((qty * price) - ppn)
        arrayProd[payload.effectedRecord - 1].dpp = dpp
        arrayProd[payload.effectedRecord - 1].ppn = ppn
        const total = (price * qty) - ((qty * (price * disc1) / 100)) - (qty * discount)
        arrayProd[payload.effectedRecord - 1].total = total
      }
      else if ( payload.kodeUtil == 'discount' ) {
        discount = payload.value
        arrayProd[payload.effectedRecord - 1].price = price
        arrayProd[payload.effectedRecord - 1].discount = discount
        arrayProd[payload.effectedRecord - 1].disc1 = disc1
        arrayProd[payload.effectedRecord - 1].qty = qty
        var ppnTempValue = arrayProd[payload.effectedRecord - 1].ppn  === 0 ? 0 : 0.1
        ppn = ((ppnTempValue * price) * qty)
        dpp = ((qty * price) - ppn)
        arrayProd[payload.effectedRecord - 1].dpp = dpp
        arrayProd[payload.effectedRecord - 1].ppn = ppn
        const total = (price * qty) - ((qty * (price * disc1) / 100)) - (qty * discount)
        arrayProd[payload.effectedRecord - 1].total = total
      }
      else if ( payload.kodeUtil === 'disc1' ) {
        disc1 = payload.value
        arrayProd[payload.effectedRecord - 1].price = price
        arrayProd[payload.effectedRecord - 1].discount = discount
        arrayProd[payload.effectedRecord - 1].disc1 = disc1
        arrayProd[payload.effectedRecord - 1].qty = qty
        var ppnTempValue = arrayProd[payload.effectedRecord - 1].ppn === 0 ? 0 : 0.1
        ppn = ((ppnTempValue * price) * qty)
        dpp = ((qty * price) - ppn)
        arrayProd[payload.effectedRecord - 1].dpp = dpp
        arrayProd[payload.effectedRecord - 1].ppn = ppn
        const total = (price * qty) - ((qty * (price * disc1) / 100)) - (qty * discount)
        arrayProd[payload.effectedRecord - 1].total = total
      }
      else if ( payload.kodeUtil == 'qty') {
        qty = payload.value
        arrayProd[payload.effectedRecord - 1].price = price
        arrayProd[payload.effectedRecord - 1].discount = discount
        arrayProd[payload.effectedRecord - 1].disc1 = disc1
        arrayProd[payload.effectedRecord - 1].qty = qty
        var ppnTempValue = arrayProd[payload.effectedRecord - 1].ppn === 0 ? 0 : 0.1
        ppn = ((ppnTempValue * price) * qty)
        dpp = ((qty * price) - ppn)
        arrayProd[payload.effectedRecord - 1].dpp = dpp
        arrayProd[payload.effectedRecord - 1].ppn = ppn
        const total = (price * qty) - ((qty * (price * disc1) / 100)) - (qty * discount)
        arrayProd[payload.effectedRecord - 1].total = total
      }
      else if ( payload.kodeUtil == 'I') {
        ppnValue = 0.1
        for (var n=1; n<=arrayProd.length; n++){
          ppn = (ppnValue * arrayProd[n-1].price)
          dpp = (arrayProd[n-1].price - ppn)
          qty = arrayProd[n - 1].qty
          arrayProd[n-1].ppn = ppn * qty
          arrayProd[n-1].dpp = dpp * qty
        }
      }
      else if ( payload.kodeUtil == 'E') {
        ppnValue = 0
        for (var n=1; n<=arrayProd.length; n++){
          ppn = (ppnValue * arrayProd[n-1].price)
          dpp = (arrayProd[n-1].price - ppn)
          qty = arrayProd[n - 1].qty
          arrayProd[n-1].ppn = ppn * qty
          arrayProd[n-1].dpp = dpp * qty
        }
      }
      else if ( payload.kodeUtil == 'ket') {
        arrayProd[payload.effectedRecord - 1].ket = payload.value
      }
      localStorage.setItem('product_detail', JSON.stringify(arrayProd))
      yield put({ type: 'setAllNull' })
      yield put({ type: 'modalEditHide' })
    },

  },

  reducers: {

    querySuccess (state, action) {
      const { listPurchase, listSupplier, pagination } = action.payload
      return {
        ...state,
        listPurchase,
        listSupplier,
        pagination: {
          ...state.pagination,
          ...pagination,
        },
      }
    },

    queryGetProductsSuccess (state, action) {
      const { productInformation, tmpProductList } = action.payload
      var dataPurchase = (localStorage.getItem('purchase_detail') === null ? [] : JSON.parse(localStorage.getItem('purchase_detail')))
      var a = dataPurchase
      var grandTotal = a.reduce(function (cnt, o) {
        return cnt + o.total;
      }, 0)
      return {
        ...state,
        listProduct: productInformation,
        tmpProductList: tmpProductList,
        curTotal: grandTotal,
      }
    },
    onProductSearch (state, action) {
      const { searchText, tmpProductList } = action.payload;
      const reg = new RegExp(searchText, 'gi');
      var newData
      newData = tmpProductList.map((record) => {
        const match = record.productName.match(reg) || record.productCode.match(reg)
        if (!match) {
          return null;
        }
        return {
          ...record,
        };
      }).filter(record => !!record)

      return { ...state, listProduct: newData }
    },
    onSupplierSearch (state, action) {
      const { searchText, tmpSupplierData } = action.payload;
      const reg = new RegExp(searchText, 'gi');
      var newData

      newData = tmpSupplierData.map((record) => {
        const match = record.supplierName.match(reg) || record.supplierCode.match(reg) || record.address01.match(reg)
        if (!match) {
          return null;
        }
        return {
          ...record,
        };
      }).filter(record => !!record)
      return { ...state, listSupplier: newData }
    },
    onProductReset (state, action) {
      const { searchText, tmpProductList } = action.payload;
      const reg = new RegExp(searchText, 'gi');
      var newData

      newData = tmpProductList.map((record) => {
        const match = record.productName.match(reg)
        if (!match) {
          return null;
        }
        return {
          ...record,
        };
      }).filter(record => !!record)

      return { ...state, listProduct: newData, searchText: searchText }
    },
    querySuccessByCode (state, action) {
      const { listByCode, curRecord } = action.payload

      var dataPos = (localStorage.getItem('purchase_detail') === null ? [] : JSON.parse(localStorage.getItem('purchase_detail')))
      var a = dataPos
      var grandTotal = a.reduce( function(cnt,o){ return cnt + o.total; }, 0)

      return { ...state,
        listByCode,
        curTotal: grandTotal,
        curRecord: curRecord }
    },
    onInputChange (state, action) {
      return { ...state, searchText: action.payload.searchText }
    },
    onDiscPercent (state, action) {
      return { ...state, curDiscPercent: action.payload }
    },
    onDiscNominal (state, action) {
      return { ...state, curDiscNominal: action.payload }
    },
    chooseDate (state, action) {
      return {...state, date: action.payload}
    },
    chooseDatePicker (state, action) {
      console.log('chooseDatePicker', action.payload)
      return {...state, tempo: 0,datePicker: action.payload}
    },
    showProductModal (state, action) {
      return {...state, ...action.payload, modalProductVisible: true}
    },
    modalEditShow (state, action) {
      return {...state, ...action.payload, modalPurchaseVisible: true, item: action.payload.data}
    },
    modalEditHide (state, action) {
      return {...state, ...action.payload, modalPurchaseVisible: false, dataBrowse: JSON.parse(localStorage.getItem('product_detail')) }
    },
    setAllNull (state, action) {
      return {...state, ...action.payload, item: '' }
    },
    onChooseSupplier (state, action) {
      console.log('onChooseSupplier')
      return {...state, supplierInformation: action.payload}
    },
    hideProductModal (state) {
      return { ...state, modalProductVisible: false, dataBrowse: JSON.parse(localStorage.getItem('product_detail')) }
    },
    modalHide (state) {
      return {...state, modalVisible: false}
    },
    searchShow (state) {
      return {...state, searchVisible: true}
    },
    resetBrowse (state) {
      return { ...state, dataBrowse: [] }
    },
    searchHide (state) {
      return {...state, searchVisible: false}
    },
  },
})
