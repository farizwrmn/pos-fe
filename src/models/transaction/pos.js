import * as stockService from '../../services/stock'
import * as memberService from '../../services/member'
// import * as serviceService from '../../services/service'
import * as cashierService from '../../services/cashier'

import { query as queryMembers, queryByCode as queryMemberCode } from '../../services/customers'
import { queryMechanics as queryMechanics, queryMechanicByCode as queryMechanicCode } from '../../services/employees'
import { query as queryProducts, queryProductByCode as queryProductCode } from '../../services/stock'
import { query as queryService, queryServiceByCode as queryServiceByCode } from '../../services/service'

import { parse } from 'qs'
import { Modal } from 'antd'
import { routerRedux } from 'dva/router'

const { query, queryByCode } = stockService
const { memberByCode = memberService.queryByCode } = memberService
// const { queryService, queryServiceByCode } = serviceService
const { getCashierNo, getCashierTrans, createCashierTrans, updateCashierTrans } = cashierService

export default {

  namespace: 'pos',

  state: {
    list: [],
    tmpList: [],
    listCashier: [],
    listMember: [],
    listMechanic: [],
    listProduct: [],
    listByCode: [],
    listQueue: (localStorage.getItem('queue1') === null ? [] : JSON.parse(localStorage.getItem('queue1'))),
    curQueue: 1,
    currentItem: {},
    modalMemberVisible: false,
    modalHelpVisible: false,
    modalWarningVisible: false,
    modalMechanicVisible: false,
    modalProductVisible: false,
    modalServiceVisible: false,
    modalQueueVisible: false,
    modalVisible: false,
    visiblePopover: false,
    modalType: 'add',
    selectedRowKeys: [],
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => `Total ${total} Records`,
      current: 1,
      total: null,
    },
    curBarcode: '',
    lastMeter: '',
    curTotal: 0,
    curTotalDiscount: 0,
    kodeUtil: 'member',
    infoUtil: 'Input Member Code',
    dataPosLoaded: false,
    memberInformation: JSON.parse(localStorage.getItem('member'))[0] ? JSON.parse(localStorage.getItem('member'))[0] : [],
    tmpMemberList: [],
    tmpMechanicList: [],
    tmpProductList: [],
    mechanicInformation: [],
    memberUnitInfo: [],
    curRecord: 1,
    effectedRecord: '',
    curRounding: 0,
    curQty: 1,
    filterDropdownVisible: false,
    searchText: '',
    filtered: false,
    curTime: '00-00-00',
    modalShiftVisible: true,
    curCashierNo: localStorage.getItem('cashierNo'),
    curShift: '',
    dataCashierTrans: {},
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname === '/transaction/pos') {
          dispatch({
            type: 'loadDataPos',
          })
        }
      })
    },
  },

  effects: {
    *query ({ payload }, { call, put }) {
      console.log('location.search', location.search)
      payload = parse(location.search.substr(1))
      let { pageSize, page, ...other } = payload
      const data = yield call(query, payload)
      let newData = data.data

      if ( data.success ) {
        //filter
        for (let key in other) {
          if ({}.hasOwnProperty.call(other, key)) {
            newData = newData.filter((item) => {
              if ({}.hasOwnProperty.call(item, key)) {
                return String(item[key]).trim().indexOf(decodeURI(other[key]).trim()) > -1
              }
              return true
            })
          }
        }
        //---------------
        pageSize = pageSize || 10
        page = page || 1

        const stocks = newData.slice((page - 1) * pageSize, page * pageSize)
        const totalData = newData.length

        //yield put({ type: 'hideModal' })
        yield put({
          type: 'querySuccess',
          payload: {
            list: stocks,
            tmpList: stocks,
            pagination: {
              current: Number(payload.page) || 1,
              pageSize: Number(payload.pageSize) || 10,
              total: totalData,
            },
          },
        })
      }
    },

    *queryService ({ payload }, { call, put }) {
      payload = parse(location.search.substr(1))
      let { pageSize, page, ...other } = payload
      const data = yield call(queryService, payload)
      let newData = data.services

      if ( data.success ) {
        //filter
        for (let key in other) {
          if ({}.hasOwnProperty.call(other, key)) {
            newData = newData.filter((item) => {
              if ({}.hasOwnProperty.call(item, key)) {
                return String(item[key]).trim().indexOf(decodeURI(other[key]).trim()) > -1
              }
              return true
            })
          }
        }
        //---------------
        pageSize = pageSize || 10
        page = page || 1

        const services = newData.slice((page - 1) * pageSize, page * pageSize)
        const totalData = newData.length

        //yield put({ type: 'hideModal' })
        yield put({
          type: 'queryServiceSuccess',
          payload: {
            list: services,
            pagination: {
              current: Number(payload.page) || 1,
              pageSize: Number(payload.pageSize) || 10,
              total: totalData,
            },
          },
        })
      }
    },

    *getStock ({ payload }, { call, put }) {
      const data = yield call(queryByCode, payload.productCode)
      let newData = data.stocks

      if ( data.success ) {
        var arrayProd
        if ( JSON.stringify(payload.listByCode) == "[]" ) {
          arrayProd = payload.listByCode.slice()
        }
        else {
          arrayProd = JSON.parse(payload.listByCode.slice())
        }

        arrayProd.push({
          'no': payload.curRecord,
          'barcode': newData.productBarcode1,
          'name': newData.productName,
          'qty': 1,
          'price': (payload.memberCode ? newData.memberPrice : newData.sellingPrice),
          'discount': 0,
          'disc1': 0,
          'disc2': 0,
          'disc3': 0,
          'total': (payload.memberCode ? newData.memberPrice : newData.sellingPrice) * payload.curQty
        })

        localStorage.setItem('cashier_trans', JSON.stringify(arrayProd))

        yield put({
          type: 'querySuccessByCode',
          payload: {
            listByCode: newData,
            curRecord: payload.curRecord + 1,
          },
        })
      }
      else {
        const modal = Modal.warning({
          title: 'Warning',
          content: 'Stock Not Found...!',
        })

        setTimeout(() => modal.destroy(), 1000)
      }
    },

    *getService ({ payload }, { call, put }) {
      const data = yield call(queryServiceByCode, payload.serviceId)
      let newData = data.services

      if ( data.success ) {
        var arrayProd
        if ( JSON.stringify(payload.listByCode) == "[]" ) {
          arrayProd = payload.listByCode.slice()
        }
        else {
          arrayProd = JSON.parse(payload.listByCode.slice())
        }

        arrayProd.push({
          'no': payload.curRecord,
          'barcode': newData.serviceId,
          'name': newData.serviceDescription,
          'qty': payload.curQty,
          'price': (payload.memberCode ? newData.memberPrice : newData.normalPrice),
          'discount': 0,
          'disc1': 0,
          'disc2': 0,
          'disc3': 0,
          'total': (payload.memberCode ? newData.memberPrice : newData.normalPrice) * payload.curQty
        })

        localStorage.setItem('cashier_trans', JSON.stringify(arrayProd))

        yield put({
          type: 'queryServiceSuccessByCode',
          payload: {
            listByCode: newData,
            curRecord: payload.curRecord + 1,
          },
        })
      }
      else {
        const modal = Modal.warning({
          title: 'Warning',
          content: 'Service Not Found...!',
        })

        setTimeout(() => modal.destroy(), 1000)

        //throw data
      }
    },

    *loadDataPos ({ payload }, { call, put }) {
      var dataPos = (localStorage.getItem('cashier_trans') === null ? [] : JSON.parse(localStorage.getItem('cashier_trans')))
      var arrayProd = dataPos.slice()
      var curRecord = 0

      var curCashierNo = localStorage.getItem('cashierNo')
      var curShift = localStorage.getItem('cashierShift')

      var curItem
      const dataCashier = yield call(getCashierNo)
      const dataCashierTrans = yield call(getCashierTrans, {cashierId: null, cashierNo: curCashierNo, shift: null, status: "O"})

      if ( dataCashierTrans.success ) {
        curItem = dataCashierTrans.data
      }
      else {
        curItem = {}
      }

      if ( JSON.stringify(arrayProd) != "[]" ) {
        for (var i in arrayProd) {
          var disc1 = arrayProd[i].disc1
          var disc2 = arrayProd[i].disc2
          var disc3 = arrayProd[i].disc3

          /*
          if ( arrayProd[i].barcode.substr(0, 3) != 'SVC' ) {
            const dataStock = yield call(queryByCode, arrayProd[i].barcode)
            let newDataStock = dataStock.stocks
            arrayProd[i].price = newDataStock.sellingPrice

            var tmpTotal = (arrayProd[i].qty * newDataStock.sellingPrice)
            var tmpDisc = (tmpTotal * disc1) / 100
            var tmpDisc2 = ((tmpTotal - tmpDisc) * disc2) / 100
            var tmpDisc3 = ((tmpTotal - tmpDisc - tmpDisc2) * disc3) / 100

            arrayProd[i].total = tmpTotal - tmpDisc - tmpDisc2 - tmpDisc3 - arrayProd[i].discount
          }
          else {
            const dataService = yield call(queryServiceByCode, arrayProd[i].barcode)
            let newDataService = dataService.services
            arrayProd[i].price = newDataService.normalPrice

            var tmpTotal = (arrayProd[i].qty * newDataService.normalPrice)
            var tmpDisc = (tmpTotal * disc1) / 100
            var tmpDisc2 = ((tmpTotal - tmpDisc) * disc2) / 100
            var tmpDisc3 = ((tmpTotal - tmpDisc - tmpDisc2) * disc3) / 100

            arrayProd[i].total = tmpTotal - tmpDisc - tmpDisc2 - tmpDisc3 - arrayProd[i].discount
          }
          */
          curRecord += 1 //Untuk mengambil jumlah record
        }
        yield put({
          type: 'setStatePosLoaded',
          payload: { arrayProd: JSON.stringify(arrayProd),
            curRecord: curRecord + 1}
        })
      }
      yield put({
        type: 'setCashierNo',
        payload: { listCashier: dataCashier.data,
                    dataCashierTrans: curItem, }
      })
    },

    *getMember ({ payload }, { call, put }) {
      const data = yield call(queryMemberCode, payload)
      let newData = payload ? data.member : data.data
      if ( data.success ) {
        yield put({
          type: 'queryGetMemberSuccess',
          payload: {
            memberInformation: newData,
          },
        })
      }
      else {
        const modal = Modal.warning({
          title: 'Warning',
          content: 'Member Not Found...!',
        })
        setTimeout(() => modal.destroy(), 1000)
        //throw data
      }
    },

    *getMembers ({ payload }, { call, put }) {
      const data = yield call(queryMembers, payload)
      let newData = payload ? data.member : data.data
      if ( data.success ) {
        yield put({
          type: 'queryGetMembersSuccess',
          payload: {
            memberInformation: newData,
            tmpMemberList: newData,
          },
        })
      }
      else {
        const modal = Modal.warning({
          title: 'Warning',
          content: 'Member Not Found...!',
        })
        setTimeout(() => modal.destroy(), 1000)
        //throw data
      }
    },

    *getServices ({ payload }, { call, put }) {
      const data = yield call(queryService, payload)
      let newData = payload ? data.service : data.data
      if ( data.success ) {
        yield put({
          type: 'queryGetServicesSuccess',
          payload: {
            serviceInformation: newData,
            tmpServiceList: newData,
          },
        })
      }
      else {
        const modal = Modal.warning({
          title: 'Warning',
          content: 'Service Not Found...!',
        })
        setTimeout(() => modal.destroy(), 1000)
        //throw data
      }
    },

    *getMechanic ({ payload }, { call, put }) {
      const data = yield call(queryMechanicCode, payload)
      let newData = payload ? data.mechanic : data.data
      if ( data.success ) {
        yield put({
          type: 'queryGetMechanicSuccess',
          payload: {
            mechanicInformation: newData,
          },
        })
      }
      else {
        const modal = Modal.warning({
          title: 'Warning',
          content: 'Member Not Found...!',
        })
        setTimeout(() => modal.destroy(), 1000)
        //throw data
      }
    },

    *getMechanics ({ payload }, { call, put }) {
      const data = yield call(queryMechanics, payload)
      let newData = payload ? data.mechanic : data.data
      if ( data.success ) {
        yield put({
          type: 'queryGetMechanicsSuccess',
          payload: {
            mechanicInformation: newData,
            tmpMechanicList: newData,
          },
        })
      }
      else {
        const modal = Modal.warning({
          title: 'Warning',
          content: 'Mechanic Not Found...!',
        })
        setTimeout(() => modal.destroy(), 1000)
        //throw data
      }
    },

    *getProducts ({ payload }, { call, put }) {
      const data = yield call(queryProducts, payload)
      let newData = payload ? data.product : data.data
      if ( data.success ) {
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

    *setCashierTrans ({ payload }, { call, put }) {
      const dataCashierTransById = yield call(getCashierTrans, {cashierId: payload.cashierId, cashierNo: null, shift: null, status: "O"})
      const dataCashierTransByNo = yield call(getCashierTrans, {cashierId: null, cashierNo: payload.cashierNo, shift: null, status: "O"})
      const dataCashierTransByShift = yield call(getCashierTrans, {cashierId: null, cashierNo: payload.cashierNo, shift: payload.shift, status: "C"})

      const newDataCashierTransById = dataCashierTransById.data
      const newDataCashierTransByNo = dataCashierTransByNo.data
      //const newDataCashierTransByShift = dataCashierTransByShift.data

      if ( dataCashierTransByShift.success ) {
        Modal.warning({
          title: 'Warning',
          content: 'This Shift has been closed for this Machine...!',
        })
      }
      else if ( dataCashierTransById.success ) {
        if ( newDataCashierTransById.cashierNo != payload.cashierNo ) {
          Modal.warning({
            title: 'Warning',
            content: 'Cashier Id ' + payload.cashierId + ' status is Open in Machine ' + newDataCashierTransById.cashierNo + '...!',
          })
        }
        else if ( newDataCashierTransById.shift != payload.shift ) {
          Modal.warning({
            title: 'Warning',
            content: 'Cashier Id ' + payload.cashierId + ' status is Open in this Machine on Shift ' + newDataCashierTransById.shift + '...!',
          })
        }
        else {
          yield put({ type: 'hideShiftModal',
            payload: {
              curShift: payload.shift,
              curCashierNo: payload.cashierNo,
            },})
        }
      }
      else if ( dataCashierTransByNo.success ) {
        if ( newDataCashierTransByNo.cashierId != payload.cashierId ) {
          Modal.warning({
            title: 'Warning',
            content: 'This Machine is logged on by Cashier ' + newDataCashierTransByNo.cashierId + '...!',
          })
        }
        else {
          yield put({ type: 'hideShiftModal',
            payload: {
              curShift: payload.shift,
              curCashierNo: payload.cashierNo,
            },})
        }
      }
      else {
        const data = yield call(createCashierTrans, payload)

        if (data.success) {
          localStorage.setItem('cashierNo', payload.cashierNo)

          yield put({ type: 'hideShiftModal',
            payload: {
              curShift: payload.shift,
              curCashierNo: payload.cashierNo,
            },})
        } else {
          throw data
        }
      }
    },

    *setCloseCashier ({ payload }, { call, put }) {
      const data_cashier_trans_update = yield call(updateCashierTrans, payload)

      if ( data_cashier_trans_update.success ) {
        yield put({
          type: 'setAllNull',
        })

        Modal.info({
          title: 'Information',
          content: 'Cashier closed successfull...!',
        })
      }
      else {
        Modal.warning({
          title: 'Warning',
          content: 'Cashier cannot be closed, please contact your IT Support...!',
        })
      }
    },

    *insertQueue ({ payload }, { call, put }) {
      var dataPos = (localStorage.getItem('queue' + payload.queue) === null ? [] : JSON.parse(localStorage.getItem('queue' + payload.queue)))
      var arrayProd = dataPos.slice()

      if ( JSON.stringify(arrayProd) != "[]" ) {
        for (var i in arrayProd) {
          var disc1 = arrayProd[i].disc1
          var disc2 = arrayProd[i].disc2
          var disc3 = arrayProd[i].disc3

          if ( arrayProd[i].code != null ) {
            let dataStock = yield call(queryProductCode, arrayProd[i].code)
            let validData = yield call(queryServiceByCode, arrayProd[i].code)
            let newDataStock = dataStock.data ? dataStock.data : validData.data
            arrayProd[i].price = newDataStock.sellPrice ? newDataStock.sellPrice : newDataStock.serviceCost
            const sell = newDataStock.sellPrice ? newDataStock.sellPrice : newDataStock.serviceCost
            var tmpTotal = (arrayProd[i].qty * sell)
            var tmpDisc = (tmpTotal * disc1) / 100
            var tmpDisc2 = ((tmpTotal - tmpDisc) * disc2) / 100
            var tmpDisc3 = ((tmpTotal - tmpDisc - tmpDisc2) * disc3) / 100

            arrayProd[i].total = tmpTotal - tmpDisc - tmpDisc2 - tmpDisc3 - arrayProd[i].discount
          }
        }

        localStorage.setItem('queue' + payload.queue, JSON.stringify(arrayProd))

        yield put({
          type: 'setAllNull',
        })

      }
    },

    *backPrevious ({ payload }, { call, put }) {
      yield put({ type: 'hideModalShift' })
      yield put(routerRedux.push('/#'))
    },
  },

  reducers: {
    querySuccess (state, action) {
      const { list, pagination, tmpList } = action.payload
      var dataPos = (localStorage.getItem('cashier_trans') === null ? [] : JSON.parse(localStorage.getItem('cashier_trans')))
      var a = dataPos
      var grandTotal = a.reduce( function(cnt,o){ return cnt + o.total; }, 0)

      return { ...state,
        list,
        tmpList,
        pagination: {
          ...state.pagination,
          ...pagination,
        },
        curTotal: grandTotal, }
    },

    queryMechanicSuccess (state, action) {
      const { listMechanic, pagination } = action.payload

      return { ...state,
        listMechanic,
        pagination: {
          ...state.pagination,
          ...pagination,
        }, }
    },

    queryServiceSuccess (state, action) {
      const { listService, pagination } = action.payload
      var dataPos = (localStorage.getItem('cashier_trans') === null ? [] : JSON.parse(localStorage.getItem('cashier_trans')))
      var a = dataPos
      var grandTotal = a.reduce( function(cnt,o){ return cnt + o.total; }, 0)

      return { ...state,
        listService,
        pagination: {
          ...state.pagination,
          ...pagination,
        },
        curTotal: grandTotal, }
    },

    querySuccessByCode (state, action) {
      const { listByCode, curRecord } = action.payload

      var dataPos = (localStorage.getItem('cashier_trans') === null ? [] : JSON.parse(localStorage.getItem('cashier_trans')))
      var a = dataPos
      var grandTotal = a.reduce( function(cnt,o){ return cnt + o.total; }, 0)

      return { ...state,
        listByCode,
        curTotal: grandTotal,
        curRecord: curRecord, }
    },

    queryServiceSuccessByCode (state, action) {
      const { listByCode, curRecord } = action.payload

      var dataPos = (localStorage.getItem('cashier_trans') === null ? [] : JSON.parse(localStorage.getItem('cashier_trans')))
      var a = dataPos
      var grandTotal = a.reduce( function(cnt,o){ return cnt + o.total; }, 0)

      return { ...state,
        listByCode,
        curTotal: grandTotal,
        curRecord: curRecord, }
    },

    queryGetMemberSuccess (state, action) {
      const { memberInformation } = action.payload
      var dataPos = (localStorage.getItem('cashier_trans') === null ? [] : JSON.parse(localStorage.getItem('cashier_trans')))
      var a = dataPos
      var grandTotal = a.reduce( function(cnt,o){ return cnt + o.total; }, 0)

      return { ...state,
        memberInformation,
        memberUnitInfo: { unitNo: '' },
        curTotal: grandTotal, }
    },

    queryGetMembersSuccess (state, action) {
      const { memberInformation, tmpMemberList } = action.payload
      var dataPos = (localStorage.getItem('cashier_trans') === null ? [] : JSON.parse(localStorage.getItem('cashier_trans')))
      var a = dataPos
      var grandTotal = a.reduce( function(cnt,o){ return cnt + o.total; }, 0)

      return { ...state,
        listMember: memberInformation,
        tmpMemberList: tmpMemberList,
        curTotal: grandTotal, }
    },

    queryGetServicesSuccess (state, action) {
      const { serviceInformation, tmpServiceList } = action.payload
      var dataPos = (localStorage.getItem('cashier_trans') === null ? [] : JSON.parse(localStorage.getItem('cashier_trans')))
      var a = dataPos
      var grandTotal = a.reduce( function(cnt,o){ return cnt + o.total; }, 0)

      return { ...state,
        listService: serviceInformation,
        tmpServiceList: tmpServiceList,
        curTotal: grandTotal, }
    },

    queryGetMechanicSuccess (state, action) {
      const { mechanicInformation } = action.payload
      var dataPos = (localStorage.getItem('cashier_trans') === null ? [] : JSON.parse(localStorage.getItem('cashier_trans')))
      var a = dataPos
      var grandTotal = a.reduce( function(cnt,o){ return cnt + o.total; }, 0)

      return { ...state,
        mechanicInformation,
        curTotal: grandTotal, }
    },

    queryGetMechanicsSuccess (state, action) {
      const { mechanicInformation, tmpMechanicList } = action.payload
      var dataPos = (localStorage.getItem('cashier_trans') === null ? [] : JSON.parse(localStorage.getItem('cashier_trans')))
      var a = dataPos
      var grandTotal = a.reduce( function(cnt,o){ return cnt + o.total; }, 0)

      return { ...state,
        listMechanic: mechanicInformation,
        tmpMechanicList: tmpMechanicList,
        curTotal: grandTotal, }
    },

    queryGetProductsSuccess (state, action) {
      const { productInformation, tmpProductList } = action.payload
      var dataPos = (localStorage.getItem('cashier_trans') === null ? [] : JSON.parse(localStorage.getItem('cashier_trans')))
      var a = dataPos
      var grandTotal = a.reduce( function(cnt,o){ return cnt + o.total; }, 0)
      return { ...state,
        listProduct: productInformation,
        tmpProductList: tmpProductList,
        curTotal: grandTotal, }
    },

    chooseMemberUnit (state, action) {
      const { policeNo } = action.payload
      var dataPos = (localStorage.getItem('cashier_trans') === null ? [] : JSON.parse(localStorage.getItem('cashier_trans')))
      var a = dataPos
      var grandTotal = a.reduce( function(cnt,o){ return cnt + o.total; }, 0)
      return { ...state,
        memberUnitInfo: { unitNo: policeNo },
        visiblePopover: false,
        curTotal: grandTotal, }
    },

    getMechanicSuccess (state, action) {
      const { memberInformation } = action.payload

      return { ...state,
        memberInformation: memberInformation, }
    },

    getMechanicSuccess (state, action) {
      const { mechanicInformation } = action.payload

      return { ...state,
        mechanicInformation: mechanicInformation, }
    },

    modalPopoverClose (state) {
      return { ...state, visiblePopover: false }
    },
    modalPopoverShow (state, action) {
      return { ...state, ...action.payload, visiblePopover: true }
    },

    setStatePosLoaded (state, action) {
      if ( !state.dataPosLoaded ) {
        localStorage.setItem('cashier_trans', action.payload.arrayProd)

        var dataPos = (localStorage.getItem('cashier_trans') === null ? [] : JSON.parse(localStorage.getItem('cashier_trans')))
        var a = dataPos
        var grandTotal = a.reduce( function(cnt,o){ return cnt + o.total; }, 0)

        return { ...state,
          dataPosLoaded: true,
          curTotal: grandTotal,
          curRecord: action.payload.curRecord }
      }
      else {
        return { ...state }
      }
    },

    setCashierNo (state, action) {
      const { listCashier, dataCashierTrans } = action.payload

      let DICT_FIXED = (function () {
        let fixed = []
        for (let id in listCashier) {
          if ({}.hasOwnProperty.call(listCashier, id)) {
            fixed.push({
              value: listCashier[id].cashierNo,
              label: listCashier[id].cashierDesc,
            })
          }
        }

        return fixed
      }())

      return { ...state, listCashier: DICT_FIXED, dataCashierTrans: dataCashierTrans, }
    },

    updateState (state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },

    showModal (state, action) {
      return { ...state, ...action.payload, modalVisible: true }
    },

    hideModal (state) {
      return { ...state, modalVisible: false }
    },

    hideModalShift (state) {
      return { ...state, modalShiftVisible: false }
    },

    showMemberModal (state, action) {
      return { ...state, ...action.payload, modalMemberVisible: true }
    },
    hideMemberModal (state) {
      return { ...state, modalMemberVisible: false }
    },

    showMechanicModal (state, action) {
      return { ...state, ...action.payload, modalMechanicVisible: true }
    },
    hideMechanicModal (state) {
      return { ...state, modalMechanicVisible: false }
    },

    showProductModal (state, action) {
      return { ...state, ...action.payload, modalProductVisible: true }
    },
    hideProductModal (state) {
      return { ...state, modalProductVisible: false }
    },


    showServiceModal (state, action) {
      return { ...state, ...action.payload, modalServiceVisible: true }
    },

    hideServiceModal (state) {
      return { ...state, modalServiceVisible: false }
    },

    showHelpModal (state, action) {
      return { ...state, ...action.payload, modalHelpVisible: true }
    },

    hideHelpModal (state) {
      return { ...state, modalHelpVisible: false }
    },

    showShiftModal (state, action) {
      return { ...state, ...action.payload, modalShiftVisible: true }
    },

    hideShiftModal (state, action) {
      return { ...state, curShift: action.payload.curShift, curCashierNo: action.payload.curCashierNo, modalShiftVisible: false }
    },

    showQueueModal (state, action) {
      return { ...state, ...action.payload, modalQueueVisible: true }
    },

    hideQueueModal (state) {
      return { ...state, modalQueueVisible: false }
    },

    setCurBarcode (state, action) {
      return { ...state, curBarcode: action.payload.curBarcode, curQty: action.payload.curQty }
    },

    setAllNull (state) {
      console.log('queue', state);
      return { ...state, curQty: 1, curRecord: 1, curTotal: 0, listByCode: [], memberInformation: [], mechanicInformation: [], curTotalDiscount: 0, curRounding: 0, listQueue: (localStorage.getItem('queue1') === null ? [] : JSON.parse(localStorage.getItem('queue1'))), }
    },


    showModalWarning (state, action) {
      return { ...state, modalWarningVisible: true }
    },

    setUtil (state, action) {
      console.log('setUtil', action.payload);
      return { ...state, kodeUtil: action.payload.kodeUtil, infoUtil: action.payload.infoUtil}
    },

    setEffectedRecord (state, action) {
      console.log('setEffectedRecord', action.payload)
      return { ...state, effectedRecord: action.payload.effectedRecord }
    },

    setCurTotal (state, action) {
      var dataPos = (localStorage.getItem('cashier_trans') === null ? [] : JSON.parse(localStorage.getItem('cashier_trans')))
      var a = dataPos
      var curRecord = a.reduce( function(cnt,o){ return cnt + 1; }, 0)
      var grandTotal = a.reduce( function(cnt,o){ return cnt + o.total; }, 0)
      var totalDiscount = a.reduce( function(cnt,o){ return cnt + parseInt(o.discount); }, 0)
      var totalDisc1 =  a.reduce( function(cnt,o){
                                    var tmpTotal = o.qty * o.price
                                    return cnt + ((tmpTotal * o.disc1) / 100);
                                  }, 0)

      var totalDisc2 =  a.reduce( function(cnt,o){
                                    var tmpTotal = o.qty * o.price
                                    var tmpDisc1 = ((tmpTotal * o.disc1) / 100)
                                    return cnt + (((tmpTotal - tmpDisc1) * o.disc2) / 100);
                                  }, 0)
      var totalDisc3 =  a.reduce( function(cnt,o){
                                    var tmpTotal = o.qty * o.price
                                    var tmpDisc1 = ((tmpTotal * o.disc1) / 100)
                                    var tmpDisc2 = (((tmpTotal - tmpDisc1) * o.disc2) / 100)
                                    return cnt + (((tmpTotal - tmpDisc1 - tmpDisc2) * o.disc3) / 100);
                                  }, 0)

      var ratusan = grandTotal.toString().substr(grandTotal.toString().length - 2, 2)
      //Ganti 100 dengan Jumlah Pembulatan yang diinginkan
      var selisih = 100 - parseInt(ratusan)
      var curRounding

      if ( selisih > 50 ) {
        curRounding = parseInt(ratusan) * -1
      }
      else {
        curRounding = parseInt(selisih)
      }

      return { ...state,
        curTotal: grandTotal,
        curTotalDiscount: (parseInt(totalDiscount) + parseInt(totalDisc1) + parseInt(totalDisc2) + parseInt(totalDisc3)),
        curRounding: curRounding,
        curRecord: curRecord + 1, }
    },

    //untuk filter
    onInputChange (state, action) {
      return { ...state, searchText: action.payload.searchText }
    },

    onMemberSearch (state, action) {
      const { searchText, tmpMemberList } = action.payload;
      const reg = new RegExp(searchText, 'gi');
      var newData
      console.log('tmpMemberList', tmpMemberList)
      newData = tmpMemberList.map((record) => {
        const match = record.memberName.match(reg) || record.memberCode.match(reg) || record.address01.match(reg) || record.mobileNumber.match(reg)
        if (!match) {
          return null;
        }
        return {
          ...record,
        };
      }).filter(record => !!record)

      return { ...state, listMember: newData }
    },
    onMechanicSearch (state, action) {
      const { searchText, tmpMechanicList } = action.payload;
      const reg = new RegExp(searchText, 'gi');
      var newData
      console.log('tmpMechanicList', tmpMechanicList)
      newData = tmpMechanicList.map((record) => {
        const match = record.employeeName.match(reg) || record.employeeId.match(reg) || record.positionName.match(reg) || record.positionId.match(reg)
        if (!match) {
          return null;
        }
        return {
          ...record,
        };
      }).filter(record => !!record)

      return { ...state, listMechanic: newData }
    },
    onProductSearch (state, action) {
      const { searchText, tmpProductList } = action.payload;
      const reg = new RegExp(searchText, 'gi');
      var newData
      console.log('tmpProductList', tmpProductList)
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
    onReset (state, action) {
      const { searchText, tmpList } = action.payload;
      const reg = new RegExp(searchText, 'gi');
      var newData

      newData = tmpList.map((record) => {
        const match = record.memberName.match(reg)
        if (!match) {
          return null;
        }
        return {
          ...record,
        };
      }).filter(record => !!record)

      return { ...state, list: newData, searchText: searchText }
    },

    onServiceSearch (state, action) {
      const { searchText, tmpServiceList } = action.payload;
      const reg = new RegExp(searchText, 'gi');
      var newData
      newData = tmpServiceList.map((record) => {
        const match = record.serviceName.match(reg) || record.serviceCode.match(reg)
        if (!match) {
          return null;
        }
        return {
          ...record,
        };
      }).filter(record => !!record)
      console.log('newData', newData);
      return { ...state, listService: newData }
    },

    onSearch (state, action) {
      const { searchText, tmpList } = action.payload;
      const reg = new RegExp(searchText, 'gi');
      var newData

      newData = tmpList.map((record) => {
        const match = record.productName.match(reg)
        if (!match) {
          return null;
        }
        return {
          ...record,
        };
      }).filter(record => !!record)

      return { ...state, list: newData }
    },

    onMemberReset (state, action) {
      const { searchText, tmpMemberList } = action.payload;
      const reg = new RegExp(searchText, 'gi');
      var newData

      newData = tmpMemberList.map((record) => {
        const match = record.memberName.match(reg)
        if (!match) {
          return null;
        }
        return {
          ...record,
        };
      }).filter(record => !!record)

      return { ...state, listMember: newData, searchText: searchText }
    },

    onMechanicReset (state, action) {
      const { searchText, tmpMechanicList } = action.payload;
      const reg = new RegExp(searchText, 'gi');
      var newData

      newData = tmpMechanicList.map((record) => {
        const match = record.employeeName.match(reg)
        if (!match) {
          return null;
        }
        return {
          ...record,
        };
      }).filter(record => !!record)

      return { ...state, listMechanic: newData, searchText: searchText }
    },

    onServiceReset (state, action) {
      const { searchText, tmpServiceList } = action.payload;
      const reg = new RegExp(searchText, 'gi');
      var newData

      newData = tmpServiceList.map((record) => {
        const match = record.serviceName.match(reg)
        if (!match) {
          return null;
        }
        return {
          ...record,
        };
      }).filter(record => !!record)

      return { ...state, listService: newData, searchText: searchText }
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

    //------------------

    setCurTime (state, action) {
      return { curTime: action.payload.curTime, }
    },

    setCurRecord (state, action) {
      console.log('state', state, 'action', action)
      return { curRecord: 1, }
    },

    changeQueue (state, action) {
      var listQueue = (localStorage.getItem('queue' + action.payload.queue) === null ? [] : JSON.parse(localStorage.getItem('queue' + action.payload.queue)))

      return { ...state, listQueue: listQueue, curQueue: action.payload.queue }
    }
  }
}
