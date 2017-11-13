import modelExtend from 'dva-model-extend'
import { Modal } from 'antd'
import moment from 'moment'
import { routerRedux } from 'dva/router'
import { query, createDetail, create, edit, remove } from '../services/adjust'
import { pageModel } from './common'
import { query as queryProducts } from '../services/stock'
import { query as queryTransType } from '../services/transType'
import { query as queryEmployee, queryByCode as queryEmployeeId } from '../services/employees'
import { queryModeName as miscQuery } from '../services/misc'

export default modelExtend(pageModel, {
  namespace: 'adjust',

  state: {
    currentItem: {},
    addItem: {},
    itemEmployee: [],
    dataBrowse: [],
    listType: [],
    lastTrans: '',
    templistType: [],
    listAdjust: [],
    listEmployee: [],
    curTotal: 0,
    popoverVisible: false,
    modalEditVisible: false,
    disabledItemIn: true,
    disabledItemOut: true,
    modalVisible: false,
    modalType: '',
    item: [],
    selectedRowKeys: [],
    tmpProductList: [],
    listProduct: [],
    curDiscPercent: 0,
    curDiscNominal: 0,
    datePicker: '',
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/transaction/adjust') {
          dispatch({
            type: 'loadDataAdjust',
          })
          dispatch({
            type: 'queryAdjust',
          })
          dispatch({
            type: 'queryLastAdjust',
          })
          dispatch({
            type: 'setDataBrowse',
            payload: localStorage.getItem('adjust') ? JSON.parse(localStorage.getItem('adjust')) : null,
          })
        }
      })
    },
  },

  effects: {

    * query ({ payload = {} }, { call, put }) {
      const data = yield call(queryProducts, payload)
      if (data) {
        yield put({
          type: 'querySuccess',
          payload: {
            listProduct: data.data,
            tmpProductList: data.data,
            pagination: {
              current: Number(payload.page) || 1,
              pageSize: Number(payload.pageSize) || 5,
              total: data.total,
            },
          },
        })
      }
    },

    * queryEmployee ({ payload }, { call, put }) {
      let data = ''
      try {
        data = yield call(queryEmployeeId, payload)
      } catch (e) {
        console.log('error', e)
      }
      if (data) {
        yield put({
          type: 'queryEmployeeSuccess',
          payload: {
            item: data.employee,
          },
        })
      }
    },

    * queryAdjust ({ payload }, { call, put }) {
      let data = []
      try {
        data = yield call(query, payload)
      } catch (e) {
        console.log('error', e)
      }
      if (data) {
        yield put({
          type: 'queryAdjustSuccess',
          payload: {
            item: data.data,
          },
        })
      }
    },

    * queryLastAdjust ({ payload }, { call, put }) {
      let data = []
      try {
        data = yield call(query, payload)
      } catch (e) {
        console.log('error', e)
      }
      const format = yield call(miscQuery, { code: 'FORMAT', name: 'ADJTRANS' })
      let datatrans = `${format.data.miscVariable}/${moment().format('MMYY')}/00000`
      let dataLast
      let length = data.data.length - 1
      function pad(n, width, z) {
        z = z || '0'
        n = n + ''
        return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n
      }
      if (length > -1) {
        dataLast = data.data[length].transNo
      } else {
        dataLast = datatrans
      }
      let lastNo = dataLast.replace(/[^a-z0-9]/gi, '')
      let newMonth = lastNo.substr(format.data.miscVariable.length, 4)
      let lastTransNo = lastNo.substr(lastNo.length - 5)
      let sendTransNo = parseInt(lastTransNo) + 1
      let padding = pad(sendTransNo, 5)
      let transNo = ''
      if (newMonth === `${moment().format('MMYY')}`) {
        transNo = `${format.data.miscVariable}/${moment().format('MMYY')}/${padding}`
      } else {
        transNo = `${format.data.miscVariable}/${moment().format('MMYY')}/00001`
      }
      yield put({ type: 'SuccessTransNo', payload: transNo })
    },

    * 'delete' ({ payload }, { call, put, select }) {
      const data = yield call(remove, payload)
      const { selectedRowKeys } = yield select(_ => _.purchaseId)
      if (data.success) {
        yield put({ type: 'updateState', payload: { selectedRowKeys: selectedRowKeys.filter(_ => _ !== payload) } })
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },

    * 'deleteBatch' ({payload}, {call, put}) {
      const data = yield call(remove, payload)
      if (data.success) {
        yield put({ type: 'updateState', payload: { selectedRowKeys: [] } })
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },

    * add ({ payload }, { call, put }) {
      const dataAdj = localStorage.getItem('adjust') ? JSON.parse(localStorage.getItem('adjust')) : []
      if (dataAdj.length > 0) {
        let arrayProd = []
        for (let n = 0; n < dataAdj.length; n += 1) {
          arrayProd.push({
            transNo: payload.transNo,
            transType: payload.transType,
            productId: dataAdj[n].productId,
            productCode: dataAdj[n].code,
            productName: dataAdj[n].name,
            adjInQty: dataAdj[n].In,
            adjOutQty: dataAdj[n].Out,
            sellingPrice: dataAdj[n].price,
          })
        }
        const data = yield call(create, {id: payload.transNo, data: payload, detail: arrayProd})
        if (data.success) {
          const modal = Modal.info({
            title: 'Success',
            content: 'Data has been saved...!',
          })
          yield put(routerRedux.push('/transaction/adjust'))
          yield put({ type: 'SuccessData' })
          yield put({ type: 'hidePopover' })
          yield put({ type: 'modalHide' })
        }
      } else {
        const modal = Modal.warning({
          title: 'Warning',
          content: 'You cannot let the product Null...!',
        })
      }
    },

    *edit ({ payload }, { select, call, put }) {
      const stockCode = yield select(({purchase}) => purchase.currentItem.transNo)
      const newStock = { ...payload, stockCode }
      const data = yield call(edit, newStock)
      if (data.success) {
        yield put({ type: 'modalHide' })
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },

    * adjustEdit ({ payload }, { put }) {
      let dataPos = (localStorage.getItem('adjust') === null ? [] : JSON.parse(localStorage.getItem('adjust')))
      if (dataPos.length > 0) {
        let arrayProd = dataPos.slice()
        arrayProd[payload.Record - 1].price = parseFloat(payload.price)
        arrayProd[payload.Record - 1].In = parseInt(payload.InQty, 10)
        arrayProd[payload.Record - 1].Out = parseInt(payload.OutQty, 10)
        localStorage.setItem('adjust', JSON.stringify(arrayProd))
      }
      yield put({ type: 'modalEditHide' })
    },

    * adjustDelete ({ payload }, { call, put }) {
      let dataPos = (localStorage.getItem('adjust') === null ? [] : JSON.parse(localStorage.getItem('adjust')))
      if (dataPos.length > 0) {
        let arrayProd = dataPos.slice()
        Array.prototype.remove = function() {
          let what, a = arguments, L = a.length, ax
          while (L && this.length) {
            what = a[--L]
            while ((ax = this.indexOf(what)) !== -1) {
              this.splice(ax, 1)
            }
          }
          return this
        }

        let ary = arrayProd
        ary.remove(arrayProd[payload.Record - 1])
        arrayProd = []
        for (let n = 0; n < ary.length; n += 1) {
          arrayProd.push({
            no: n + 1,
            code: ary[n].code,
            productId: ary[n].productId,
            name: ary[n].name,
            price: ary[n].price,
            In: ary[n].In,
            Out: ary[n].Out,
          })
        }
      }
      yield put({ type: 'modalEditHide' })
    },

    *getProducts ({ payload }, { call, put }) {
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
      } else {
        const modal = Modal.warning({
          title: 'Warning',
          content: 'Product Not Found...!',
        })
        setTimeout(() => modal.destroy(), 1000)
        // throw data
      }
    },
    * loadDataAdjust ({ payload }, { call, put }) {
      const dataAdjust = yield call(queryTransType)
      const dataEmployee = yield call(queryEmployee)
      localStorage.removeItem('adjust')
      yield put({
        type: 'modalEditHide',
      })
      yield put({
        type: 'setTransType',
        payload: { listType: dataAdjust.data, listEmployee: dataEmployee.data },
      })
    },
  },

  reducers: {

    querySuccess (state, action) {
      const { listProduct, tmpProductList, pagination } = action.payload
      return {
        ...state,
        listProduct,
        tmpProductList,
        pagination: {
          ...state.pagination,
          ...pagination,
        },
      }
    },

    queryEmployeeSuccess (state, action) {
      const { item } = action.payload
      return {
        ...state,
        itemEmployee: item,
      }
    },

    queryAdjustSuccess (state, action) {
      const { item } = action.payload
      return {
        ...state,
        listAdjust: item,
      }
    },

    queryGetProductsSuccess (state, action) {
      const { productInformation, tmpProductList } = action.payload
      let dataPurchase = (localStorage.getItem('purchase_detail') === null ? [] : JSON.parse(localStorage.getItem('purchase_detail')))
      let a = dataPurchase
      let grandTotal = a.reduce(function (cnt, o) {
        return cnt + o.total
      }, 0)
      return {
        ...state,
        listProduct: productInformation,
        tmpProductList: tmpProductList,
        curTotal: grandTotal,
      }
    },
    onProductSearch (state, action) {
      const { searchText, tmpProductData } = action.payload
      const reg = new RegExp(searchText, 'gi')
      let newData
      newData = tmpProductData.map((record) => {
        const match = record.productName.match(reg) || record.productCode.match(reg)
        if (!match) {
          return null
        }
        return {
          ...record,
        }
      }).filter(record => !!record)
      if (newData === null) {
        newData = reset
      } else {
        newData
      }
      return {...state, listProduct: newData}
    },
    setTransType (state, action) {
      const { listType, listEmployee } = action.payload
      const tmpListType = listType
      let DICT_FIXED = (function () {
        let fixed = []
        for (let id in listType) {
          if ({}.hasOwnProperty.call(listType, id)) {
            fixed.push({
              value: listType[id].code,
              label: listType[id].type,
            })
          }
        }
        return fixed
      }())

      let EMPLOYEE_FIXED = (function () {
        let fixed = []
        for (let id in listEmployee) {
          let employeeName = listEmployee[id].employeeName
          fixed.push(employeeName)
        }
        return fixed
      }())
      return { ...state, templistType: tmpListType, listType: DICT_FIXED, listEmployee: EMPLOYEE_FIXED }
    },
    SuccessData (state) {
      localStorage.removeItem('adjust')
      return { ...state, dataBrowse: [], item: [], listEmployee: [], lastTrans: '', itemEmployee: '' }
    },
    modalShow (state, { payload }) {
      return { ...state, ...payload, modalVisible: true, disableItem: true }
    },
    modalHide (state, { payload }) {
      return { ...state, ...payload, modalVisible: false, disableItem: false, modalProductVisible: true }
    },
    onInputChange (state, action) {
      return { ...state, searchText: action.payload.searchText, popoverVisible: true }
    },
    hidePopover (state) {
      return { ...state, searchText: '', popoverVisible: false }
    },
    showProductModal (state, action) {
      return { ...state, ...action.payload, modalProductVisible: true }
    },
    resetAll (state) {
      return { ...state, dataBrowse: [] }
    },
    SuccessTransNo (state, action) {
      return { ...state, lastTrans: action.payload }
    },
    modalEditShow (state, action) {
      return { ...state, ...action.payload, modalEditVisible: true, item: action.payload.data }
    },
    modalEditHide (state, action) {
      return { ...state, ...action.payload, modalEditVisible: false,
        dataBrowse: localStorage.getItem('adjust') ? JSON.parse(localStorage.getItem('adjust')) : []}
    },
    setDataBrowse (state, action) {
      return { ...state, ...action.payload, dataBrowse: action.payload }
    },
    onChangeDisabledItem (state, action) {
      console.log('onChangeDisabledItem', action.payload)
      return { ...state, ...action.payload }
    },
  },
})
