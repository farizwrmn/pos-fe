import modelExtend from 'dva-model-extend'
import { Modal, message } from 'antd'
import { routerRedux } from 'dva/router'
import { prefix } from 'utils/config.main'
import { lstorage, alertModal } from 'utils'
import moment from 'moment'
import { query, queryDetail, create, edit, remove } from 'services/adjust'
import { query as queryProducts, queryPOSproduct } from 'services/master/productstock'
import { query as queryTransType } from 'services/transType'
import { query as queryEmployee, queryByCode as queryEmployeeId } from 'services/master/employee'
import { query as querySequence } from 'services/sequence'
import { getDateTime } from 'services/setting/time'
import { queryLastActive } from 'services/period'
import get from 'lodash/get'
import { pageModel } from '../common'

const { stockMinusAlert } = alertModal
const { getCashierTrans } = lstorage

const success = () => {
  message.success('data has been saved')
}

export default modelExtend(pageModel, {
  namespace: 'adjust',

  state: {
    currentItem: {},
    addItem: {},
    activeKey: '0',
    itemEmployee: {},
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
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      current: 1
    }
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/transaction/adjust'
          || location.pathname === '/transaction/productWaste'
        ) {
          dispatch({
            type: 'loadDataAdjust'
          })
          // dispatch({
          //   type: 'queryAdjust',
          // })
          dispatch({
            type: 'updateState',
            payload: {
              ...location.query
            }
          })
          dispatch({
            type: 'queryLastAdjust'
          })
          dispatch({
            type: 'setDataBrowse',
            payload: localStorage.getItem('adjust') ? JSON.parse(localStorage.getItem('adjust')) : []
          })
        }
      })
    }
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
              total: data.total
            }
          }
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
            item: data.employee
          }
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
            item: data.data
          }
        })
      }
    },

    * queryLastAdjust ({ payload = {} }, { call, put }) {
      const invoice = {
        seqCode: 'ADJ',
        type: lstorage.getCurrentUserStore(),
        ...payload
      }
      const data = yield call(querySequence, invoice)
      const transNo = data.data
      yield put({ type: 'SuccessTransNo', payload: transNo })
    },

    * delete ({ payload }, { call, put, select }) {
      const data = yield call(remove, payload)
      const { selectedRowKeys } = yield select(models => models.purchaseId)
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

    * add ({ payload }, { call, put }) {
      const storeId = lstorage.getCurrentUserStore()
      const invoice = {
        seqCode: 'ADJ',
        type: lstorage.getCurrentUserStore()
      }
      const trans = yield call(querySequence, invoice)
      const transNo = trans.data
      const dataAdj = localStorage.getItem('adjust') ? JSON.parse(localStorage.getItem('adjust')) : []
      if (dataAdj.length > 0 && transNo !== null) {
        let arrayProd = []
        for (let n = 0; n < dataAdj.length; n += 1) {
          arrayProd.push({
            storeId,
            transType: payload.data.transType,
            productId: dataAdj[n].productId,
            productCode: dataAdj[n].code,
            productName: dataAdj[n].name,
            adjInQty: dataAdj[n].In,
            adjOutQty: dataAdj[n].Out,
            sellingPrice: dataAdj[n].price
          })
        }
        payload.data.storeId = lstorage.getCurrentUserStore()
        const period = yield call(queryLastActive)
        let startPeriod
        if (period.data[0]) {
          startPeriod = moment(period.data[0].startPeriod).format('YYYY-MM-DD')
        }
        const time = yield call(getDateTime, {
          id: 'date'
        })
        if (moment(time.data).format('YYYY-MM-DD') >= startPeriod) {
          const data = yield call(create, { id: transNo, data: payload.data, detail: arrayProd })
          if (data.success) {
            if (payload.reset) {
              payload.reset()
            }
            Modal.info({
              title: 'Success',
              content: 'Data has been saved...!'
            })
            yield put(routerRedux.push('/transaction/adjust'))
            yield put({ type: 'SuccessData' })
            yield put({ type: 'hidePopover' })
            yield put({ type: 'modalHide' })
          } else {
            stockMinusAlert(data)
            throw data
          }
        } else {
          Modal.warning({
            title: 'Period Has been closed',
            content: 'can`t insert new transaction'
          })
        }
      } else {
        Modal.warning({
          title: 'Warning',
          content: 'You cannot let the product Null...!'
        })
      }
    },

    * edit ({ payload }, { call, put }) {
      // const stockCode = yield select(({ purchase }) => purchase.currentItem.transNo)
      const dataAdj = localStorage.getItem('adjust') ? JSON.parse(localStorage.getItem('adjust')) : []
      let arrayProd = []
      for (let n = 0; n < dataAdj.length; n += 1) {
        arrayProd.push({
          storeId: lstorage.getCurrentUserStore(),
          transNo: payload.data.transNo,
          transType: payload.data.transType,
          id: dataAdj[n].id,
          productId: dataAdj[n].productId,
          productCode: dataAdj[n].code,
          productName: dataAdj[n].name,
          adjInQty: dataAdj[n].In,
          adjOutQty: dataAdj[n].Out,
          sellingPrice: dataAdj[n].price
        })
      }
      payload.data.storeId = lstorage.getCurrentUserStore()
      const editBody = {
        data: payload.data,
        detail: arrayProd
      }
      const data = yield call(edit, editBody)
      if (data.success) {
        if (payload.reset) {
          payload.reset()
        }
        success()
        yield put({ type: 'modalHide' })
        yield put({ type: 'query' })
      } else {
        stockMinusAlert(data)
        throw data
      }
    },

    * adjustEdit ({ payload }, { call, put, select }) {
      const disabledItemIn = yield select(({ adjust }) => adjust.disabledItemIn)
      const setting = yield select(({ app }) => app.setting)
      const dataBrowse = yield select(({ adjust }) => adjust.dataBrowse)
      const activeKey = yield select(({ adjust }) => adjust.activeKey)
      const storeInfo = localStorage.getItem(`${prefix}store`) ? JSON.parse(localStorage.getItem(`${prefix}store`)) : {}
      const dataBrowseMap = dataBrowse.map(x => x.productId)
      const listProductData = yield call(queryPOSproduct, { from: storeInfo.startPeriod, to: moment().format('YYYY-MM-DD'), product: (dataBrowseMap || []).toString() })

      const getQueueQuantity = () => {
        const queue = localStorage.getItem('queue') ? JSON.parse(localStorage.getItem('queue')) : {}
        // const listQueue = get(queue, `queue${curQueue}`) ? get(queue, `queue${curQueue}`) : []
        let tempQueue = []
        let tempTrans = []
        for (let n = 0; n < 10; n += 1) {
          tempQueue = get(queue, `queue${n}`) ? get(queue, `queue${n}`) : []
          if (tempQueue.length > 0) {
            tempTrans = tempTrans.concat(tempQueue[0].cashier_trans)
          }
        }
        if (tempTrans.length > 0) {
          return tempTrans
        }
        console.log('queue is empty, nothing to check')
        return []
      }

      const getCashierQuantity = () => {
        const cashier = getCashierTrans()
        return cashier
      }

      const checkQuantityNewProduct = (e) => {
        const { data } = e
        const tempQueue = getQueueQuantity()
        const tempCashier = getCashierQuantity()
        const Cashier = tempCashier.filter(el => el.productId === data.productId)
        const Queue = tempQueue.filter(el => el.productId === data.productId)
        // const item = listItem.filter(el => el.productId === data.productId)
        let arrData = []
        arrData.push({ ...data })
        const listProduct = listProductData.data
        const totalData = arrData.reduce((cnt, o) => cnt + parseFloat(o.qty), 0)
        const totalLocal = (Queue.reduce((cnt, o) => cnt + parseFloat(o.qty), 0)) + Cashier.reduce((cnt, o) => cnt + parseFloat(o.qty), 0)
        const Quantity = (arrData.concat(Queue)).concat(Cashier)
        const totalQty = Quantity.reduce((cnt, o) => cnt + parseFloat(o.qty), 0)
        const tempListProduct = listProduct.filter(el => el.productId === data.productId)
        const totalListProduct = tempListProduct.reduce((cnt, o) => cnt + o.count, 0)
        function getSetting (setting) {
          let json = setting.Inventory
          let jsondata = JSON.stringify(eval(`(${json})`))
          const outOfStock = JSON.parse(jsondata).posOrder.outOfStock
          return outOfStock
        }
        const outOfStock = getSetting(setting)
        if (totalQty > totalListProduct && outOfStock === 0) {
          Modal.warning({
            title: 'No available stock',
            content: `Your input: ${totalData}, Local : ${totalLocal} Available: ${totalListProduct}`
          })
          return false
        }
        return true
      }
      const check = {
        data: payload
      }
      if (disabledItemIn) {
        if (activeKey === '0') {
          const checkQuantity = checkQuantityNewProduct(check)
          if (!checkQuantity) {
            return
          }
        }
      }


      yield put({
        type: 'pos/showProductQtyByProductId',
        payload: {
          data: dataBrowse
        }
      })

      let dataPos = localStorage.getItem('adjust') ? JSON.parse(localStorage.getItem('adjust')) : []
      if (dataPos.length > 0) {
        let arrayProd = dataPos.slice()
        arrayProd[payload.Record - 1].price = parseFloat(payload.price)
        arrayProd[payload.Record - 1].In = parseInt(payload.InQty, 10)
        arrayProd[payload.Record - 1].Out = parseInt(payload.OutQty, 10)
        localStorage.setItem('adjust', JSON.stringify(arrayProd))
      }
      yield put({ type: 'modalEditHide' })
    },

    * adjustDelete ({ payload }, { put }) {
      let dataPos = localStorage.getItem('adjust') ? JSON.parse(localStorage.getItem('adjust')) : []
      if (dataPos.length > 0) {
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
            Out: ary[n].Out
          })
        }
        localStorage.setItem('adjust', JSON.stringify(arrayProd))
      }
      yield put({ type: 'modalEditHide' })
    },

    * getProducts ({ payload }, { call, put }) {
      const data = yield call(queryProducts, payload)
      let newData = data.data
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            listProduct: newData,
            pagination: {
              pageSize: Number(data.pageSize) || 10,
              current: Number(data.page) || 1,
              total: Number(data.total)
            }
          }
        })
      } else {
        const modal = Modal.warning({
          title: 'Warning',
          content: 'Product Not Found...!'
        })
        setTimeout(() => modal.destroy(), 1000)
        // throw data
      }
    },
    * loadDataAdjust ({ payload = {} }, { call, put }) {
      const dataAdjust = yield call(queryTransType, payload)
      const dataEmployee = yield call(queryEmployee, payload)
      localStorage.removeItem('adjust')
      yield put({
        type: 'modalEditHide'
      })
      yield put({
        type: 'setTransType',
        payload: { listType: dataAdjust.data, listEmployee: dataEmployee.data }
      })
    },
    * modalShow ({ payload = {} }, { call, put }) {
      const params = {
        transNo: payload.currentItem.transNo,
        storeId: lstorage.getCurrentUserStore()
      }
      const data = yield call(queryDetail, params)
      let detailData = []
      for (let i = 0; i < data.data.length; i += 1) {
        detailData.push({
          no: i + 1,
          id: data.data[i].id,
          code: data.data[i].productCode,
          name: data.data[i].productName,
          productId: data.data[i].productId,
          productName: data.data[i].productName,
          In: data.data[i].adjInQty,
          Out: data.data[i].adjOutQty,
          price: data.data[i].sellingPrice,
          type: 'edit'
        })
      }
      localStorage.setItem('adjust', JSON.stringify(detailData))
      yield put({
        type: 'updateState',
        payload: {
          disabledItem: true,
          modalVisible: true,
          currentItem: payload.currentItem,
          dataBrowse: detailData
        }
      })
    }
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
          ...pagination
        }
      }
    },

    queryEmployeeSuccess (state, action) {
      const { item } = action.payload
      return {
        ...state,
        itemEmployee: item
      }
    },

    queryAdjustSuccess (state, action) {
      const { item } = action.payload
      return {
        ...state,
        listAdjust: item
      }
    },

    queryGetProductsSuccess (state, action) {
      const { productInformation, tmpProductList } = action.payload
      let dataPurchase = (localStorage.getItem('purchase_detail') === null ? [] : JSON.parse(localStorage.getItem('purchase_detail')))
      let a = dataPurchase
      let grandTotal = a.reduce((cnt, o) => {
        return cnt + o.total
      }, 0)
      return {
        ...state,
        listProduct: productInformation,
        tmpProductList,
        curTotal: grandTotal
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
          ...record
        }
      }).filter(record => !!record)
      if (newData === null) {
        newData = tmpProductData
      } else {
        newData
      }
      return { ...state, listProduct: newData }
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
              label: listType[id].type
            })
          }
        }
        return fixed
      }())
      let EMPLOYEE_FIXED = (function () {
        let fixed = []
        for (let id = 0; id < listEmployee.length; id += 1) {
          let employeeName = listEmployee[id].employeeName
          fixed.push(employeeName)
        }
        return fixed
      }())
      return { ...state, templistType: tmpListType, listType: DICT_FIXED, listEmployee: EMPLOYEE_FIXED }
    },
    updateState (state, { payload }) {
      return { ...state, ...payload }
    },
    SuccessData (state) {
      localStorage.removeItem('adjust')
      return { ...state, dataBrowse: [], item: [], listEmployee: [], lastTrans: '', itemEmployee: {} }
    },
    // modalShow (state, { payload }) {
    //   return { ...state, ...payload, modalVisible: true, disableItem: true }
    // },
    modalHide (state, { payload }) {
      return { ...state, ...payload, item: [], currentItem: {}, modalVisible: false, disableItem: false, modalProductVisible: true }
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
      return {
        ...state,
        ...action.payload,
        modalEditVisible: false,
        dataBrowse: localStorage.getItem('adjust') ? JSON.parse(localStorage.getItem('adjust')) : []
      }
    },
    setDataBrowse (state, action) {
      return { ...state, ...action.payload, dataBrowse: action.payload }
    },
    onChangeDisabledItem (state, action) {
      return { ...state, ...action.payload }
    }
  }
})
