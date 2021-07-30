import pathToRegexp from 'path-to-regexp'
import { parse } from 'qs'
import { Modal, message } from 'antd'
import moment from 'moment'
import { configMain, lstorage, variables } from 'utils'
import { allowPrint } from 'utils/validation'
import {
  TYPE_PEMBELIAN_GRABFOOD,
  TYPE_PEMBELIAN_GRABMART
} from 'utils/variable'
import {
  queryPaymentSplit
} from 'services/payment/payment'
import * as cashierService from '../../services/cashier'
import { queryWOHeader } from '../../services/transaction/workOrder'
import {
  query as queryPos,
  queryList,
  queryDetail,
  queryDetailConsignment,
  queryPos as queryaPos,
  queryById as queryInvoiceById,
  updatePos
} from '../../services/payment'
import {
  query as queryMembers,
  queryCashbackById,
  queryByCode as queryMemberCode,
  querySearchByPlat,
  queryByPhone,
  queryDefault as queryDefaultMember
} from '../../services/master/customer'
import {
  queryMechanics,
  queryMechanicByCode as queryMechanicCode,
  queryDefault as queryDefaultEmployee
} from '../../services/master/employee'
import {
  query as queryProductStock,
  queryPOSproduct,
  queryPOSstock as queryProductsInStock,
  queryByBarcode
  // queryByBarcodeBundleOffline,
  // queryByBarcodeOffline,
  // getListIndex
} from '../../services/master/productstock'
import {
  query as queryConsignment
} from '../../services/master/consignment'
import { query as queryService } from '../../services/master/service'
import { query as queryUnit, getServiceReminder, getServiceUsageReminder } from '../../services/units'
import { queryCurrentOpenCashRegister, queryCashierTransSource, cashRegister } from '../../services/setting/cashier'

const { prefix } = configMain
const { insertCashierTrans, insertConsignment, reArrangeMember } = variables

const { getCashierTrans, getConsignment } = lstorage

const { updateCashierTrans } = cashierService

export default {

  namespace: 'pos',

  state: {
    list: [],
    tmpList: [],
    listCashier: [],
    listPayment: [],
    listPaymentDetail: [],
    listProductData: [],
    listMember: [],
    listAsset: [],
    listUnit: [],
    listMechanic: [],
    listProduct: [],
    listConsignment: [],
    listSequence: {},
    listUnitUsage: [],
    posData: [],
    listByCode: [],
    listWOHeader: [],
    listQueue: localStorage.getItem('queue1') === null ? [] : JSON.parse(localStorage.getItem('queue1')),
    memberPrint: [],
    mechanicPrint: [],
    companyPrint: [],
    curQueue: 1,
    currentItem: {},
    typePembelian: localStorage.getItem('typePembelian') ? Number(localStorage.getItem('typePembelian')) : 1,
    dineInTax: localStorage.getItem('dineInTax') ? Number(localStorage.getItem('dineInTax')) : 0,
    modalAssetVisible: false,
    modalMemberVisible: false,
    modalPaymentVisible: false,
    modalServiceListVisible: false,
    modalConsignmentListVisible: false,
    modalConfirmVisible: false,
    modalLoginVisible: false,
    modalLoginType: null, // payment, service, consignment
    modalHelpVisible: false,
    modalWarningVisible: false,
    modalMechanicVisible: false,
    modalProductVisible: false,
    modalConsignmentVisible: false,
    modalServiceVisible: false,
    modalQueueVisible: false,
    modalVoidSuspendVisible: false,
    modalVisible: false,
    modalPrintVisible: false,
    modalCancelVisible: false,
    modalCashbackVisible: false,
    itemPayment: {},
    itemService: {},
    itemConsignment: {},
    visiblePopover: false,
    modalType: 'add',
    totalItem: 0,
    lastMeter: localStorage.getItem('lastMeter') ? localStorage.getItem('lastMeter') : 0,
    selectedRowKeys: [],
    cashierInformation: {},
    cashierBalance: {},
    pagination: {
      current: 1,
      pageSize: 10,
      total: 0,
      showSizeChanger: true
    },
    listPosDetail: [],
    paginationDashboard: {
      current: 1,
      pageSize: 10,
      total: 0
    },
    curBarcode: '',
    curTotal: 0,
    curTotalDiscount: 0,
    kodeUtil: 'barcode',
    infoUtil: 'Product',
    dataPosLoaded: false,
    memberInformation: localStorage.getItem('member') ? JSON.parse(localStorage.getItem('member'))[0] : {},
    tmpMemberList: [],
    tmpMemberUnit: [],
    tmpMechanicList: [],
    tmpProductList: [],
    mechanicInformation: localStorage.getItem('mechanic') ? JSON.parse(localStorage.getItem('mechanic'))[0] : {},
    memberUnitInfo: {},
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
    invoiceCancel: '',
    dataCashierTrans: {},
    listServiceReminder: [],
    showAlert: false,
    showListReminder: false,
    paymentListActiveKey: '5',
    modalAddUnit: false,
    modalAddMember: false,
    currentCashier: {}
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        const match = pathToRegexp('/transaction/pos/invoice/:id').exec(location.pathname)
        const userId = lstorage.getStorageKey('udi')[1]
        if (location.pathname === '/dashboard' || location.pathname === '/') {
          dispatch({
            type: 'queryDashboard',
            payload: {
              page: 1,
              pageSize: 10,
              storeId: lstorage.getCurrentUserStore()
            }
          })
        }
        if (location.pathname === '/transaction/pos') {
          dispatch({ type: 'app/foldSider' })
          dispatch({
            type: 'setDefaultMember'
          })
          dispatch({
            type: 'setDefaultEmployee'
          })
          dispatch({
            type: 'setPaymentShortcut'
          })
        }
        if (location.pathname === '/transaction/pos' || location.pathname === '/transaction/pos/payment' || location.pathname === '/cash-entry' || location.pathname === '/journal-entry') {
          let memberUnitInfo = localStorage.getItem('memberUnit') ? JSON.parse(localStorage.getItem('memberUnit')) : { id: null, policeNo: null, merk: null, model: null }
          if (location.pathname !== '/transaction/pos/payment') {
            dispatch({
              type: 'showShiftModal',
              payload: memberUnitInfo
            })
            dispatch({
              type: 'getServiceReminder'
            })
          }
          dispatch({
            type: 'loadDataPos',
            payload: {
              cashierId: userId,
              status: 'O'
            }
          })
        } else if (match) {
          dispatch({
            type: 'queryPosById',
            payload: {
              id: match[1],
              type: 'print'
            }
          })
        } else if (location.pathname === '/transaction/pos/history') {
          dispatch({
            type: 'queryHistory',
            payload: {
              startPeriod: moment().startOf('month').format('YYYY-MM-DD'),
              endPeriod: moment().endOf('month').format('YYYY-MM-DD')
            }
          })
          dispatch({
            type: 'loadDataPos',
            payload: {
              cashierId: userId,
              status: 'O'
            }
          })
        } else if (location.pathname === '/monitor/service/history') {
          dispatch({
            type: 'getServiceReminder'
          })
          dispatch({
            type: 'updateState',
            payload: {
              listUnitUsage: []
            }
          })
        }
      })

      history.listen(() => {
        const match = pathToRegexp('/accounts/payment/:id').exec(location.pathname)
        const userId = lstorage.getStorageKey('udi')[1]
        if (match) {
          dispatch({
            type: 'loadDataPos',
            payload: {
              cashierId: userId,
              status: 'O'
            }
          })
        }
      })
    }
  },

  effects: {
    * queryDashboard ({ payload = {} }, { call, put }) {
      const data = yield call(queryList, {
        ...payload,
        order: '-id',
        status: 'A'
      })
      if (data) {
        yield put({
          type: 'queryDashboardSuccess',
          payload: {
            listPosDetail: data.data,
            pagination: {
              current: Number(payload.page) || 1,
              pageSize: Number(payload.pageSize) || 10,
              total: data.total
            }
          }
        })
      }
    },

    * paymentEdit ({ payload }, { put }) {
      let dataPos = getCashierTrans()
      dataPos[payload.no - 1] = payload
      localStorage.setItem('cashier_trans', JSON.stringify(dataPos))
      yield put({ type: 'hidePaymentModal' })
      yield put({ type: 'setCurTotal' })
    },

    * serviceEdit ({ payload }, { put }) {
      let dataPos = localStorage.getItem('service_detail') ? JSON.parse(localStorage.getItem('service_detail')) : []
      dataPos[payload.no - 1] = payload
      localStorage.setItem('service_detail', JSON.stringify(dataPos))
      yield put({ type: 'hideServiceModal' })
      yield put({ type: 'setCurTotal' })
    },

    * consignmentEdit ({ payload }, { put }) {
      let dataPos = localStorage.getItem('consignment') ? JSON.parse(localStorage.getItem('consignment')) : []
      if (payload && payload.qty > payload.stock) {
        Modal.confirm({
          title: 'Out of Stock',
          content: 'Out of Stock'
        })
        return
      }
      dataPos[payload.no - 1] = payload
      localStorage.setItem('consignment', JSON.stringify(dataPos))
      yield put({ type: 'hideConsignmentModal' })
      yield put({ type: 'setCurTotal' })
    },

    * changeDineIn ({ payload }, { put }) {
      const { typePembelian } = payload
      let dataPos = localStorage.getItem('consignment') ? JSON.parse(localStorage.getItem('consignment')) : []
      let typePrice = 'originalSellPrice'
      if (typePembelian === TYPE_PEMBELIAN_GRABFOOD) {
        typePrice = 'otherSellPrice'
      }
      if (typePembelian === TYPE_PEMBELIAN_GRABMART) {
        typePrice = 'martSellPrice'
      }
      if (dataPos && dataPos.length) {
        for (let key in dataPos) {
          const item = dataPos[key]
          dataPos[key].sellPrice = item[typePrice] == null ? item.price : item[typePrice]
          dataPos[key].total = dataPos[key].sellPrice * item.qty
        }
      }
      localStorage.setItem('consignment', JSON.stringify(dataPos))
      yield put({ type: 'hideConsignmentModal' })
      yield put({ type: 'setCurTotal' })
    },

    * paymentDelete ({ payload }, { put }) {
      console.log('payload', payload)
      let dataPos = getCashierTrans()
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
          bundleId: ary[n].bundleId,
          bundleCode: ary[n].bundleCode,
          bundleName: ary[n].bundleName,
          employeeId: ary[n].employeeId,
          employeeName: ary[n].employeeName,
          disc1: ary[n].disc1,
          disc2: ary[n].disc2,
          disc3: ary[n].disc3,
          discount: ary[n].discount,
          name: ary[n].name,
          price: ary[n].price,
          sellPrice: ary[n].sellPrice,
          qty: ary[n].qty,
          typeCode: ary[n].typeCode,
          total: ary[n].total
        })
      }
      console.log('arrayProd', arrayProd)
      if (arrayProd.length === 0) {
        localStorage.removeItem('cashier_trans')
        yield put({
          type: 'setCurTotal'
        })
        yield put({
          type: 'hidePaymentModal'
        })
      } else {
        localStorage.setItem('cashier_trans', JSON.stringify(arrayProd))
        yield put({
          type: 'setCurTotal'
        })
        yield put({
          type: 'hidePaymentModal'
        })
      }
    },

    * serviceDelete ({ payload }, { put }) {
      let dataPos = localStorage.getItem('service_detail') ? JSON.parse(localStorage.getItem('service_detail')) : []
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
          bundleId: ary[n].bundleId,
          bundleCode: ary[n].bundleCode,
          bundleName: ary[n].bundleName,
          employeeId: ary[n].employeeId,
          employeeName: ary[n].employeeName,
          disc1: ary[n].disc1,
          disc2: ary[n].disc2,
          disc3: ary[n].disc3,
          discount: ary[n].discount,
          name: ary[n].name,
          price: ary[n].price,
          qty: ary[n].qty,
          typeCode: ary[n].typeCode,
          total: ary[n].total
        })
      }
      if (arrayProd.length === 0) {
        localStorage.removeItem('service_detail')
        yield put({
          type: 'setCurTotal'
        })
        yield put({
          type: 'hideServiceListModal'
        })
      } else {
        localStorage.setItem('service_detail', JSON.stringify(arrayProd))
        yield put({
          type: 'setCurTotal'
        })
        yield put({
          type: 'hideServiceListModal'
        })
      }
    },

    * consignmentDelete ({ payload }, { put }) {
      let dataPos = localStorage.getItem('consignment') ? JSON.parse(localStorage.getItem('consignment')) : []
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
          stock: ary[n].stock,
          disc1: ary[n].disc1,
          disc2: ary[n].disc2,
          disc3: ary[n].disc3,
          discount: ary[n].discount,
          name: ary[n].name,
          sellPrice: ary[n].sellPrice,
          price: ary[n].price,
          otherSellPrice: ary[n].otherSellPrice,
          martSellPrice: ary[n].martSellPrice,
          originalSellPrice: ary[n].originalSellPrice,
          qty: ary[n].qty,
          total: ary[n].total
        })
      }
      if (arrayProd.length === 0) {
        localStorage.removeItem('consignment')
        yield put({
          type: 'setCurTotal'
        })
        yield put({
          type: 'hideConsignmentListModal'
        })
      } else {
        localStorage.setItem('consignment', JSON.stringify(arrayProd))
        yield put({
          type: 'setCurTotal'
        })
        yield put({
          type: 'hideConsignmentListModal'
        })
      }
    },

    * queryHistory ({ payload = {} }, { call, put }) {
      const data = yield call(queryPos, payload)
      if (data.success) {
        yield put({
          type: 'querySuccessPayment',
          payload: {
            listPayment: data.data,
            tmpListPayment: data.data,
            pagination: {
              current: Number(payload.page) || 1,
              pageSize: Number(payload.pageSize) || 5,
              // pageSizeOptions: ['5','10','20','50'],
              total: data.total
            }
          }
        })
      } else {
        throw data
      }
    },

    * setDefaultMember ({ payload }, { call, put }) {
      const memberInformation = localStorage.getItem('member') ? JSON.parse(localStorage.getItem('member'))[0] : {}
      if (memberInformation && memberInformation.memberName) return
      const response = yield call(queryDefaultMember, payload)
      if (response && response.success && response.data && response.data.id) {
        yield put({
          type: 'pos/chooseMember',
          payload: {
            item: response.data,
            defaultValue: true
          }
        })
      }
    },

    * setPaymentShortcut (payload, { put }) {
      const listPaymentShortcut = lstorage.getPaymentShortcut()
      console.log('listPaymentShortcut', listPaymentShortcut)
      yield put({
        type: 'updateState',
        payload: {
          listPaymentShortcut
        }
      })
    },

    * setDefaultEmployee ({ payload }, { call, put }) {
      const mechanicInformation = localStorage.getItem('mechanic') ? JSON.parse(localStorage.getItem('mechanic'))[0] : {}
      if (mechanicInformation && mechanicInformation.employeeId) return
      const response = yield call(queryDefaultEmployee, payload)
      if (response && response.success && response.data && response.data.employeeId) {
        yield put({
          type: 'pos/chooseEmployee',
          payload: {
            item: response.data
          }
        })
      }
    },
    * cancelInvoice ({ payload }, { call, put }) {
      payload.status = 'C'
      payload.storeId = lstorage.getCurrentUserStore()
      const cancel = yield call(updatePos, payload)
      if (cancel.success) {
        const infoStore = localStorage.getItem(`${prefix}store`) ? JSON.parse(localStorage.getItem(`${prefix}store`)) : null
        yield put({
          type: 'queryHistory',
          payload: {
            startPeriod: infoStore.startPeriod,
            endPeriod: infoStore.endPeriod
          }
        })
        Modal.info({
          title: 'Info',
          content: `Invoice No ${payload.transNo} Has Been Cancel...!`
        })
        yield put({
          type: 'hidePrintModal'
        })
      } else {
        throw cancel
      }
    },

    * queryPosById ({ payload = {} }, { call, put }) {
      const { type, ...other } = payload
      const response = yield call(queryInvoiceById, other)
      if (response && response.success) {
        yield put({
          type: 'queryPosDetail',
          payload: {
            id: response.pos.transNo,
            data: response.pos,
            type
          }
        })
        yield put({
          type: 'pos/setListPaymentDetail',
          payload: response.pos
        })
      } else {
        throw response
      }
    },

    * queryPosDetail ({ payload }, { call, put }) {
      const { type } = payload
      const data = yield call(queryDetail, payload)
      const consignment = yield call(queryDetailConsignment, payload)
      const PosData = yield call(queryaPos, payload)
      const member = payload.data.memberCode ? yield call(queryMemberCode, { memberCode: payload.data.memberCode }) : {}
      const company = localStorage.getItem(`${prefix}store`) ? JSON.parse(localStorage.getItem(`${prefix}store`)) : {}
      const mechanic = payload.data.technicianId ? yield call(queryMechanicCode, payload.data.technicianId) : {}
      let dataPayment = []
      let dataPaymentInvoice = []
      if (data && PosData && PosData.success) {
        const payment = yield call(queryPaymentSplit, {
          id: PosData.pos.transNo,
          transNo: PosData.pos.transNo,
          storeId: lstorage.getCurrentUserStore()
        })
        if (payment && payment.data) {
          for (let n = 0; n < payment.data.length; n += 1) {
            dataPayment.push({
              no: n + 1,
              id: payment.data[n].id,
              cashierTransId: payment.data[n].cashierTransId,
              active: payment.data[n].active,
              storeId: payment.data[n].storeId,
              transDate: payment.data[n].transDate,
              transTime: payment.data[n].transTime,
              typeCode: payment.data[n].typeCode,
              cardNo: payment.data[n].cardNo,
              cardName: payment.data[n].cardName,
              chargeNominal: payment.data[n].chargeNominal,
              chargePercent: payment.data[n].chargePercent,
              chargeTotal: payment.data[n].chargeTotal,
              description: payment.data[n].description,
              paid: payment.data[n].paid || 0
            })
          }
        }
        if (payment && payment.invoice) {
          for (let n = 0; n < payment.invoice.length; n += 1) {
            dataPaymentInvoice.push({
              no: n + 1,
              id: payment.invoice[n].id,
              cashierTransId: payment.invoice[n].cashierTransId,
              active: payment.invoice[n].active,
              storeId: payment.invoice[n].storeId,
              transDate: payment.invoice[n].transDate,
              transTime: payment.invoice[n].transTime,
              typeCode: payment.invoice[n].typeCode,
              cardNo: payment.invoice[n].cardNo,
              cardName: payment.invoice[n].cardName,
              chargeNominal: payment.invoice[n].chargeNominal,
              chargePercent: payment.invoice[n].chargePercent,
              chargeTotal: payment.invoice[n].chargeTotal,
              description: payment.invoice[n].description,
              paid: payment.invoice[n].paid || 0
            })
          }
        }
        let dataConsignment = []
        if (consignment
          && consignment.success
          && consignment.pos
          && consignment.pos.length > 0) {
          dataConsignment = consignment.pos.map(item => ({
            code: item.productCode,
            name: '',
            qty: item.qty,
            price: item.sellingPrice,
            discount: item.discount,
            disc1: 0,
            disc2: 0,
            disc3: 0,
            total: item.total
          }))
        }
        yield put({
          type: 'paymentDetail/updateState',
          payload: {
            listAmount: dataPayment,
            listAmountInvoice: dataPaymentInvoice
          }
        })
        yield put({
          type: 'querySuccessPaymentDetail',
          payload: {
            posData: PosData.pos,
            listPaymentDetail: {
              dataConsignment,
              id: payload.data.transNo,
              cashierId: payload.data.cashierId,
              cashierName: PosData.pos.cashierName,
              policeNo: payload.data.policeNo,
              lastMeter: payload.data.lastMeter,
              data: data.pos,
              bundling: data.bundling,
              merk: PosData.pos.merk,
              model: PosData.pos.model,
              type: PosData.pos.type,
              year: PosData.pos.year,
              chassisNo: PosData.pos.chassisNo,
              defaultMember: PosData.pos.defaultMember,
              machineNo: PosData.pos.machineNo,
              discountLoyalty: PosData.pos.discountLoyalty, // discountLoyalty, lastCashback, gettingCashback
              lastCashback: PosData.pos.lastCashback,
              gettingCashback: PosData.pos.gettingCashback
            },
            memberPrint: (member.data || ''), // data member
            companyPrint: (company.data || ''), // data company
            mechanicPrint: (mechanic.mechanic || '') // data mechanic
          }
        })
        let dataPos = []
        let dataService = []
        for (let n = 0; n < data.pos.length; n += 1) {
          if (data.pos[n].serviceCode === null || data.pos[n].serviceName === null) {
            let productId = data.pos[n].productCode
            let productName = data.pos[n].productName
            dataPos.push({
              code: productId,
              name: productName,
              qty: data.pos[n].qty,
              price: data.pos[n].sellingPrice,
              discount: data.pos[n].discount,
              disc1: data.pos[n].disc1,
              disc2: data.pos[n].disc2,
              disc3: data.pos[n].disc3,
              total: (data.pos[n].qty * data.pos[n].sellingPrice) - (data.pos[n].discount * data.pos[n].qty) -
                ((data.pos[n].qty * data.pos[n].sellingPrice) * (data.pos[n].disc1 / 100)) - (((data.pos[n].qty * data.pos[n].sellingPrice) * (data.pos[n].disc1 / 100)) * (data.pos[n].disc2 / 100)) -
                ((((data.pos[n].qty * data.pos[n].sellingPrice) * (data.pos[n].disc1 / 100)) * (data.pos[n].disc2 / 100)) * (data.pos[n].disc3 / 100))
            })
          } else if (data.pos[n].productCode === null || data.pos[n].productName === null) {
            let productId = data.pos[n].serviceCode
            let productName = data.pos[n].serviceName
            dataService.push({
              code: productId,
              name: productName,
              qty: data.pos[n].qty,
              price: data.pos[n].sellingPrice,
              discount: data.pos[n].discount,
              disc1: data.pos[n].disc1,
              disc2: data.pos[n].disc2,
              disc3: data.pos[n].disc3,
              total: (data.pos[n].qty * data.pos[n].sellingPrice) - (data.pos[n].discount * data.pos[n].qty) -
                ((data.pos[n].qty * data.pos[n].sellingPrice) * (data.pos[n].disc1 / 100)) - (((data.pos[n].qty * data.pos[n].sellingPrice) * (data.pos[n].disc1 / 100)) * (data.pos[n].disc2 / 100)) -
                ((((data.pos[n].qty * data.pos[n].sellingPrice) * (data.pos[n].disc1 / 100)) * (data.pos[n].disc2 / 100)) * (data.pos[n].disc3 / 100))
            })
          }
        }
        const isAllow = allowPrint(PosData.pos.printNo, PosData.pos.printLimit)
        if (type === 'print' && isAllow) {
          // window.print()
          // window.onafterprint = () => { window.close() }
        }
        if (!isAllow) {
          window.close()
        }
      }
    },

    * queryService ({ payload }, { call, put }) {
      payload = parse(location.search.substr(1))
      let { pageSize, page, ...other } = payload
      const data = yield call(queryService, payload)
      let newData = data.services
      if (data.success) {
        // filter
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

        // yield put({ type: 'hideModal' })
        yield put({
          type: 'queryServiceSuccess',
          payload: {
            list: services,
            pagination: {
              current: Number(payload.page) || 1,
              pageSize: Number(payload.pageSize) || 10,
              total: totalData
            }
          }
        })
      }
    },

    * loadDataPos ({ payload = {} }, { call, put }) {
      const currentRegister = yield call(queryCurrentOpenCashRegister, payload)
      if (currentRegister.success) {
        const cashierInformation = (Array.isArray(currentRegister.data)) ? currentRegister.data[0] : currentRegister.data
        if (cashierInformation) {
          const cashierBalance = yield call(queryCashierTransSource, cashierInformation)
          if (cashierBalance.success) {
            yield put({
              type: 'updateState',
              payload: {
                cashierInformation,
                dataCashierTrans: cashierInformation,
                cashierBalance: cashierBalance.data.total[0] ? cashierBalance.data.total[0] : {}
              }
            })
          } else {
            throw cashierBalance
          }
        } else {
          yield put({
            type: 'updateState',
            payload: {
              cashierInformation,
              dataCashierTrans: cashierInformation
            }
          })
        }
      } else {
        throw currentRegister
      }
    },

    * getMember ({ payload }, { call, put }) {
      const data = yield call(queryMemberCode, payload)
      let newData = payload ? data.data : data.member
      if (data.data === null) {
        Modal.warning({
          title: 'Warning',
          content: 'Member Not Found...!'
        })
        yield put({ type: 'setUtil', payload: { kodeUtil: 'member', infoUtil: 'Member' } })
      } else {
        yield put({
          type: 'queryGetMemberSuccess',
          payload: {
            memberInformation: newData
          }
        })
        // throw data
      }
    },

    * getMemberAssets ({ payload }, { call, put }) {
      const data = yield call(querySearchByPlat, payload)
      if (data.success && data.data.length) {
        yield put({
          type: 'updateState',
          payload: {
            listAsset: data.data
          }
        })
        yield put({
          type: 'queryGetMembersSuccess',
          payload: {
            pagination: {
              total: Number(data.total) || 0,
              current: Number(data.page) || 0,
              pageSize: Number(data.pageSize) || 0
            }
          }
        })
      } else {
        const modal = Modal.warning({
          title: 'Warning',
          content: 'Member Not Found...!'
        })
        setTimeout(() => modal.destroy(), 1000)
      }
    },

    * getMembers ({ payload }, { call, put }) {
      const data = yield call(queryMembers, payload)
      let newData = data.data
      if (data.success) {
        yield put({
          type: 'queryGetMembersSuccess',
          payload: {
            memberInformation: newData,
            tmpMemberList: newData,
            pagination: {
              total: Number(data.total) || 0,
              current: Number(data.page) || 0,
              pageSize: Number(data.pageSize) || 0
            }
          }
        })
      } else {
        const modal = Modal.warning({
          title: 'Warning',
          content: 'Member Not Found...!'
        })
        setTimeout(() => modal.destroy(), 1000)
        // throw data
      }
    },

    * getUnit ({ payload }, { call, put }) {
      const data = yield call(queryUnit, payload)
      let newData = data.data
      if (data.success) {
        yield put({
          type: 'queryGetUnitSuccess',
          payload: {
            listUnit: newData,
            tmpMemberUnit: newData
          }
        })
      } else {
        Modal.warning({
          title: 'Warning',
          content: 'Member Unit Not Found...!'
        })
        // throw data
      }
    },

    * getServices ({ payload = {} }, { select, call, put }) {
      const currentReward = yield select(({ pospromo }) => (pospromo ? pospromo.currentReward : {}))
      if (currentReward && currentReward.categoryCode) {
        payload.serviceTypeId = currentReward.categoryCode
      }
      const data = yield call(queryService, payload)
      if (data.data !== null) {
        yield put({
          type: 'queryGetServicesSuccess',
          payload: {
            serviceInformation: data.data,
            tmpServiceList: data.data
          }
        })
        yield put({
          type: 'updateState',
          payload: {
            pagination: {
              total: data.total,
              page: Number(data.page) || 1,
              pageSize: Number(data.pageSize) || 10
            }
          }
        })
      } else {
        const modal = Modal.warning({
          title: 'Warning',
          content: 'Service Not Found...!'
        })
        setTimeout(() => modal.destroy(), 1000)
        // throw data
      }
    },

    * getMechanic ({ payload }, { call, put }) {
      const data = yield call(queryMechanicCode, payload)
      let newData = payload ? data.mechanic : data.data
      if (data.mechanic !== null) {
        yield put({
          type: 'queryGetMechanicSuccess',
          payload: {
            mechanicInformation: newData
          }
        })
      } else {
        Modal.warning({
          title: 'Warning',
          content: 'Employee Information Not Found...!'
        })
        yield put({ type: 'setUtil', payload: { kodeUtil: 'employee', infoUtil: 'Employee' } })
        // throw data
      }
    },

    * getMechanics ({ payload }, { call, put }) {
      const data = yield call(queryMechanics, payload)
      let newData = payload ? data.mechanic : data.data
      if (data.success) {
        yield put({
          type: 'queryGetMechanicsSuccess',
          payload: {
            mechanicInformation: newData,
            tmpMechanicList: newData
          }
        })
        yield put({
          type: 'updateState',
          payload: {
            pagination: {
              total: newData.length,
              page: 1,
              pageSize: 10
            }
          }
        })
      } else {
        const modal = Modal.warning({
          title: 'Warning',
          content: 'Employee Not Found...!'
        })
        setTimeout(() => modal.destroy(), 1000)
        // throw data
      }
    },
    * showProductQty ({ payload }, { call, put }) {
      let { data } = payload
      const storeInfo = localStorage.getItem(`${prefix}store`) ? JSON.parse(localStorage.getItem(`${prefix}store`)) : {}
      const newData = data.map(x => x.id)

      const listProductData = yield call(queryPOSproduct, { from: storeInfo.startPeriod, to: moment().format('YYYY-MM-DD'), product: (newData || []).toString() })
      if (listProductData.success) {
        for (let n = 0; n < (listProductData.data || []).length; n += 1) {
          data = data.map((x) => {
            if (x.id === listProductData.data[n].id) {
              const { count, ...other } = x
              return {
                ...other,
                ...listProductData.data[n]
              }
            }
            return x
          })
        }

        yield put({
          type: 'queryGetProductsSuccess',
          payload: {
            productInformation: data,
            tmpProductList: data
          }
        })
        console.log('data', data)
        yield put({
          type: 'updateState',
          payload: {
            listProductData: data
          }
        })
      } else {
        throw listProductData
      }
    },
    * showProductQtyByProductId ({ payload }, { call, put }) {
      let { data } = payload
      const storeInfo = localStorage.getItem(`${prefix}store`) ? JSON.parse(localStorage.getItem(`${prefix}store`)) : {}
      const newData = data.map(x => x.productId)

      const listProductData = yield call(queryPOSproduct, { from: storeInfo.startPeriod, to: moment().format('YYYY-MM-DD'), product: (newData || []).toString() })
      if (listProductData.success) {
        for (let n = 0; n < (listProductData.data || []).length; n += 1) {
          data = data.map((x) => {
            if (x.id === listProductData.data[n].id) {
              const { count, ...other } = x
              return {
                ...other,
                ...listProductData.data[n]
              }
            }
            return x
          })
        }

        yield put({
          type: 'queryGetProductsSuccess',
          payload: {
            productInformation: data,
            tmpProductList: data
          }
        })
      } else {
        throw listProductData
      }
    },
    * checkQuantityEditProduct ({ payload }, { call, put }) {
      const { data } = payload
      function getQueueQuantity () {
        const queue = localStorage.getItem('queue') ? JSON.parse(localStorage.getItem('queue') || '[]') : {}
        // const listQueue = _.get(queue, `queue${curQueue}`) ? _.get(queue, `queue${curQueue}`) : []
        let tempQueue = []
        let tempTrans = []
        for (let n = 0; n < 10; n += 1) {
          tempQueue = _.get(queue, `queue${n}`) ? _.get(queue, `queue${n}`) : []
          if (tempQueue.length > 0) {
            tempTrans = tempTrans.concat(tempQueue[0].cashier_trans)
          }
        }
        if (tempTrans.length > 0) {
          return tempTrans
        }
        return []
      }

      let tempQueue = getQueueQuantity()
      let Cashier = []
      Cashier.push(data)
      const Queue = tempQueue.filter(el => el.productId === data.productId)
      const totalCashier = Cashier.reduce((cnt, o) => cnt + parseFloat(o.qty), 0)
      const totalQueue = Queue.reduce((cnt, o) => cnt + parseFloat(o.qty), 0)
      const Quantity = Cashier.concat(Queue)
      const totalQty = Quantity.reduce((cnt, o) => cnt + parseFloat(o.qty), 0)
      // Call Products
      const storeInfo = localStorage.getItem(`${prefix}store`) ? JSON.parse(localStorage.getItem(`${prefix}store`)) : {}
      const listProductData = yield call(queryPOSproduct, { from: storeInfo.startPeriod, to: moment().format('YYYY-MM-DD'), product: data.productId })
      const listProduct = listProductData.data
      let tempListProduct = []
      function getSetting (setting) {
        let json = setting.Inventory
        let jsondata = JSON.stringify(eval(`(${json})`))
        const outOfStock = JSON.parse(jsondata).posOrder.outOfStock
        return outOfStock
      }
      function checkPrice (input, temp) {
        const price = ((input.price * input.qty) * (1 - (input.disc1 / 100)) * (1 - (input.disc2 / 100)) * (1 - (input.disc3 / 100))) - input.discount
        const cost = temp[0].amount * input.qty
        console.log('price', price)
        console.log('cost', cost)
        if (parseFloat(parseFloat(price).toFixed(2)) >= parseFloat(parseFloat(cost).toFixed(2))) {
          return false
        }
        if (temp[0].exception01) {
          return false
        }
        return true
      }
      if (listProductData.data.length > 0) {
        tempListProduct = listProduct.filter(el => el.productId === data.productId)
        const totalTempListProduct = tempListProduct.reduce((cnt, o) => cnt + o.count, 0)
        let outOfStock = getSetting(payload.setting)
        // if (data.price < (tempListProduct[0].amount === 0 ? tempListProduct[0].costPrice : tempListProduct[0].amount)) {
        if (checkPrice(data, tempListProduct)) {
          Modal.warning({
            title: 'Price is under the cost'
          })
        } else if (totalQty > totalTempListProduct && outOfStock === 0) {
          Modal.warning({
            title: 'No available stock',
            content: `Your input: ${totalCashier} Queue : ${totalQueue} Available: ${totalTempListProduct}`
          })
        } else if (totalQty > totalTempListProduct && outOfStock === 1) {
          Modal.warning({
            title: 'Waning Out of stock option',
            content: `Your input: ${totalCashier} Queue : ${totalQueue} Available: ${totalTempListProduct}`
          })
          yield put({
            type: 'paymentEdit',
            payload: data
          })
        } else {
          yield put({
            type: 'paymentEdit',
            payload: data
          })
          message.success('Success add product')
          yield put({ type: 'pos/hideProductModal' })
        }
      } else {
        Modal.warning({
          title: 'Out of stock',
          content: 'Out Of Stock'
        })
      }
    },

    * checkQuantityNewProduct ({ payload }, { call, put }) {
      const { data } = payload
      function getQueueQuantity () {
        const queue = localStorage.getItem('queue') ? JSON.parse(localStorage.getItem('queue') || '[]') : {}
        // const listQueue = _.get(queue, `queue${curQueue}`) ? _.get(queue, `queue${curQueue}`) : []
        let tempQueue = []
        let tempTrans = []
        for (let n = 0; n < 10; n += 1) {
          tempQueue = _.get(queue, `queue${n}`) ? _.get(queue, `queue${n}`) : []
          if (tempQueue.length > 0) {
            tempTrans = tempTrans.concat(tempQueue[0].cashier_trans)
          }
        }
        if (tempTrans.length > 0) {
          return tempTrans
        }
        console.log('queue')
        return []
      }

      let tempQueue = getQueueQuantity()
      let Cashier = []
      Cashier.push(data)
      const Queue = tempQueue.filter(el => el.productId === data.productId)
      const totalCashier = Cashier.reduce((cnt, o) => cnt + parseFloat(o.qty), 0)
      const totalQueue = Queue.reduce((cnt, o) => cnt + parseFloat(o.qty), 0)
      const Quantity = Cashier.concat(Queue)
      const totalQty = Quantity.reduce((cnt, o) => cnt + parseFloat(o.qty), 0)
      // Call Products
      const storeInfo = localStorage.getItem(`${prefix}store`) ? JSON.parse(localStorage.getItem(`${prefix}store`)) : {}
      const listProductData = yield call(queryPOSproduct, { from: storeInfo.startPeriod, to: moment().format('YYYY-MM-DD'), product: data.productId })
      const listProduct = listProductData.data
      let tempListProduct = []
      function getSetting (setting) {
        let json = setting.Inventory
        console.log('json', json)

        let jsondata = JSON.stringify(eval(`(${json})`))
        const outOfStock = JSON.parse(jsondata).posOrder.outOfStock
        return outOfStock
      }
      function checkPrice (input, temp) {
        const price = ((input.price * input.qty) * (1 - (input.disc1 / 100)) * (1 - (input.disc2 / 100)) * (1 - (input.disc3 / 100))) - input.discount
        const cost = temp[0].amount * input.qty
        console.log('price', price)
        console.log('cost', cost)
        if (parseFloat(parseFloat(price).toFixed(2)) >= parseFloat(parseFloat(cost).toFixed(2))) {
          return false
        }
        if (temp[0].exception01) {
          return false
        }
        return true
      }
      const outOfStock = getSetting(payload.setting)
      if (listProductData.data.length > 0) {
        tempListProduct = listProduct.filter(el => el.productId === data.productId)
        const totalTempListProduct = tempListProduct.reduce((cnt, o) => cnt + o.count, 0)
        // if (data.price < (tempListProduct[0].amount === 0 ? tempListProduct[0].costPrice : tempListProduct[0].amount)) {
        if (checkPrice(data, tempListProduct)) {
          Modal.warning({
            title: 'Price is under the cost'
          })
        } else if (totalQty > totalTempListProduct && outOfStock === 0) {
          Modal.warning({
            title: 'No available stock',
            content: `Your input: ${totalCashier} Queue : ${totalQueue} Available: ${totalTempListProduct}`
          })
        } else if (totalQty > totalTempListProduct && outOfStock === 1) {
          Modal.warning({
            title: 'Waning Out of stock option',
            content: `Your input: ${totalCashier} Queue : ${totalQueue} Available: ${totalTempListProduct}`
          })
          insertCashierTrans(data)
          yield put({
            type: 'pos/setUtil',
            payload: { kodeUtil: 'barcode', infoUtil: 'Product' }
          })
          yield put({ type: 'pos/hideProductModal' })
        } else {
          insertCashierTrans(data)
          yield put({
            type: 'pos/setUtil',
            payload: { kodeUtil: 'barcode', infoUtil: 'Product' }
          })
          yield put({ type: 'pos/hideProductModal' })
          message.success('Success add product')
        }
      } else {
        Modal.warning({
          title: 'Out of stock',
          content: 'Out Of Stock'
        })
      }
    },

    * checkQuantityNewConsignment ({ payload }, { put }) {
      const { data } = payload
      insertConsignment(data)
      yield put({
        type: 'pos/setUtil',
        payload: { kodeUtil: 'barcode', infoUtil: 'Product' }
      })
      yield put({ type: 'pos/hideConsignmentModal' })
      message.success('Success add product')
    },

    * getListProductData (payload, { call, put }) {
      const storeInfo = localStorage.getItem(`${prefix}store`) ? JSON.parse(localStorage.getItem(`${prefix}store`)) : {}
      const data = yield call(queryProductsInStock, { from: storeInfo.startPeriod, to: moment().format('YYYY-MM-DD'), product: '' })
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            listProductData: data.data
          }
        })
      }
    },
    * queryWOHeader ({ payload }, { call, put }) {
      const data = yield call(queryWOHeader, { status: '0', ...payload })
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            listWOHeader: data.data,
            pagination: {
              current: Number(data.page) || 1,
              pageSize: Number(data.pageSize) || 10,
              total: data.total
            }
          }
        })
      } else {
        throw data
      }
    },

    * chooseEmployee ({ payload }, { put }) {
      const { item } = payload
      localStorage.removeItem('mechanic')
      let arrayProd = []
      arrayProd.push({
        employeeId: item.id,
        employeeName: item.employeeName,
        employeeCode: item.employeeId
      })
      localStorage.setItem('mechanic', JSON.stringify(arrayProd))
      yield put({ type: 'pos/queryGetMechanicSuccess', payload: { mechanicInformation: arrayProd[0] || {} } })
      yield put({ type: 'pos/setUtil', payload: { kodeUtil: 'barcode', infoUtil: 'Product' } })
      yield put({ type: 'pos/hideMechanicModal' })
    },

    * chooseMember ({ payload = {} }, { put }) {
      const { item, defaultValue, chooseItem } = payload
      const modalMember = () => {
        return new Promise((resolve) => {
          Modal.info({
            title: 'Reset unsaved process',
            content: 'this action will reset your current process',
            onOk () {
              resolve()
            }
          })
        })
      }
      if (chooseItem) {
        yield modalMember()
      }
      yield put({
        type: 'pos/removeTrans',
        payload: {
          defaultValue
        }
      })
      localStorage.removeItem('member')
      localStorage.removeItem('memberUnit')
      let listByCode = (localStorage.getItem('member') === null ? [] : localStorage.getItem('member'))

      let arrayProd
      if (JSON.stringify(listByCode) === '[]') {
        arrayProd = listByCode.slice()
      } else {
        arrayProd = JSON.parse(listByCode.slice())
      }
      let newItem = reArrangeMember(item)
      arrayProd.push(newItem)

      localStorage.setItem('member', JSON.stringify(arrayProd))
      yield put({
        type: 'pos/syncCustomerCashback',
        payload: {
          memberId: newItem.id
        }
      })
      yield put({
        type: 'pos/queryGetMemberSuccess',
        payload: { memberInformation: newItem }
      })
      yield put({ type: 'pos/setUtil', payload: { kodeUtil: 'barcode', infoUtil: 'Product' } })
      yield put({ type: 'unit/lov', payload: { id: item.memberCode } })
      yield put({
        type: 'pos/hideMemberModal'
      })
      yield put({
        type: 'pos/updateState',
        payload: {
          showListReminder: false
        }
      })
      yield put({
        type: 'customer/updateState',
        payload: {
          addUnit: {
            modal: false,
            info: { id: item.id, name: item.memberName }
          }
        }
      })
      yield put({
        type: 'pos/setCurBarcode',
        payload: {
          curBarcode: '',
          curQty: 1
        }
      })
    },

    * chooseConsignment ({ payload }, { select, put }) {
      const modalMember = () => {
        return new Promise((resolve) => {
          Modal.info({
            title: 'Member Information is not found',
            content: 'Insert Member',
            onOk () {
              resolve()
            }
          })
        })
      }
      const modalEmployee = () => {
        return new Promise((resolve) => {
          Modal.info({
            title: 'Employee Information is not found',
            content: 'Insert Employee',
            onOk () {
              resolve()
            }
          })
        })
      }
      const { item } = payload
      const memberInformation = yield select(({ pos }) => pos.memberInformation)
      const mechanicInformation = yield select(({ pos }) => pos.mechanicInformation)
      if (!(memberInformation && memberInformation.id)) {
        yield modalMember()
        yield put({ type: 'pos/hideProductModal' })
        yield put({
          type: 'pos/getMembers'
        })

        yield put({
          type: 'pos/showMemberModal',
          payload: {
            modalType: 'browseMember'
          }
        })
        return
      }
      if (!(mechanicInformation && mechanicInformation.employeeId)) {
        yield modalEmployee()
        yield put({ type: 'pos/hideProductModal' })
        yield put({
          type: 'pos/getMechanics'
        })

        yield put({
          type: 'pos/showMechanicModal',
          payload: {
            modalType: 'browseMechanic'
          }
        })
        return
      }
      let listByCode = getConsignment()
      let arrayProd = listByCode
      const checkExists = listByCode.filter(el => el.code === item.product.product_code)
      if ((checkExists || []).length > 0) {
        Modal.warning({
          title: 'Already Exists',
          content: 'Already Exists in list'
        })
        return
      }
      const setting = yield select(({ app }) => app.setting)

      let typePrice = 'price'
      const typePembelian = localStorage.getItem('typePembelian') ? Number(localStorage.getItem('typePembelian')) : 1
      // eslint-disable-next-line eqeqeq
      if (typePembelian == TYPE_PEMBELIAN_GRABFOOD) {
        typePrice = 'price_grabfood_gofood'
      }
      // eslint-disable-next-line eqeqeq
      if (typePembelian == TYPE_PEMBELIAN_GRABMART) {
        typePrice = 'price_grabmart'
      }

      const data = {
        no: arrayProd.length + 1,
        code: item.product.product_code,
        stock: item.quantity,
        productId: item.id,
        name: item.product.product_name,
        qty: 1,
        sellPrice: item[typePrice] == null ? item.price : item[typePrice],
        otherSellPrice: item.price_grabfood_gofood,
        martSellPrice: item.price_grabmart,
        originalSellPrice: item.price,
        price: item[typePrice] == null ? item.price : item[typePrice],
        discount: 0,
        disc1: 0,
        disc2: 0,
        disc3: 0,
        total: item[typePrice] == null ? item.price : item[typePrice]
      }

      arrayProd.push({
        no: arrayProd.length + 1,
        code: item.product.product_code,
        stock: item.quantity,
        productId: item.id,
        name: item.product.product_name,
        qty: 1,
        sellPrice: item[typePrice] == null ? item.price : item[typePrice],
        otherSellPrice: item.price_grabfood_gofood,
        martSellPrice: item.price_grabmart,
        originalSellPrice: item.price,
        price: item[typePrice] == null ? item.price : item[typePrice],
        discount: 0,
        disc1: 0,
        disc2: 0,
        disc3: 0,
        total: item[typePrice] == null ? item.price : item[typePrice]
      })
      yield put({
        type: 'pos/checkQuantityNewConsignment',
        payload: {
          data,
          arrayProd,
          setting,
          type: payload.type
        }
      })
    },

    * chooseProduct ({ payload }, { select, put }) {
      const modalMember = () => {
        return new Promise((resolve) => {
          Modal.info({
            title: 'Member Information is not found',
            content: 'Insert Member',
            onOk () {
              resolve()
            }
          })
        })
      }
      const modalEmployee = () => {
        return new Promise((resolve) => {
          Modal.info({
            title: 'Employee Information is not found',
            content: 'Insert Employee',
            onOk () {
              resolve()
            }
          })
        })
      }

      const { item, type } = payload
      if (item && item.storePrice && item.storePrice[0]) {
        const price = item.storePrice.filter(filtered => filtered.storeId === lstorage.getCurrentUserStore())
        if (price && price[0]) {
          item.sellPrice = price[0].sellPrice
          item.distPrice01 = price[0].distPrice01
          item.distPrice02 = price[0].distPrice02
          item.distPrice03 = price[0].distPrice03
          item.distPrice04 = price[0].distPrice04
          item.distPrice05 = price[0].distPrice05
        }
      }

      const currentReward = yield select(({ pospromo }) => (pospromo ? pospromo.currentReward : {}))
      let qty = 1
      if (currentReward && currentReward.categoryCode && currentReward.type === 'P') {
        item.sellPrice = currentReward.sellPrice
        item.distPrice01 = currentReward.distPrice01
        item.distPrice02 = currentReward.distPrice02
        item.distPrice03 = currentReward.distPrice03
        item.distPrice04 = currentReward.distPrice04
        item.distPrice05 = currentReward.distPrice05
        qty = currentReward.qty
      }
      const memberInformation = yield select(({ pos }) => pos.memberInformation)
      const mechanicInformation = yield select(({ pos }) => pos.mechanicInformation)
      const curQty = yield select(({ pos }) => pos.curQty)
      const setting = yield select(({ app }) => app.setting)
      if (!!(memberInformation && memberInformation.id) && !!(mechanicInformation && mechanicInformation.employeeId)) {
        let listByCode = getCashierTrans()
        let arrayProd = listByCode
        const checkExists = listByCode.filter(el => el.code === item.productCode)
        if (currentReward && currentReward.categoryCode && currentReward.type === 'P' && checkExists && checkExists[0]) {
          const currentItem = checkExists[0]
          const newQty = currentItem.qty + currentReward.qty
          const data = {
            no: currentItem.no,
            bundleId: currentReward && currentReward.categoryCode && currentReward.type === 'P' ? currentReward.bundleId : undefined,
            bundleCode: currentReward && currentReward.categoryCode && currentReward.type === 'P' ? currentReward.bundleCode : undefined,
            code: item.productCode,
            productId: item.id,
            name: item.productName,
            employeeId: mechanicInformation.employeeId,
            employeeName: `${mechanicInformation.employeeName} (${mechanicInformation.employeeCode})`,
            typeCode: 'P',
            qty: newQty,
            sellPrice: memberInformation.showAsDiscount ? item.sellPrice : item[memberInformation.memberSellPrice.toString()],
            price: (memberInformation.memberSellPrice ? item[memberInformation.memberSellPrice.toString()] : item.sellPrice),
            discount: 0,
            disc1: 0,
            disc2: 0,
            disc3: 0,
            total: (memberInformation.memberSellPrice ? item[memberInformation.memberSellPrice.toString()] : item.sellPrice) * newQty
          }

          arrayProd[currentItem.no - 1] = {
            no: currentItem.no,
            code: item.productCode,
            bundleId: currentReward && currentReward.categoryCode && currentReward.type === 'P' ? currentReward.bundleId : undefined,
            bundleCode: currentReward && currentReward.categoryCode && currentReward.type === 'P' ? currentReward.bundleCode : undefined,
            productId: item.id,
            name: item.productName,
            employeeId: mechanicInformation.employeeId,
            employeeName: `${mechanicInformation.employeeName} (${mechanicInformation.employeeCode})`,
            typeCode: 'P',
            qty: newQty,
            sellPrice: memberInformation.showAsDiscount ? item.sellPrice : item[memberInformation.memberSellPrice.toString()],
            price: (memberInformation.memberSellPrice ? item[memberInformation.memberSellPrice.toString()] : item.sellPrice),
            discount: 0,
            disc1: 0,
            disc2: 0,
            disc3: 0,
            total: (memberInformation.memberSellPrice ? item[memberInformation.memberSellPrice.toString()] : item.sellPrice) * newQty
          }
          yield put({
            type: 'pos/checkQuantityEditProduct',
            payload: {
              data,
              arrayProd,
              setting,
              type: payload.type
            }
          })
        } else if ((checkExists || []).length === 0) {
          const data = {
            no: arrayProd.length + 1,
            bundleId: currentReward && currentReward.categoryCode && currentReward.type === 'P' ? currentReward.bundleId : undefined,
            bundleCode: currentReward && currentReward.categoryCode && currentReward.type === 'P' ? currentReward.bundleCode : undefined,
            code: item.productCode,
            productId: item.id,
            name: item.productName,
            employeeId: mechanicInformation.employeeId,
            employeeName: `${mechanicInformation.employeeName} (${mechanicInformation.employeeCode})`,
            typeCode: 'P',
            qty,
            sellPrice: memberInformation.showAsDiscount ? item.sellPrice : item[memberInformation.memberSellPrice.toString()],
            price: (memberInformation.memberSellPrice ? item[memberInformation.memberSellPrice.toString()] : item.sellPrice),
            discount: 0,
            disc1: 0,
            disc2: 0,
            disc3: 0,
            total: (memberInformation.memberSellPrice ? item[memberInformation.memberSellPrice.toString()] : item.sellPrice) * curQty
          }

          arrayProd.push({
            no: arrayProd.length + 1,
            code: item.productCode,
            bundleId: currentReward && currentReward.categoryCode && currentReward.type === 'P' ? currentReward.bundleId : undefined,
            bundleCode: currentReward && currentReward.categoryCode && currentReward.type === 'P' ? currentReward.bundleCode : undefined,
            productId: item.id,
            name: item.productName,
            employeeId: mechanicInformation.employeeId,
            employeeName: `${mechanicInformation.employeeName} (${mechanicInformation.employeeCode})`,
            typeCode: 'P',
            qty,
            sellPrice: memberInformation.showAsDiscount ? item.sellPrice : item[memberInformation.memberSellPrice.toString()],
            price: (memberInformation.memberSellPrice ? item[memberInformation.memberSellPrice.toString()] : item.sellPrice),
            discount: 0,
            disc1: 0,
            disc2: 0,
            disc3: 0,
            total: (memberInformation.memberSellPrice ? item[memberInformation.memberSellPrice.toString()] : item.sellPrice) * curQty
          })
          yield put({
            type: 'pos/checkQuantityNewProduct',
            payload: {
              data,
              arrayProd,
              setting,
              type: payload.type
            }
          })
          // yield put({
          //   type: 'pos/updateState',
          //   payload: {
          //     paymentListActiveKey: '1'
          //     // ,
          //     // modalProductVisible: false
          //   }
          // })
        } else if ((checkExists || []).length > 0 && checkExists[0].bundleId) {
          Modal.warning({
            title: 'Exists in bundle',
            content: 'This product exists in bundle'
          })
        } else if ((checkExists || []).length > 0 && type === 'barcode') {
          const currentItem = checkExists[0]
          const newQty = currentItem.qty + 1
          const price = memberInformation.memberSellPrice ? item[memberInformation.memberSellPrice.toString()] : item.sellPrice
          const data = {
            no: currentItem.no,
            code: item.productCode,
            bundleId: currentReward && currentReward.categoryCode && currentReward.type === 'P' ? currentReward.bundleId : undefined,
            bundleCode: currentReward && currentReward.categoryCode && currentReward.type === 'P' ? currentReward.bundleCode : undefined,
            productId: item.id,
            name: item.productName,
            employeeId: mechanicInformation.employeeId,
            employeeName: `${mechanicInformation.employeeName} (${mechanicInformation.employeeCode})`,
            typeCode: 'P',
            qty: newQty,
            sellPrice: memberInformation.showAsDiscount ? item.sellPrice : item[memberInformation.memberSellPrice.toString()],
            price,
            discount: 0,
            disc1: 0,
            disc2: 0,
            disc3: 0,
            total: price * newQty
          }

          arrayProd.push({
            no: currentItem.no,
            code: item.productCode,
            bundleId: currentReward && currentReward.categoryCode && currentReward.type === 'P' ? currentReward.bundleId : undefined,
            bundleCode: currentReward && currentReward.categoryCode && currentReward.type === 'P' ? currentReward.bundleCode : undefined,
            productId: item.id,
            name: item.productName,
            employeeId: mechanicInformation.employeeId,
            employeeName: `${mechanicInformation.employeeName} (${mechanicInformation.employeeCode})`,
            typeCode: 'P',
            qty: newQty,
            sellPrice: memberInformation.showAsDiscount ? item.sellPrice : item[memberInformation.memberSellPrice.toString()],
            price,
            discount: 0,
            disc1: 0,
            disc2: 0,
            disc3: 0,
            total: price * newQty
          })
          yield put({
            type: 'pos/checkQuantityEditProduct',
            payload: {
              data,
              setting
            }
          })
        } else {
          Modal.warning({
            title: 'Already Exists',
            content: 'Already Exists in list'
          })
        }
      } else if (!(memberInformation && memberInformation.id)) {
        yield modalMember()
        yield put({ type: 'pos/hideProductModal' })
        yield put({
          type: 'pos/getMembers'
        })

        yield put({
          type: 'pos/showMemberModal',
          payload: {
            modalType: 'browseMember'
          }
        })
      } else if (!(mechanicInformation && mechanicInformation.employeeId)) {
        yield modalEmployee()
        yield put({ type: 'pos/hideProductModal' })
        yield put({
          type: 'pos/getMechanics'
        })

        yield put({
          type: 'pos/showMechanicModal',
          payload: {
            modalType: 'browseMechanic'
          }
        })
      }
    },

    * getMemberByPhone ({ payload }, { call, put }) {
      const response = yield call(queryByPhone, payload)
      if (response && response.success && response.data && response.data.id) {
        yield put({
          type: 'pos/chooseMember',
          payload: {
            item: response.data,
            type: payload.type,
            defaultValue: true,
            chooseItem: true
          }
        })
      } else {
        message.warning('Barcode Not found')
      }
    },

    // * getProductByBarcode ({ payload }, { select, call, put }) {
    * getProductByBarcode ({ payload }, { call, put }) {
      // const localDB = yield select(({ app }) => app.localDB)
      // const listIndex = yield call(getListIndex, {
      //   localDB
      // })
      // console.log('listIndex', listIndex)
      // // OFFLINE BUNDLE
      // let startBundle = window.performance.now()
      // const getResponseBundle = yield call(queryByBarcodeBundleOffline, {
      //   localDB,
      //   barCode01: payload.id
      // })
      // let endBundle = window.performance.now()
      // const timeToExecuteBundle = endBundle - startBundle
      // console.log('getResponseBundle', timeToExecuteBundle >= 1000 ? `${timeToExecuteBundle / 1000} s` : `${timeToExecuteBundle} ms`, getResponseBundle)

      // if (getResponseBundle && getResponseBundle.docs && getResponseBundle.docs[0]) {
      //   if (getResponseBundle.docs[0].code) {
      //     yield put({
      //       type: 'pospromo/addPosPromo',
      //       payload: {
      //         type: 'all',
      //         bundleId: getResponseBundle.docs[0].id,
      //         currentBundle: localStorage.getItem('bundle_promo') ? JSON.parse(localStorage.getItem('bundle_promo')) : [],
      //         currentProduct: getCashierTrans(),
      //         currentService: localStorage.getItem('service_detail') ? JSON.parse(localStorage.getItem('service_detail')) : []
      //       }
      //     })
      //   }
      //   return
      // }

      // // OFFLINE PRODUCT
      // let start = window.performance.now()
      // const getResponse = yield call(queryByBarcodeOffline, {
      //   localDB,
      //   barCode01: payload.id
      // })
      // let end = window.performance.now()
      // const timeToExecute = end - start
      // console.log('getResponse', timeToExecute >= 1000 ? `${timeToExecute / 1000} s` : `${timeToExecute} ms`, getResponse)

      // if (getResponse && getResponse.docs && getResponse.docs[0]) {
      //   if (getResponse.docs[0].productCode) {
      //     yield put({
      //       type: 'pos/chooseProduct',
      //       payload: {
      //         item: getResponse.docs[0],
      //         type: payload.type
      //       }
      //     })
      //   }

      //   return
      // }

      // ONLINE
      let startOnline = window.performance.now()
      const response = yield call(queryByBarcode, payload)
      let endOnline = window.performance.now()
      const timeToExecuteOnline = endOnline - startOnline
      console.log('queryByBarcode', timeToExecuteOnline >= 1000 ? `${timeToExecuteOnline / 1000} s` : `${timeToExecuteOnline} ms`, response)
      if (response && response.success && response.data && response.data.id) {
        if (response.data.productCode) {
          yield put({
            type: 'pos/chooseProduct',
            payload: {
              item: response.data,
              type: payload.type
            }
          })
        }

        if (response.data.code) {
          yield put({
            type: 'pospromo/addPosPromo',
            payload: {
              type: 'all',
              bundleId: response.data.id,
              currentBundle: localStorage.getItem('bundle_promo') ? JSON.parse(localStorage.getItem('bundle_promo')) : [],
              currentProduct: getCashierTrans(),
              currentService: localStorage.getItem('service_detail') ? JSON.parse(localStorage.getItem('service_detail')) : []
            }
          })
        }
      } else {
        message.warning('Barcode Not found')
      }
    },

    * getConsignments ({ payload }, { call, put }) {
      const data = yield call(queryConsignment, payload)
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            listConsignment: data.data,
            pagination: {
              total: data.total,
              current: Number(data.page) || 1,
              pageSize: Number(data.pageSize) || 10
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

    * hideProductModal (payload, { put }) {
      yield put({
        type: 'updateState',
        payload: {
          modalProductVisible: false, listProduct: [], tmpProductList: []
        }
      })
      yield put({
        type: 'pospromo/updateState',
        payload: {
          currentReward: {}
        }
      })
    },

    * hideServiceModal (payload, { put }) {
      yield put({
        type: 'updateState',
        payload: {
          modalServiceVisible: false
        }
      })
      yield put({
        type: 'pospromo/updateState',
        payload: {
          currentReward: {}
        }
      })
    },

    * getProducts ({ payload }, { select, call, put }) {
      // const storeInfo = localStorage.getItem(`${prefix}store`) ? JSON.parse(localStorage.getItem(`${prefix}store`)) : {}
      // let data = {}
      // if (payload.outOfStock) {
      //   data = yield call(queryProductStock, payload)
      // } else {
      //   data = yield call(queryProductsInStock, { from: storeInfo.startPeriod, to: moment().format('YYYY-MM-DD') })
      // }
      const currentReward = yield select(({ pospromo }) => (pospromo ? pospromo.currentReward : {}))
      if (currentReward && currentReward.categoryCode) {
        payload.categoryCode = currentReward.categoryCode
      }
      const data = yield call(queryProductStock, payload)
      let newData = data.data
      if (data.success) {
        yield put({
          type: 'showProductQty',
          payload: {
            data: newData
          }
        })
        yield put({
          type: 'queryGetProductsSuccess',
          payload: {
            productInformation: newData,
            tmpProductList: newData
          }
        })
        yield put({
          type: 'updateState',
          payload: {
            pagination: {
              total: data.total,
              current: Number(data.page) || 1,
              pageSize: Number(data.pageSize) || 10
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

    * queryProducts ({ payload }, { call, put }) {
      const storeInfo = localStorage.getItem(`${prefix}store`) ? JSON.parse(localStorage.getItem(`${prefix}store`)) : {}
      let data = {}
      if (payload.outOfStock) {
        data = yield call(queryProductsInStock, { from: storeInfo.startPeriod, to: moment().format('YYYY-MM-DD') })
        // yield put({
        //   type: 'showProductModal',
        //   payload: {
        //     modalType: 'browseProductFree',
        //   },
        // })
      } else {
        const storeInfo = localStorage.getItem(`${prefix}store`) ? JSON.parse(localStorage.getItem(`${prefix}store`)) : {}
        data = yield call(queryProductsInStock, { from: storeInfo.startPeriod, to: moment().format('YYYY-MM-DD') })
        // yield put({
        //   type: 'showProductModal',
        //   payload: {
        //     modalType: 'browseProductLock',
        //   },
        // })
      }
      let newData = data.data
      if (data.success) {
        yield put({
          type: 'queryGetProductsSuccess',
          payload: {
            productInformation: newData,
            tmpProductList: newData
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

    * cashRegister ({ payload = {} }, { call, put }) {
      const userId = lstorage.getStorageKey('udi')[1]
      const data = yield call(cashRegister, payload)
      if (data.success) {
        localStorage.setItem('cashierNo', data.cashregisters.cashierId)
        yield put({
          type: 'updateState',
          payload: {
            cashierInformation: data.cashregisters,
            dataCashierTrans: data.cashregisters
          }
        })
        yield put({
          type: 'loadDataPos',
          payload: {
            cashierId: userId,
            status: 'O'
          }
        })
        yield put({
          type: 'hideShiftModal',
          payload: {
            curShift: payload.shift,
            curCashierNo: payload.cashierNo
          }
        })
      } else if (data.statusCode === 422) {
        Modal.warning({
          title: 'Warning',
          content: (<p>Please go to <b>Setting &gt; Person &gt; Cashier</b> to make sure that your account has registered</p>)
        })
      } else if (data.statusCode === 409) {
        Modal.warning({
          title: 'Warning',
          content: (<p>{data.message}</p>)
        })
      }
    },

    * setCloseCashier ({ payload }, { call, put }) {
      const data_cashier_trans_update = yield call(updateCashierTrans, payload)

      if (data_cashier_trans_update.success) {
        yield put({
          type: 'setAllNull'
        })

        Modal.info({
          title: 'Information',
          content: 'Cashier closed successfull...!'
        })
      } else {
        Modal.warning({
          title: 'Warning',
          content: 'Cashier cannot be closed, please contact your IT Support...!'
        })
      }
    },

    * insertQueueCache ({ payload = [] }, { put }) {
      let arrayProd = payload

      const memberUnit = localStorage.getItem('memberUnit') ? localStorage.getItem('memberUnit') : ''
      const policeNo = localStorage.getItem('memberUnit') ? JSON.parse(localStorage.getItem('memberUnit')).policeNo : ''
      const lastMeter = localStorage.getItem('lastMeter') ? localStorage.getItem('lastMeter') : 0
      const cashier_trans = getCashierTrans()
      const service_detail = localStorage.getItem('service_detail') ? JSON.parse(localStorage.getItem('service_detail')) : []
      const bundle_promo = localStorage.getItem('bundle_promo') ? JSON.parse(localStorage.getItem('bundle_promo')) : []
      const woNumber = localStorage.getItem('woNumber') ? localStorage.getItem('woNumber') : null
      const workorder = localStorage.getItem('workorder') ? JSON.parse(localStorage.getItem('workorder')) : {}

      let listByCode = (localStorage.getItem('member') === null ? [] : localStorage.getItem('member'))
      let memberInformation
      if (listByCode.length === 0) {
        memberInformation = listByCode.slice()
      } else {
        memberInformation = listByCode
      }
      const memberInfo = memberInformation ? JSON.parse(memberInformation)[0] : []
      // start-mechanicInfo
      const mechanicInfo = localStorage.getItem('mechanic') ? JSON.parse(localStorage.getItem('mechanic')) : []
      const mechanic = mechanicInfo[0]
      // end-mechanicInfo
      arrayProd.push({
        cashier_trans,
        service_detail,
        bundle_promo,
        memberCode: memberInfo.memberCode,
        memberName: memberInfo.memberName,
        cashback: memberInfo.cashback,
        memberTypeId: memberInfo.memberTypeId,
        woNumber,
        woId: workorder.id,
        woNo: workorder.woNo,
        timeIn: workorder.timeIn,
        memberUnit,
        policeNo,
        lastMeter,
        address01: memberInfo.address01,
        gender: memberInfo.gender,
        id: memberInfo.id,
        phone: memberInfo.phone,
        employeeId: mechanic.employeeId,
        employeeCode: mechanic.employeeCode,
        employeeName: mechanic.employeeName
      })
      const queue = localStorage.getItem('queue') ? JSON.parse(localStorage.getItem('queue')) : {}
      if (localStorage.getItem('cashier_trans') === null && localStorage.getItem('member') === null &&
        localStorage.getItem('mechanic') === null) {
        Modal.warning({
          title: 'Warning',
          content: 'Transaction Not Found...!'
        })
      } else {
        // console.log(JSON.parse(localStorage.getItem('queue')))
        for (let n = 0; n < 10; n += 1) {
          let tempQueue = `queue${n + 1}`
          if (queue.hasOwnProperty(tempQueue)) {
            console.log('this', `${tempQueue} already exists`)
          } else if (`${queue.hasOwnProperty(tempQueue)}`) {
            // set Object by string value
            const setDeepValue = (obj, value, path) => {
              if (typeof path === 'string') {
                path = path.split('.')
              }

              if (path.length > 1) {
                let p = path.shift()
                if (obj[p] === null || typeof obj[p] !== 'object') {
                  obj[p] = {}
                }
                setDeepValue(obj[p], value, path)
              } else {
                obj[path[0]] = value
              }
            }
            // Object.assign(queue, tempQueue, arrayProd)
            setDeepValue(queue, arrayProd, tempQueue)
            localStorage.setItem('queue', JSON.stringify(queue))
            yield put({
              type: 'insertQueue',
              payload: {
                queue: n + 1
              }
            })
            break
          }
        }
      }
    },
    * removeTrans ({ payload = {} }, { put }) {
      const { defaultValue } = payload
      localStorage.removeItem('service_detail')
      localStorage.removeItem('consignment')
      localStorage.removeItem('cashier_trans')
      if (!defaultValue) {
        localStorage.removeItem('member')
        localStorage.removeItem('mechanic')
      }
      localStorage.removeItem('memberUnit')
      localStorage.removeItem('lastMeter')
      localStorage.removeItem('woNumber')
      localStorage.removeItem('bundle_promo')
      localStorage.removeItem('workorder')
      yield put({
        type: 'updateState',
        payload: {
          mechanicInformation: localStorage.getItem('mechanic') ? JSON.parse(localStorage.getItem('mechanic'))[0] : [],
          lastMeter: localStorage.getItem('lastMeter') ? localStorage.getItem('lastMeter') : 0,
          memberInformation: localStorage.getItem('member') ? JSON.parse(localStorage.getItem('member'))[0] : [],
          memberUnitInfo: localStorage.getItem('memberUnit') ? JSON.parse(localStorage.getItem('memberUnit')) : { id: null, policeNo: null, merk: null, model: null },
          curCashierNo: localStorage.getItem('cashierNo')
        }
      })
    },
    * insertQueue ({ payload }, { put }) {
      Modal.info({
        title: 'Payment Suspend',
        content: `Your Payment has stored in queue ${payload.queue}`
      })
      localStorage.removeItem('cashier_trans')
      localStorage.removeItem('service_detail')
      localStorage.removeItem('consignment')
      localStorage.removeItem('member')
      localStorage.removeItem('memberUnit')
      localStorage.removeItem('mechanic')
      localStorage.removeItem('lastMeter')
      localStorage.removeItem('woNumber')
      localStorage.removeItem('bundle_promo')
      localStorage.removeItem('workorder')
      let woNumber = localStorage.getItem('woNumber')
      yield put({
        type: 'setAllNull'
      })
      yield put({
        type: 'payment/returnState',
        payload: {
          woNumber,
          usingWo: !((woNumber === '' || woNumber === null))
        }
      })

      // }
    },

    * backPrevious ({ payload = {} }, { put }) {
      yield put({ type: 'hideModalShift', payload })
    },

    * getServiceUsageReminder ({ payload = {} }, { call, put }) {
      const data = yield call(getServiceUsageReminder, payload)
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            listUnitUsage: data.data || []
          }
        })
      } else {
        yield put({
          type: 'updateState',
          payload: {
            listUnitUsage: []
          }
        })
      }
    },

    * syncCustomerCashback ({ payload = {} }, { call, put }) {
      if (payload.memberId) {
        const data = yield call(queryCashbackById, payload)
        if (data.success) {
          let dataMember = localStorage.getItem('member')
          dataMember = dataMember ? JSON.parse(dataMember)[0] : null
          if (dataMember) {
            dataMember.cashback = data.data
            const newDataMember = []
            newDataMember.push(dataMember)
            localStorage.setItem('member', JSON.stringify(newDataMember))
            yield put({
              type: 'updateState',
              payload: {
                memberInformation: dataMember
              }
            })
          }
        } else {
          throw data
        }
      }
    },

    * getServiceReminder ({ payload = {} }, { call, put }) {
      const data = yield call(getServiceReminder, payload)
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            listServiceReminder: data.data
          }
        })
      } else {
        throw data
      }
    }
  },

  reducers: {
    queryDashboardSuccess (state, action) {
      const { listPosDetail, pagination } = action.payload
      return {
        ...state,
        listPosDetail,
        paginationDashboard: {
          ...state.pagination,
          ...pagination
        }
      }
    },

    querySuccess (state, action) {
      const { list, pagination, tmpList } = action.payload
      let dataPos = getCashierTrans()
      let a = dataPos
      let grandTotal = a.reduce((cnt, o) => { return cnt + o.total }, 0)

      return {
        ...state,
        list,
        tmpList,
        pagination: {
          ...state.pagination,
          ...pagination
        },
        curTotal: grandTotal
      }
    },

    querySuccessPayment (state, action) {
      const { listPayment, pagination, tmpListPayment } = action.payload
      return {
        ...state,
        listPayment,
        tmpListPayment,
        pagination: {
          ...state.pagination,
          ...pagination
        }
      }
    },

    querySuccessPaymentDetail (state, action) {
      const { posData, listPaymentDetail, memberPrint, mechanicPrint, companyPrint, pagination } = action.payload
      return {
        ...state,
        listPaymentDetail,
        memberPrint,
        mechanicPrint,
        companyPrint,
        posData,
        pagination: {
          ...state.pagination,
          ...pagination
        }
      }
    },

    queryMechanicSuccess (state, action) {
      const { listMechanic, pagination } = action.payload

      return {
        ...state,
        listMechanic,
        pagination: {
          ...state.pagination,
          ...pagination
        }
      }
    },

    queryServiceSuccess (state, action) {
      const { listService, pagination } = action.payload
      let dataPos = getCashierTrans()
      let a = dataPos
      let grandTotal = a.reduce((cnt, o) => { return cnt + o.total }, 0)

      return {
        ...state,
        listService,
        pagination: {
          ...state.pagination,
          ...pagination
        },
        curTotal: grandTotal
      }
    },

    querySuccessByCode (state, action) {
      const { listByCode, curRecord } = action.payload

      let dataPos = getCashierTrans()
      let a = dataPos
      let grandTotal = a.reduce((cnt, o) => { return cnt + o.total }, 0)

      return {
        ...state,
        listByCode,
        curTotal: grandTotal,
        curRecord
      }
    },

    queryServiceSuccessByCode (state, action) {
      const { listByCode, curRecord } = action.payload

      let dataPos = getCashierTrans()
      let a = dataPos
      let grandTotal = a.reduce((cnt, o) => { return cnt + o.total }, 0)

      return {
        ...state,
        listByCode,
        curTotal: grandTotal,
        curRecord
      }
    },

    queryGetMemberSuccess (state, action) {
      const { memberInformation } = action.payload
      let dataPos = getCashierTrans()
      let a = dataPos
      let grandTotal = a.reduce((cnt, o) => { return cnt + o.total }, 0)

      return {
        ...state,
        memberInformation,
        memberUnitInfo: { policeNo: null },
        curTotal: grandTotal
      }
    },

    queryGetMembersSuccess (state, action) {
      const { memberInformation, tmpMemberList, ...other } = action.payload
      let dataPos = getCashierTrans()
      let a = dataPos
      let grandTotal = a.reduce((cnt, o) => { return cnt + o.total }, 0)

      return {
        ...state,
        listMember: memberInformation,
        tmpMemberList,
        curTotal: grandTotal,
        ...other
      }
    },

    queryGetUnitSuccess (state, action) {
      return {
        ...state,
        ...action.payload
      }
    },

    queryGetServicesSuccess (state, action) {
      const { serviceInformation, tmpServiceList } = action.payload
      let grandTotal = getCashierTrans().reduce((cnt, o) => cnt + o.total, 0)

      return {
        ...state,
        listService: serviceInformation,
        tmpServiceList,
        curTotal: grandTotal
      }
    },

    queryGetMechanicSuccess (state, action) {
      const { mechanicInformation } = action.payload
      let dataPos = getCashierTrans()
      let a = dataPos
      let grandTotal = a.reduce((cnt, o) => { return cnt + o.total }, 0)

      return {
        ...state,
        mechanicInformation,
        curTotal: grandTotal
      }
    },

    queryGetMechanicsSuccess (state, action) {
      const { mechanicInformation, tmpMechanicList } = action.payload
      let dataPos = getCashierTrans()
      let a = dataPos
      let grandTotal = a.reduce((cnt, o) => { return cnt + o.total }, 0)

      return {
        ...state,
        listMechanic: mechanicInformation,
        tmpMechanicList,
        curTotal: grandTotal
      }
    },

    queryGetProductsSuccess (state, action) {
      const { productInformation, tmpProductList } = action.payload
      let dataPos = getCashierTrans()
      let a = dataPos
      let grandTotal = a.reduce((cnt, o) => cnt + o.total, 0)
      return {
        ...state,
        listProduct: productInformation,
        tmpProductList,
        curTotal: grandTotal
      }
    },

    chooseMemberUnit (state, action) {
      const { policeNo } = action.payload
      let dataPos = getCashierTrans()
      let a = dataPos
      let grandTotal = a.reduce((cnt, o) => cnt + o.total, 0)
      return {
        ...state,
        memberUnitInfo: { policeNo: policeNo.policeNo },
        visiblePopover: false,
        curTotal: grandTotal
      }
    },

    getMechanicSuccess (state, action) {
      const { memberInformation } = action.payload

      return {
        ...state,
        memberInformation
      }
    },

    modalPopoverClose (state) {
      return { ...state, visiblePopover: false }
    },
    modalPopoverShow (state, action) {
      return { ...state, ...action.payload, visiblePopover: true }
    },

    // setStatePosLoaded (state, action) {
    //   if (!state.dataPosLoaded) {
    //     localStorage.setItem('cashier_trans', action.payload.arrayProd)

    //     let dataPos = getCashierTrans()
    //     let a = dataPos
    //     let grandTotal = a.reduce((cnt, o) => { return cnt + o.total }, 0)

    //     return {
    //       ...state,
    //       dataPosLoaded: true,
    //       curTotal: grandTotal,
    //       curRecord: action.payload.curRecord
    //     }
    //   }
    //   return { ...state }
    // },

    setCashierNo (state, action) {
      const { listCashier, dataCashierTrans } = action.payload

      let DICT_FIXED = (function () {
        let fixed = []
        for (let id in listCashier) {
          if ({}.hasOwnProperty.call(listCashier, id)) {
            fixed.push({
              value: listCashier[id].cashierNo,
              label: listCashier[id].cashierDesc
            })
          }
        }

        return fixed
      }())

      return { ...state, listCashier: DICT_FIXED, dataCashierTrans }
    },

    updateState (state, { payload }) {
      return {
        ...state,
        ...payload
      }
    },

    showModal (state, action) {
      return { ...state, ...action.payload, modalVisible: true }
    },

    hideModal (state) {
      return { ...state, modalVisible: false }
    },

    hideModalShift (state) {
      return { ...state, modalShiftVisible: false, modalPaymentVisible: false }
    },

    showMemberModal (state, action) {
      return { ...state, ...action.payload, modalMemberVisible: true }
    },
    hideMemberModal (state) {
      return { ...state, modalMemberVisible: false }
    },

    showPrintModal (state, action) {
      return { ...state, ...action.payload, modalPrintVisible: true }
    },
    hidePrintModal (state) {
      return { ...state, modalPrintVisible: false, modalCancelVisible: false, listPaymentDetail: null, invoiceCancel: '' }
    },
    showCancelModal (state, action) {
      return { ...state, ...action.payload, modalCancelVisible: true, invoiceCancel: action.payload.transNo }
    },


    showPaymentModal (state, action) {
      return { ...state, ...action.payload, totalItem: action.payload.item.total, itemPayment: action.payload.item, modalPaymentVisible: true }
    },
    hidePaymentModal (state) {
      return { ...state, modalPaymentVisible: false, totalItem: 0, itemPayment: [] }
    },

    showServiceListModal (state, action) {
      return { ...state, ...action.payload, itemService: action.payload.item, modalServiceListVisible: true }
    },
    hideServiceListModal (state) {
      return { ...state, modalServiceListVisible: false }
    },

    showConsignmentListModal (state, action) {
      return { ...state, ...action.payload, itemConsignment: action.payload.item, modalConsignmentListVisible: true }
    },
    hideConsignmentListModal (state) {
      return { ...state, modalConsignmentListVisible: false }
    },

    showModalLogin (state, action) {
      return { ...state, ...action.payload, modalLoginVisible: true }
    },
    hideModalLogin (state) {
      return { ...state, modalLoginVisible: false, modalLoginType: null }
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

    showConsignmentModal (state, action) {
      return { ...state, ...action.payload, modalConsignmentVisible: true }
    },
    hideConsignmentModal (state) {
      return { ...state, modalConsignmentVisible: false, listConsignment: [] }
    },


    showServiceModal (state, action) {
      return { ...state, ...action.payload, modalServiceVisible: true }
    },

    showHelpModal (state, action) {
      return { ...state, ...action.payload, modalHelpVisible: true }
    },

    hideHelpModal (state) {
      return { ...state, modalHelpVisible: false }
    },

    showShiftModal (state, action) {
      return { ...state, ...action.payload, modalShiftVisible: true, memberUnitInfo: action.payload }
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
      return {
        ...state,
        curQty: 1,
        curRecord: 1,
        curTotal: 0,
        listByCode: [],
        memberInformation: localStorage.getItem('member') ? JSON.parse(localStorage.getItem('member'))[0] : {},
        mechanicInformation: localStorage.getItem('mechanic') ? JSON.parse(localStorage.getItem('mechanic'))[0] : {},
        curTotalDiscount: 0,
        curRounding: 0,
        memberUnitInfo: { id: null, policeNo: null, merk: null, model: null },
        lastMeter: 0
      }
    },


    showModalWarning (state) {
      return { ...state, modalWarningVisible: true }
    },

    setUtil (state, action) {
      return { ...state, kodeUtil: action.payload.kodeUtil, infoUtil: action.payload.infoUtil }
    },

    setEffectedRecord (state, action) {
      return { ...state, effectedRecord: action.payload.effectedRecord }
    },

    setCurTotal (state) {
      let product = getCashierTrans()
      let consignment = getConsignment()
      let service = localStorage.getItem('service_detail') ? JSON.parse(localStorage.getItem('service_detail')) : []
      let dataPos = product.concat(service).concat(consignment)
      let a = dataPos
      let curRecord = a.reduce((cnt) => { return cnt + 1 }, 0)
      let grandTotal = a.reduce((cnt, o) => { return cnt + o.total }, 0)
      let totalDiscount = a.reduce((cnt, o) => { return cnt + parseInt(o.discount, 10) }, 0)
      let totalDisc1 = a.reduce((cnt, o) => {
        let tmpTotal = o.qty * o.price
        return cnt + ((tmpTotal * o.disc1) / 100)
      }, 0)

      let totalDisc2 = a.reduce((cnt, o) => {
        let tmpTotal = o.qty * o.price
        let tmpDisc1 = ((tmpTotal * o.disc1) / 100)
        return cnt + (((tmpTotal - tmpDisc1) * o.disc2) / 100)
      }, 0)
      let totalDisc3 = a.reduce((cnt, o) => {
        let tmpTotal = o.qty * o.price
        let tmpDisc1 = ((tmpTotal * o.disc1) / 100)
        let tmpDisc2 = (((tmpTotal - tmpDisc1) * o.disc2) / 100)
        return cnt + (((tmpTotal - tmpDisc1 - tmpDisc2) * o.disc3) / 100)
      }, 0)

      // let ratusan = grandTotal.toString().substr(grandTotal.toString().length - 2, 2)
      // Ganti 100 dengan Jumlah Pembulatan yang diinginkan
      // let selisih = 100 - parseInt(ratusan, 10)
      let curRounding = 0

      // if (selisih > 50) {
      //   curRounding = parseInt(ratusan, 10) * -1
      // } else {
      //   curRounding = parseInt(selisih, 10)
      // }

      return {
        ...state,
        curTotal: grandTotal,
        curTotalDiscount: (parseInt(totalDiscount, 10) + parseInt(totalDisc1, 10) + parseInt(totalDisc2, 10) + parseInt(totalDisc3, 10)),
        curRounding,
        curRecord: curRecord + 1,
        memberInformation: localStorage.getItem('member') ? JSON.parse(localStorage.getItem('member'))[0] : {},
        lastMeter: localStorage.getItem('lastMeter') ? localStorage.getItem('lastMeter') : 0,
        memberUnitInfo: { policeNo: localStorage.getItem('memberUnit') ? JSON.parse(localStorage.getItem('memberUnit')).policeNo : null },
        mechanicInformation: localStorage.getItem('mechanic') ? JSON.parse(localStorage.getItem('mechanic'))[0] : {}
      }
    },

    // untuk filter
    onInputChange (state, action) {
      return { ...state, searchText: action.payload.searchText }
    },

    onMemberSearch (state, action) {
      const { searchText, tmpMemberList } = action.payload
      const reg = new RegExp(searchText, 'gi')
      let newData
      newData = tmpMemberList.map((record) => {
        const match = record.memberName.match(reg) || record.memberCode.match(reg) || record.address01.match(reg) || record.mobileNumber.match(reg)
        if (!match) {
          return null
        }
        return {
          ...record
        }
      }).filter(record => !!record)

      return { ...state, listMember: newData }
    },
    onMechanicSearch (state, action) {
      const { searchText, tmpMechanicList } = action.payload
      const reg = new RegExp(searchText, 'gi')
      let newData
      newData = tmpMechanicList.map((record) => {
        const match = record.employeeName.match(reg) || record.employeeId.match(reg) || record.positionName.match(reg)
        if (!match) {
          return null
        }
        return {
          ...record
        }
      }).filter(record => !!record)

      return { ...state, listMechanic: newData }
    },
    onUnitSearch (state, action) {
      const { searchText, tmpMemberUnit } = action.payload
      const reg = new RegExp(searchText, 'gi')
      let newData
      newData = tmpMemberUnit.map((record) => {
        const match = record.policeNo.match(reg)
        if (!match) {
          return null
        }
        return {
          ...record
        }
      }).filter(record => !!record)

      return { ...state, listUnit: newData }
    },
    onProductSearch (state, action) {
      const { searchText, tmpProductList } = action.payload
      const reg = new RegExp(searchText, 'gi')
      let newData
      newData = tmpProductList.map((record) => {
        const match = record.productName.match(reg) || record.productCode.match(reg)
        if (!match) {
          return null
        }
        return {
          ...record
        }
      }).filter(record => !!record)

      return { ...state, listProduct: newData }
    },
    onReset (state, action) {
      const { searchText, tmpList } = action.payload
      const reg = new RegExp(searchText, 'gi')
      let newData

      newData = tmpList.map((record) => {
        const match = record.memberName.match(reg)
        if (!match) {
          return null
        }
        return {
          ...record
        }
      }).filter(record => !!record)

      return { ...state, list: newData, searchText }
    },

    onServiceSearch (state, action) {
      const { searchText, tmpServiceList } = action.payload
      const reg = new RegExp(searchText, 'gi')
      let newData
      newData = tmpServiceList.map((record) => {
        const match = record.serviceName.match(reg) || record.serviceCode.match(reg)
        if (!match) {
          return null
        }
        return {
          ...record
        }
      }).filter(record => !!record)
      return { ...state, listService: newData }
    },

    onSearch (state, action) {
      const { searchText, tmpList } = action.payload
      const reg = new RegExp(searchText, 'gi')
      let newData

      newData = tmpList.map((record) => {
        const match = record.productName.match(reg)
        if (!match) {
          return null
        }
        return {
          ...record
        }
      }).filter(record => !!record)

      return { ...state, list: newData }
    },

    onMemberReset (state, action) {
      const { searchText, tmpMemberList } = action.payload
      const reg = new RegExp(searchText, 'gi')
      let newData

      newData = tmpMemberList.map((record) => {
        const match = record.memberName.match(reg)
        if (!match) {
          return null
        }
        return {
          ...record
        }
      }).filter(record => !!record)

      return { ...state, listMember: newData, searchText }
    },

    onUnitReset (state, action) {
      const { searchText, tmpMemberUnit } = action.payload
      const reg = new RegExp(searchText, 'gi')
      let newData

      newData = tmpMemberUnit.map((record) => {
        const match = record.memberName.match(reg)
        if (!match) {
          return null
        }
        return {
          ...record
        }
      }).filter(record => !!record)

      return { ...state, listUnit: newData, searchText }
    },

    onMechanicReset (state, action) {
      const { searchText, tmpMechanicList } = action.payload
      const reg = new RegExp(searchText, 'gi')
      let newData

      newData = tmpMechanicList.map((record) => {
        const match = record.employeeName.match(reg)
        if (!match) {
          return null
        }
        return {
          ...record
        }
      }).filter(record => !!record)

      return { ...state, listMechanic: newData, searchText }
    },

    onServiceReset (state, action) {
      const { searchText, tmpServiceList } = action.payload
      const reg = new RegExp(searchText, 'gi')
      let newData

      newData = tmpServiceList.map((record) => {
        const match = record.serviceName.match(reg)
        if (!match) {
          return null
        }
        return {
          ...record
        }
      }).filter(record => !!record)

      return { ...state, listService: newData, searchText }
    },

    onProductReset (state, action) {
      const { searchText, tmpProductList } = action.payload
      const reg = new RegExp(searchText, 'gi')
      let newData

      newData = tmpProductList.map((record) => {
        const match = record.productName.match(reg)
        if (!match) {
          return null
        }
        return {
          ...record
        }
      }).filter(record => !!record)

      return { ...state, listProduct: newData, searchText }
    },

    //------------------

    setCurTime (state, action) {
      return { curTime: action.payload.curTime }
    },

    setCurRecord () {
      return { curRecord: 1 }
    },

    setTotalItem (state, action) {
      return { ...state, itemPayment: action.payload }
    },

    setTotalItemService (state, action) {
      return { ...state, itemService: action.payload }
    },

    setTotalItemConsignment (state, action) {
      return { ...state, itemConsignment: action.payload }
    },

    changeQueue (state, action) {
      let listQueue = localStorage.getItem('queue') ? JSON.parse(localStorage.getItem('queue')) : {}
      listQueue = _.get(listQueue, `queue${action.payload.queue}`) ? _.get(listQueue, `queue${action.payload.queue}`) : []
      return { ...state, listQueue, curQueue: action.payload.queue }
    },
    setListPaymentDetail (state, action) {
      return { ...state, listPaymentDetail: { id: action.payload.transNo } }
    },
    searchPOS (state, action) {
      return { ...state, listPayment: action.payload }
    },
    setNullUnit (state, action) {
      const { memberUnit } = action.payload
      localStorage.setItem('memberUnit', JSON.stringify(memberUnit))
      return { ...state, memberUnitInfo: memberUnit }
    }
  }
}
