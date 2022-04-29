import pathToRegexp from 'path-to-regexp'
import { parse } from 'qs'
import { Modal, message } from 'antd'
import moment from 'moment'
import { lstorage, variables } from 'utils'
import { prefix } from 'utils/config.main'
import { allowPrint } from 'utils/validation'
// import { numberFormatter } from 'utils/string'
import {
  TYPE_PEMBELIAN_UMUM,
  TYPE_PEMBELIAN_GRABFOOD,
  TYPE_PEMBELIAN_GRABMART
} from 'utils/variable'
import { queryPaymentSplit } from 'services/payment/payment'
import { queryGrabmartCode } from 'services/grabmart/grabmartOrder'
import { queryProduct } from 'services/grab/grabConsignment'
import { query as queryAdvertising } from 'services/marketing/advertising'
import { validateVoucher } from '../../services/marketing/voucher'
import { groupProduct } from '../../routes/transaction/pos/utils'
import { queryById as queryStoreById } from '../../services/store/store'
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
import { query as queryService, queryById as queryServiceById } from '../../services/master/service'
import { query as queryUnit, getServiceReminder, getServiceUsageReminder } from '../../services/units'
import { queryCurrentOpenCashRegister, queryCashierTransSource, cashRegister } from '../../services/setting/cashier'

const { insertCashierTrans, insertConsignment, reArrangeMember } = variables

const {
  getCashierTrans, getBundleTrans, getServiceTrans, getConsignment,
  setCashierTrans, setServiceTrans, setConsignment,
  getVoucherList, setVoucherList,
  getGrabmartOrder, setGrabmartOrder
} = lstorage

const { updateCashierTrans } = cashierService

const getDiscountByProductCode = (currentGrabOrder, productCode) => {
  let discount = 0
  const filteredCampaign = currentGrabOrder
    .campaignItem
    .filter((filtered) => {
      if (!filtered) return false
      const splitTheObject = filtered.split('-')
      if (splitTheObject
        && splitTheObject.length === 3
        && splitTheObject[2] === productCode) {
        return true
      }
      return false
    })
  if (filteredCampaign && filteredCampaign[0]) {
    const filteredCampaignOrder = currentGrabOrder
      .campaigns
      .filter((filtered) => {
        if (filtered && filtered.appliedItemIDs && filtered.appliedItemIDs.length > 0) {
          const selectedAppliedItems = filtered.appliedItemIDs.filter((filtered) => {
            if (!filtered) return false
            const splitTheObject = filtered.split('-')
            if (splitTheObject
              && splitTheObject.length === 3
              && splitTheObject[2] === productCode) {
              return true
            }
            return false
          })
          if (selectedAppliedItems && selectedAppliedItems[0]) {
            return true
          }
          return false
        }
        return false
      })
    if (filteredCampaignOrder
      && filteredCampaignOrder[0]
      && filteredCampaignOrder[0].deductedAmount > 0) {
      discount = filteredCampaignOrder[0].deductedAmount / 100
    }
  }
  return discount
}

export default {

  namespace: 'pos',

  state: {
    currentBundlePayment: {},
    listVoucher: getVoucherList(),
    modalVoucherVisible: false,
    standardInvoice: true,
    modalGrabmartCodeVisible: false,
    modalGrabmartCodeItem: {},
    currentGrabOrder: {},
    currentReplaceBundle: {},
    currentBuildComponent: {},
    list: [],
    dataReward: [],
    currentCategory: [],
    tmpList: [],
    listAdvertising: [],
    listAdvertisingCustomer: [],
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
    currentStore: {},
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
    modalCashRegisterVisible: false,
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
    modalBundleCategoryVisible: false,
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
    listPaymentShortcut: [],
    selectedPaymentShortcut: {},
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
        let match = pathToRegexp('/transaction/pos/invoice/:id').exec(location.pathname)
        const matchAdmin = pathToRegexp('/transaction/pos/admin-invoice/:id').exec(location.pathname)
        if (matchAdmin) {
          dispatch({
            type: 'updateState',
            payload: {
              standardInvoice: false
            }
          })
          match = matchAdmin
        } else {
          dispatch({
            type: 'updateState',
            payload: {
              standardInvoice: true
            }
          })
        }
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
        if (location.pathname === '/transaction/pos/customer-view') {
          dispatch({
            type: 'getStore'
          })
          dispatch({
            type: 'getAdvertisingCustomer'
          })
        }
        if (location.pathname === '/transaction/pos') {
          dispatch({ type: 'getAdvertising' })
          dispatch({ type: 'setCurrentBuildComponent' })
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
          dispatch({
            type: 'getGrabmartOrder'
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
    * getAdvertising (payload, { call, put }) {
      yield put({
        type: 'updateState',
        payload: {
          listAdvertising: []
        }
      })
      const response = yield call(queryAdvertising, {
        type: 'all',
        typeAds: 'CASHIER',
        order: 'sort'
      })
      if (response && response.success) {
        yield put({
          type: 'updateState',
          payload: {
            listAdvertising: response.data
          }
        })
      } else {
        throw response
      }
    },

    * getAdvertisingCustomer (payload, { call, put }) {
      yield put({
        type: 'updateState',
        payload: {
          listAdvertisingCustomer: []
        }
      })
      const response = yield call(queryAdvertising, {
        type: 'all',
        typeAds: 'CUSTVIEW',
        order: 'sort'
      })
      if (response && response.success) {
        yield put({
          type: 'updateState',
          payload: {
            listAdvertisingCustomer: response.data
          }
        })
      } else {
        throw response
      }
    },

    * validateVoucher ({ payload = {} }, { call, put }) {
      if (!payload || (payload && !payload.code) || (payload && payload.code && payload.code.length < 5)) {
        message.error('Code must provided')
        return
      }
      const response = yield call(validateVoucher, payload)
      if (response && response.success && response.data) {
        const listVoucher = getVoucherList()
        const exists = listVoucher.length > 0 ? listVoucher.filter(filtered => filtered.generatedCode === payload.code).length > 0 : false
        if (exists) {
          message.error('Voucher already exists')
          return
        }
        listVoucher.push({
          ...response.data.header,
          voucherId: response.data.header.id,
          ...response.data.detail
        })
        setVoucherList(JSON.stringify(listVoucher))
        yield put({
          type: 'updateState',
          payload: {
            listVoucher,
            modalVoucherVisible: false
          }
        })
      } else {
        throw response
      }
    },

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

    * paymentEdit ({ payload }, { select, put }) {
      const currentBuildComponent = yield select(({ pos }) => (pos ? pos.currentBuildComponent : {}))
      let dataPos = getCashierTrans()
      dataPos[payload.no - 1] = payload
      setCashierTrans(JSON.stringify(dataPos))
      if (currentBuildComponent && currentBuildComponent.no) {
        const service = getServiceTrans()
        if (service && service.length > 0) {
          const serviceSelected = service.filter(filtered => filtered.code === 'TDF')
          if (serviceSelected && serviceSelected[0]) {
            yield put({
              type: 'setServiceDiff',
              payload: {
                item: serviceSelected[0]
              }
            })
          } else {
            yield put({
              type: 'setNewServiceDiff'
            })
          }
        } else {
          yield put({
            type: 'setNewServiceDiff'
          })
        }
      }
      yield put({ type: 'hidePaymentModal' })
      yield put({ type: 'setCurTotal' })
    },

    * serviceEdit ({ payload }, { put }) {
      let dataService = localStorage.getItem('service_detail') ? JSON.parse(localStorage.getItem('service_detail')) : []
      dataService[payload.no - 1] = payload
      setServiceTrans(JSON.stringify(dataService))
      yield put({ type: 'hideServiceModal' })
      yield put({ type: 'setCurTotal' })
    },

    * consignmentEdit ({ payload }, { put }) {
      let dataConsignment = localStorage.getItem('consignment') ? JSON.parse(localStorage.getItem('consignment')) : []
      if (payload && payload.qty > payload.stock) {
        Modal.confirm({
          title: 'Out of Stock',
          content: 'Out of Stock'
        })
        return
      }
      dataConsignment[payload.no - 1] = payload
      setConsignment(JSON.stringify(dataConsignment))
      yield put({ type: 'hideConsignmentModal' })
      yield put({ type: 'setCurTotal' })
    },

    * changeDineIn ({ payload }, { select, put }) {
      const currentGrabOrder = getGrabmartOrder()
      const memberInformation = yield select(({ pos }) => pos.memberInformation)
      const currentBuildComponent = yield select(({ pos }) => pos.currentBuildComponent)
      const { typePembelian, selectedPaymentShortcut } = payload
      let dataConsignment = localStorage.getItem('consignment') ? JSON.parse(localStorage.getItem('consignment')) : []
      let dataPos = localStorage.getItem('cashier_trans') ? JSON.parse(localStorage.getItem('cashier_trans')) : []
      if (selectedPaymentShortcut
        && selectedPaymentShortcut.sellPrice
        // eslint-disable-next-line eqeqeq
        && selectedPaymentShortcut.memberId == 0) {
        for (let key in dataPos) {
          const item = dataPos[key]
          if (!item.bundleId) {
            dataPos[key].discount = getDiscountByProductCode(currentGrabOrder, item.code)
          }
          dataPos[key].sellPrice = item[selectedPaymentShortcut.sellPrice] ? item[selectedPaymentShortcut.sellPrice] : item.price
          dataPos[key].price = item[selectedPaymentShortcut.sellPrice] ? item[selectedPaymentShortcut.sellPrice] : item.price
          dataPos[key].total = (dataPos[key].sellPrice * item.qty) - dataPos[key].discount
        }
      }
      // eslint-disable-next-line eqeqeq
      if (selectedPaymentShortcut && selectedPaymentShortcut.memberId == 1) {
        for (let key in dataPos) {
          const item = dataPos[key]
          if (memberInformation.memberSellPrice === 'sellPrice') {
            memberInformation.memberSellPrice = 'retailPrice'
          }
          if (!item.bundleId) {
            dataPos[key].discount = getDiscountByProductCode(currentGrabOrder, item.code)
          }
          dataPos[key].sellPrice = item[memberInformation.memberSellPrice.toString()] == null ? item.price : item[memberInformation.memberSellPrice.toString()]
          dataPos[key].price = item[memberInformation.memberSellPrice.toString()] == null ? item.price : item[memberInformation.memberSellPrice.toString()]
          dataPos[key].total = (dataPos[key].sellPrice * item.qty) - dataPos[key].discount
        }
      }

      let typePrice = 'originalSellPrice'
      if (typePembelian === TYPE_PEMBELIAN_GRABFOOD) {
        typePrice = 'otherSellPrice'
      }
      if (typePembelian === TYPE_PEMBELIAN_GRABMART) {
        typePrice = 'martSellPrice'
      }
      if (dataConsignment && dataConsignment.length) {
        for (let key in dataConsignment) {
          const item = dataConsignment[key]
          dataConsignment[key].sellPrice = item[typePrice] == null ? item.price : item[typePrice]
          dataConsignment[key].price = item[typePrice] == null ? item.price : item[typePrice]
          dataConsignment[key].total = dataConsignment[key].sellPrice * item.qty
        }
      }
      setConsignment(JSON.stringify(dataConsignment))
      setCashierTrans(JSON.stringify(dataPos))

      if (currentBuildComponent && currentBuildComponent.no) {
        const service = getServiceTrans()
        if (service && service.length > 0) {
          const serviceSelected = service.filter(filtered => filtered.code === 'TDF')
          if (serviceSelected && serviceSelected[0]) {
            yield put({
              type: 'setServiceDiff',
              payload: {
                item: serviceSelected[0]
              }
            })
          } else {
            yield put({
              type: 'setNewServiceDiff'
            })
          }
        } else {
          yield put({
            type: 'setNewServiceDiff'
          })
        }
      }
      yield put({ type: 'hideConsignmentModal' })
      yield put({ type: 'setCurTotal' })
    },

    * paymentDelete ({ payload }, { select, put }) {
      const currentBuildComponent = yield select(({ pos }) => (pos ? pos.currentBuildComponent : {}))
      let dataPos = getCashierTrans()
      let arrayProd = dataPos
        // eslint-disable-next-line eqeqeq
        .filter(filtered => filtered.no != payload.Record)
        .map((item, index) => ({ ...item, no: index + 1 }))
      if (arrayProd.length === 0) {
        localStorage.removeItem('cashier_trans')
        yield put({
          type: 'setCurTotal'
        })
        yield put({
          type: 'hidePaymentModal'
        })
      } else {
        setCashierTrans(JSON.stringify(arrayProd))
        yield put({
          type: 'setCurTotal'
        })
        yield put({
          type: 'hidePaymentModal'
        })
      }
      if (currentBuildComponent && currentBuildComponent.no) {
        const service = getServiceTrans()
        if (service && service.length > 0) {
          const serviceSelected = service.filter(filtered => filtered.code === 'TDF')
          if (serviceSelected && serviceSelected[0]) {
            yield put({
              type: 'setServiceDiff',
              payload: {
                item: serviceSelected[0]
              }
            })
          } else {
            yield put({
              type: 'setNewServiceDiff'
            })
          }
        } else {
          yield put({
            type: 'setNewServiceDiff'
          })
        }
      }
    },

    * serviceDelete ({ payload }, { put }) {
      let dataPos = localStorage.getItem('service_detail') ? JSON.parse(localStorage.getItem('service_detail')) : []
      let arrayProd = dataPos
        // eslint-disable-next-line eqeqeq
        .filter(filtered => filtered.no != payload.Record)
        .map((item, index) => ({ ...item, no: index + 1 }))
      if (arrayProd.length === 0) {
        localStorage.removeItem('service_detail')
        yield put({
          type: 'setCurTotal'
        })
        yield put({
          type: 'hideServiceListModal'
        })
      } else {
        setServiceTrans(JSON.stringify(arrayProd))
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
      let arrayProd = dataPos
        // eslint-disable-next-line eqeqeq
        .filter(filtered => filtered.no != payload.Record)
        .map((item, index) => ({ ...item, no: index + 1 }))
      if (arrayProd.length === 0) {
        localStorage.removeItem('consignment')
        yield put({
          type: 'setCurTotal'
        })
        yield put({
          type: 'hideConsignmentListModal'
        })
      } else {
        setConsignment(JSON.stringify(arrayProd))
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

    * setDefaultPaymentShortcut (payload, { put }) {
      const listPaymentShortcut = lstorage.getPaymentShortcut()
      let selectedPaymentShortcut = lstorage.getPaymentShortcutSelected()

      if (listPaymentShortcut && listPaymentShortcut.length > 0) {
        selectedPaymentShortcut = listPaymentShortcut[0]
      }

      yield put({
        type: 'updateState',
        payload: {
          selectedPaymentShortcut
        }
      })
    },

    * getStore (payload, { call, put }) {
      const data = yield call(queryStoreById, { id: lstorage.getCurrentUserStore() })
      if (data.success && data.data) {
        yield put({
          type: 'updateState',
          payload: {
            currentStore: data.data
          }
        })
      }
    },

    * getGrabmartOrder (payload, { put }) {
      const currentGrabOrder = getGrabmartOrder()
      yield put({
        type: 'updateState',
        payload: {
          currentGrabOrder
        }
      })
    },

    * setPaymentShortcut ({ payload = {} }, { put }) {
      const { item } = payload
      const listPaymentShortcut = lstorage.getPaymentShortcut()
      let selectedPaymentShortcut = lstorage.getPaymentShortcutSelected()
      if (item && item.id) {
        lstorage.setPaymentShortcutSelected(item)
        selectedPaymentShortcut = item
      }

      if (selectedPaymentShortcut && !selectedPaymentShortcut.id &&
        listPaymentShortcut && listPaymentShortcut.length > 0) {
        selectedPaymentShortcut = listPaymentShortcut[0]
      }
      yield put({
        type: 'updateState',
        payload: {
          listPaymentShortcut,
          selectedPaymentShortcut
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
      const data = yield call(queryDetail, {
        id: payload.id
      })
      const consignment = yield call(queryDetailConsignment, {
        id: payload.id
      })
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
          if (data.pos[n].typeCode === 'P') {
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
          } else if (data.pos[n].typeCode === 'S') {
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
        payload.type = 'all'
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
    * checkQuantityEditProduct ({ payload = {} }, { call, put }) {
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

    * checkQuantityNewProduct ({ payload }, { select, call, put }) {
      const currentBuildComponent = yield select(({ pos }) => (pos ? pos.currentBuildComponent : {}))
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
      let totalQty = Quantity.reduce((cnt, o) => cnt + parseFloat(o.qty), 0)
      // Call Products
      const storeInfo = localStorage.getItem(`${prefix}store`) ? JSON.parse(localStorage.getItem(`${prefix}store`)) : {}
      const listProductData = yield call(queryPOSproduct, { from: storeInfo.startPeriod, to: moment().format('YYYY-MM-DD'), product: data.productId })
      let arrayProd = getCashierTrans()
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
      const current = arrayProd.reduce((prev, next) => {
        if (next.code === data.code) {
          return prev + next.qty
        }
        return prev
      }, 0)
      totalQty += current
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
        if (currentBuildComponent && currentBuildComponent.no) {
          const service = getServiceTrans()
          if (service && service.length > 0) {
            const serviceSelected = service.filter(filtered => filtered.code === 'TDF')
            if (serviceSelected && serviceSelected[0]) {
              yield put({
                type: 'setServiceDiff',
                payload: {
                  item: serviceSelected[0]
                }
              })
            } else {
              yield put({
                type: 'setNewServiceDiff'
              })
            }
          } else {
            yield put({
              type: 'setNewServiceDiff'
            })
          }
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

    * chooseConsignment ({ payload }, { select, put, call }) {
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

      const productInfo = yield call(queryProduct, {
        storeId: lstorage.getCurrentUserStore(),
        productId: item.product_id
      })

      if (productInfo && productInfo.success && productInfo.data) {
        // if (productInfo.data && productInfo.data.price !== item.price) {
        //   Modal.error({
        //     title: 'Price from server and local is different, Call your admin/vendor',
        //     content: `Local Price: ${numberFormatter(productInfo.data.price)}, Server Price: ${numberFormatter(item.price)}`
        //   })
        //   return
        // }
        if (productInfo.data && productInfo.data.price) {
          item.price_grabmart = productInfo && productInfo.success && productInfo.data ? productInfo.data.price + productInfo.data.commission : item.price_grabmart
          item.commissionGrab = productInfo && productInfo.success && productInfo.data ? productInfo.data.commission : 0
        }
      } else {
        item.commissionGrab = 0
      }


      const data = {
        no: arrayProd.length + 1,
        code: item.product.product_code,
        stock: item.quantity,
        productId: item.id,
        name: item.product.product_name,
        oldValue: item.oldValue,
        newValue: item.newValue,
        retailPrice: item.sellPrice,
        distPrice01: item.distPrice01,
        distPrice02: item.distPrice02,
        distPrice03: item.distPrice03,
        distPrice04: item.distPrice04,
        distPrice05: item.distPrice05,
        distPrice06: item.distPrice06,
        distPrice07: item.distPrice07,
        distPrice08: item.distPrice08,
        qty: 1,
        sellPrice: item[typePrice] == null ? item.price : item[typePrice],
        otherSellPrice: item.price_grabfood_gofood,
        martSellPrice: item.price_grabmart,
        originalSellPrice: item.price,
        commissionGrab: item.commissionGrab,
        price: item[typePrice] == null ? item.price : item[typePrice],
        discount: 0,
        disc1: 0,
        disc2: 0,
        disc3: 0,
        total: item[typePrice] == null ? item.price : item[typePrice]
      }
      arrayProd.push(data)
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

    // Add
    // listReward.push({
    //   initialValue: {
    //     key: item.productId,
    //     label: item.name
    //   },
    //   label: currentCategory[0],
    //   key: indexCount,
    //   item
    // })

    // Edit
    // listReward.push({
    //   initialValue: {
    //     key: item.productId,
    //     label: item.name
    //   },
    //   label: currentCategory[0],
    //   key: indexCount,
    //   item
    // })

    * openBundleCategory ({ payload = {} }, { call, put }) {
      const { currentBundle, mode /* bundleId */ } = payload
      // const dataBundle = getBundleTrans()
      const dataPos = getCashierTrans()
      const dataService = getServiceTrans()
      if (currentBundle && currentBundle.rewardCategory && currentBundle.rewardCategory.length > 0) {
        const currentCategory = currentBundle.rewardCategory.filter(filtered => filtered.categoryCode)
        if (currentCategory && currentCategory.length > 0) {
          let listReward = []
          let indexCount = 0

          for (let key in currentCategory) {
            const item = currentCategory[key]
            let listFormItem = []
            if (item.type === 'P') {
              const params = {
                categoryCode: item.categoryCode,
                type: 'all'
              }


              const response = yield call(queryProductStock, params)
              let listProduct = response.data
              const storeInfo = localStorage.getItem(`${prefix}store`) ? JSON.parse(localStorage.getItem(`${prefix}store`)) : {}
              const newData = listProduct.map(x => x.id)

              const listProductData = yield call(queryPOSproduct, { from: storeInfo.startPeriod, to: moment().format('YYYY-MM-DD'), product: (newData || []).toString() })
              if (listProductData.success) {
                listFormItem = listProduct.map((record) => {
                  const filteredProduct = listProductData.data.filter(filtered => filtered.productId === record.id)
                  if (filteredProduct && filteredProduct[0]) {
                    return ({
                      ...record,
                      count: filteredProduct[0].count,
                      countIn: filteredProduct[0].countIn,
                      countOut: filteredProduct[0].countOut,
                      amount: filteredProduct[0].amount
                    })
                  }
                  return ({
                    ...record,
                    count: 0,
                    countIn: 0,
                    countOut: 0,
                    amount: 0
                  })
                })
              }
            } else if (item.type === 'S') {
              const params = {
                serviceTypeId: item.categoryCode,
                type: 'all'
              }
              const response = yield call(queryService, params)
              if (response.data) {
                listFormItem = response.data
              }
            }
            if (mode === 'add') {
              if (item.type === 'P') {
                const filteredProduct = dataPos.filter(filtered => filtered.categoryCode === item.categoryCode && filtered.bundleId === item.bundleId)
                for (let index in filteredProduct) {
                  const product = filteredProduct[index]
                  for (let ind = 0; ind < product.qty; ind += 1) {
                    listReward.push({
                      initialValue: {
                        key: product.productId,
                        label: product.name
                      },
                      label: {
                        productName: item.productName
                      },
                      key: indexCount,
                      item,
                      listItem: listFormItem
                    })
                    console.log('listReward', listReward)
                    indexCount += 1
                  }
                }
              } else if (item.type === 'S') {
                const filteredProduct = dataService.filter(filtered => filtered.categoryCode === item.categoryCode && filtered.bundleId === item.bundleId)
                for (let index in filteredProduct) {
                  const product = filteredProduct[index]
                  for (let ind = 0; ind < product.qty; ind += 1) {
                    listReward.push({
                      initialValue: {
                        key: product.productId,
                        label: product.name
                      },
                      label: {
                        productName: item.productName
                      },
                      key: indexCount,
                      item,
                      listItem: listFormItem
                    })
                    indexCount += 1
                  }
                }
              }
              for (let index = 0; index < item.qty; index += 1) {
                listReward.push({
                  label: {
                    productName: item.productName
                  },
                  key: indexCount,
                  item,
                  listItem: listFormItem
                })
                indexCount += 1
              }
              console.log('listReward', listReward)
            } else if (mode === 'edit') {
              if (item.type === 'P') {
                const filteredProduct = dataPos.filter(filtered => filtered.categoryCode === item.categoryCode && filtered.bundleId === item.bundleId)
                for (let index in filteredProduct) {
                  const product = filteredProduct[index]
                  for (let ind = 0; ind < product.qty; ind += 1) {
                    listReward.push({
                      initialValue: {
                        key: product.productId,
                        label: product.name
                      },
                      label: {
                        productName: item.productName
                      },
                      key: indexCount,
                      item,
                      listItem: listFormItem
                    })
                    console.log('listReward', listReward)
                    indexCount += 1
                  }
                }
              } else if (item.type === 'S') {
                const filteredProduct = dataService.filter(filtered => filtered.categoryCode === item.categoryCode && filtered.bundleId === item.bundleId)
                for (let index in filteredProduct) {
                  const product = filteredProduct[index]
                  for (let ind = 0; ind < product.qty; ind += 1) {
                    listReward.push({
                      initialValue: {
                        key: product.productId,
                        label: product.name
                      },
                      label: {
                        productName: item.productName
                      },
                      key: indexCount,
                      item,
                      listItem: listFormItem
                    })
                    indexCount += 1
                  }
                }
              }
              currentBundle.id = currentBundle.bundleId
              yield put({
                type: 'pospromo/updateState',
                payload: {
                  bundleData: {
                    mode: 'edit',
                    item: currentBundle,
                    currentBundle: getBundleTrans()
                  }
                }
              })
            }
          }

          yield put({
            type: 'updateState',
            payload: {
              currentCategory,
              dataReward: listReward,
              modalBundleCategoryVisible: true
            }
          })
        }
      }
    },

    * chooseProductPromo ({ payload = {} }, { select, call, put }) {
      const { listProductQty } = payload
      const listProductId = listProductQty ? listProductQty.map(item => item.item.id) : []
      if (listProductId.length === 0) {
        message.error('List Product is not found')
        return
      }
      const storeInfo = localStorage.getItem(`${prefix}store`) ? JSON.parse(localStorage.getItem(`${prefix}store`)) : {}
      const listProductData = yield call(queryPOSproduct, { from: storeInfo.startPeriod, to: moment().format('YYYY-MM-DD'), product: listProductId.toString() })
      if (listProductData && listProductData.success && listProductQty && listProductQty.length > 0) {
        let success = false
        let message = ''
        const dataPos = getCashierTrans()
        for (let key in listProductQty) {
          const { item } = listProductQty[key]
          const filteredStock = listProductData.data.filter(filtered => filtered.productId === item.id)
          const existsQty = dataPos
            .filter(filtered => filtered.productId === item.id && filtered.categoryCode !== item.categoryCode)
            .reduce((prev, next) => prev + next.qty, 0)
          if (filteredStock && filteredStock[0]) {
            const totalQty = listProductQty[key].qty + existsQty
            if (filteredStock[0].count >= totalQty) {
              success = true
            } else {
              success = false
              message = `Your input: ${existsQty + listProductQty[key].qty} Available: ${filteredStock[0].count}`
              break
            }
          } else {
            success = false
            message = `Your input: ${existsQty + listProductQty[key].qty} Available: Not Found`
            break
          }
        }
        if (!success) {
          Modal.warning({
            title: 'No available stock',
            content: message
          })
        } else {
          const currentBundle = getBundleTrans()
          // const currentReward = yield select(({ pospromo }) => pospromo.currentReward)
          const bundleData = yield select(({ pospromo }) => pospromo.bundleData)
          const resultCompareBundle = currentBundle.filter(filtered => filtered.bundleId === bundleData.item.id)
          const exists = resultCompareBundle ? resultCompareBundle[0] : undefined
          if (payload.reset) {
            payload.reset()
          }
          if (!payload.hasService) {
            if (bundleData.mode !== 'edit') {
              if (exists) {
                yield put({
                  type: 'pospromo/setBundleAlreadyExists',
                  payload: bundleData
                })
              } else {
                yield put({
                  type: 'pospromo/setBundleNeverExists',
                  payload: bundleData
                })
              }
            }
          }

          const memberInformation = yield select(({ pos }) => pos.memberInformation)
          const selectedPaymentShortcut = yield select(({ pos }) => (pos ? pos.selectedPaymentShortcut : {}))
          const mechanicInformation = yield select(({ pos }) => pos.mechanicInformation)
          let arrayProd = dataPos
            .map((item) => {
              for (let key in listProductQty) {
                const currentReward = listProductQty[key]
                if (item.bundleId === currentReward.reward.item.bundleId && item.categoryCode === currentReward.reward.item.categoryCode) {
                  return ({
                    ...item,
                    no: null
                  })
                }
              }
              return item
            })
            .filter(filtered => filtered.no)
            .map((item, index) => ({ ...item, no: index + 1 }))
          for (let key in listProductQty) {
            const item = listProductQty[key]
            const currentReward = item.reward.item

            if (currentReward && currentReward.categoryCode && currentReward.type === 'P') {
              item.item.sellPrice = currentReward.sellPrice
              item.item.distPrice01 = currentReward.distPrice01
              item.item.distPrice02 = currentReward.distPrice02
              item.item.distPrice03 = currentReward.distPrice03
              item.item.distPrice04 = currentReward.distPrice04
              item.item.distPrice05 = currentReward.distPrice05
              item.item.distPrice06 = currentReward.distPrice06
              item.item.distPrice07 = currentReward.distPrice07
              item.item.distPrice08 = currentReward.distPrice08
            }
            let selectedPrice = memberInformation.memberSellPrice ? item.item[memberInformation.memberSellPrice.toString()] : item.item.sellPrice
            if (selectedPaymentShortcut
              && selectedPaymentShortcut.sellPrice
              // eslint-disable-next-line eqeqeq
              && selectedPaymentShortcut.memberId == 0) {
              selectedPrice = item.item[selectedPaymentShortcut.sellPrice] ? item.item[selectedPaymentShortcut.sellPrice] : item.item.sellPrice
            }
            const dataProduct = {
              no: arrayProd.length + 1,
              categoryCode: currentReward && currentReward.categoryCode && currentReward.type === 'P' ? currentReward.categoryCode : undefined,
              bundleId: currentReward && currentReward.categoryCode && currentReward.type === 'P' ? currentReward.bundleId : undefined,
              bundleCode: currentReward && currentReward.categoryCode && currentReward.type === 'P' ? currentReward.bundleCode : undefined,
              bundleName: currentReward && currentReward.categoryCode && currentReward.type === 'P' ? currentReward.bundleName : undefined,
              hide: currentReward && currentReward.categoryCode && currentReward.type === 'P' ? currentReward.hide : undefined,
              replaceable: currentReward && currentReward.categoryCode && currentReward.type === 'P' ? currentReward.replaceable : undefined,
              code: item.item.productCode,
              productId: item.item.id,
              name: item.item.productName,
              oldValue: item.item.oldValue,
              newValue: item.item.newValue,
              retailPrice: item.item.sellPrice,
              distPrice01: item.item.distPrice01,
              distPrice02: item.item.distPrice02,
              distPrice03: item.item.distPrice03,
              distPrice04: item.item.distPrice04,
              distPrice05: item.item.distPrice05,
              distPrice06: item.item.distPrice06,
              distPrice07: item.item.distPrice07,
              distPrice08: item.item.distPrice08,
              employeeId: mechanicInformation.employeeId,
              employeeName: `${mechanicInformation.employeeName} (${mechanicInformation.employeeCode})`,
              typeCode: 'P',
              qty: item.qty,
              sellPrice: selectedPrice,
              price: selectedPrice,
              discount: 0,
              disc1: 0,
              disc2: 0,
              disc3: 0,
              total: selectedPrice * item.qty
            }
            arrayProd.push(dataProduct)
          }

          setCashierTrans(JSON.stringify(arrayProd))

          const productData = yield select(({ pospromo }) => pospromo.productData)
          const serviceData = yield select(({ pospromo }) => pospromo.serviceData)

          if (productData && productData.currentProduct && bundleData.mode !== 'edit') {
            yield put({
              type: 'pospromo/setProductPos',
              payload: {
                currentProduct: arrayProd,
                currentReward: productData.currentReward
              }
            })
          }
          if (serviceData && serviceData.currentProduct && bundleData.mode !== 'edit') {
            yield put({
              type: 'pospromo/setServicePos',
              payload: {
                currentProduct: getServiceTrans(),
                currentReward: serviceData.currentReward
              }
            })
          }

          if (payload.hasService) {
            yield put({
              type: 'pos/chooseServicePromo',
              payload: {
                hasProduct: true,
                listProductQty: payload.listServiceQty,
                reset: payload.reset
              }
            })
          } else {
            yield put({
              type: 'setCurTotal'
            })

            yield put({
              type: 'pospromo/updateState',
              payload: {
                currentReward: {},
                bundleData: {},
                listCategory: [],
                productData: {},
                serviceData: {}
              }
            })

            yield put({
              type: 'pos/updateState',
              payload: {
                bundleData: {},
                listCategory: [],
                dataReward: [],
                currentCategory: [],
                modalBundleCategoryVisible: false
              }
            })
          }
        }
      }
    },

    * chooseServicePromo ({ payload = {} }, { select, put }) {
      const { listProductQty } = payload
      const listProductId = listProductQty ? listProductQty.map(item => item.item.id) : []
      if (listProductId.length === 0) {
        message.error('List Service is not found')
        return
      }
      if (listProductQty && listProductQty.length > 0) {
        const dataService = getServiceTrans()

        const currentBundle = getBundleTrans()
        const bundleData = yield select(({ pospromo }) => pospromo.bundleData)
        const resultCompareBundle = currentBundle.filter(filtered => filtered.bundleId === bundleData.item.id)
        const exists = resultCompareBundle ? resultCompareBundle[0] : undefined
        if (payload.reset) {
          payload.reset()
        }
        if (bundleData.mode !== 'edit') {
          if (exists) {
            yield put({
              type: 'pospromo/setBundleAlreadyExists',
              payload: bundleData
            })
          } else {
            yield put({
              type: 'pospromo/setBundleNeverExists',
              payload: bundleData
            })
          }
        }

        let arrayProd = dataService
          .map((item) => {
            for (let key in listProductQty) {
              const currentReward = listProductQty[key]
              if (item.bundleId === currentReward.reward.item.bundleId && item.categoryCode === currentReward.reward.item.categoryCode) {
                return ({
                  ...item,
                  no: null
                })
              }
            }
            return item
          })
          .filter(filtered => filtered.no)
          .map((item, index) => ({ ...item, no: index + 1 }))

        const memberInformation = yield select(({ pos }) => pos.memberInformation)
        const selectedPaymentShortcut = yield select(({ pos }) => (pos ? pos.selectedPaymentShortcut : {}))
        const mechanicInformation = yield select(({ pos }) => pos.mechanicInformation)
        for (let key in listProductQty) {
          const item = listProductQty[key]
          const currentReward = item.reward.item
          if (currentReward && currentReward.categoryCode && currentReward.type === 'S') {
            item.item.sellPrice = currentReward.sellPrice
            item.item.distPrice01 = currentReward.distPrice01
            item.item.distPrice02 = currentReward.distPrice02
            item.item.distPrice03 = currentReward.distPrice03
            item.item.distPrice04 = currentReward.distPrice04
            item.item.distPrice05 = currentReward.distPrice05
            item.item.distPrice06 = currentReward.distPrice06
            item.item.distPrice07 = currentReward.distPrice07
            item.item.distPrice08 = currentReward.distPrice08
          } else {
            item.item.sellPrice = item.item.serviceCost
            item.item.distPrice01 = item.item.serviceCost
            item.item.distPrice02 = item.item.serviceCost
            item.item.distPrice03 = item.item.serviceCost
            item.item.distPrice04 = item.item.serviceCost
            item.item.distPrice05 = item.item.serviceCost
            item.item.distPrice06 = item.item.serviceCost
            item.item.distPrice07 = item.item.serviceCost
            item.item.distPrice08 = item.item.serviceCost
          }
          let selectedPrice = memberInformation.memberSellPrice ? item.item[memberInformation.memberSellPrice.toString()] : item.item.serviceCost
          if (selectedPaymentShortcut
            && selectedPaymentShortcut.sellPrice
            // eslint-disable-next-line eqeqeq
            && selectedPaymentShortcut.memberId == 0) {
            selectedPrice = item.item[selectedPaymentShortcut.sellPrice] ? item.item[selectedPaymentShortcut.sellPrice] : item.item.serviceCost
          }

          const dataService = {
            no: arrayProd.length + 1,
            categoryCode: currentReward && currentReward.categoryCode && currentReward.type === 'S' ? currentReward.categoryCode : undefined,
            bundleId: currentReward && currentReward.categoryCode && currentReward.type === 'S' ? currentReward.bundleId : undefined,
            bundleCode: currentReward && currentReward.categoryCode && currentReward.type === 'S' ? currentReward.bundleCode : undefined,
            bundleName: currentReward && currentReward.categoryCode && currentReward.type === 'S' ? currentReward.bundleName : undefined,
            hide: currentReward && currentReward.categoryCode && currentReward.type === 'S' ? currentReward.hide : undefined,
            replaceable: currentReward && currentReward.categoryCode && currentReward.type === 'S' ? currentReward.replaceable : undefined,
            code: item.item.serviceCode,
            productId: item.item.id,
            name: item.item.serviceName,
            oldValue: item.item.oldValue,
            newValue: item.item.newValue,
            retailPrice: item.item.sellPrice,
            distPrice01: item.item.distPrice01,
            distPrice02: item.item.distPrice02,
            distPrice03: item.item.distPrice03,
            distPrice04: item.item.distPrice04,
            distPrice05: item.item.distPrice05,
            distPrice06: item.item.distPrice06,
            distPrice07: item.item.distPrice07,
            distPrice08: item.item.distPrice08,
            employeeId: mechanicInformation.employeeId,
            employeeName: `${mechanicInformation.employeeName} (${mechanicInformation.employeeCode})`,
            typeCode: 'S',
            qty: item.qty,
            sellPrice: selectedPrice,
            price: selectedPrice,
            discount: 0,
            disc1: 0,
            disc2: 0,
            disc3: 0,
            total: selectedPrice * item.qty
          }
          arrayProd.push(dataService)
        }

        console.log('chooseServicePromo', arrayProd)

        setServiceTrans(JSON.stringify(arrayProd))

        const productData = yield select(({ pospromo }) => pospromo.productData)
        const serviceData = yield select(({ pospromo }) => pospromo.serviceData)

        if (!payload.hasProduct) {
          if (productData && productData.currentProduct && bundleData.mode !== 'edit') {
            yield put({
              type: 'pospromo/setProductPos',
              payload: {
                currentProduct: getCashierTrans(),
                currentReward: productData.currentReward
              }
            })
          }

          if (serviceData && serviceData.currentProduct && bundleData.mode !== 'edit') {
            yield put({
              type: 'pospromo/setServicePos',
              payload: {
                currentProduct: arrayProd,
                currentReward: serviceData.currentReward
              }
            })
          }
        }

        yield put({
          type: 'pospromo/updateState',
          payload: {
            currentReward: {},
            bundleData: {},
            listCategory: [],
            productData: {},
            serviceData: {}
          }
        })

        yield put({
          type: 'setCurTotal'
        })

        yield put({
          type: 'pos/updateState',
          payload: {
            bundleData: {},
            listCategory: [],
            dataReward: [],
            currentCategory: [],
            modalBundleCategoryVisible: false
          }
        })
      }
    },

    * replaceProduct ({ payload = {} }, { select, put }) {
      const { item, currentReplaceBundle } = payload
      let arrayProd = getCashierTrans()
      const checkExists = arrayProd.filter(el => el.code === item.productCode)
      if (checkExists && checkExists.length > 0) {
        message.error('Already Exists')
        return
      }
      const setting = yield select(({ app }) => app.setting)
      const data = {
        ...currentReplaceBundle,
        oldValue: currentReplaceBundle.oldValue ? currentReplaceBundle.oldValue : currentReplaceBundle,
        newValue: {
          productCode: item.productCode,
          productName: item.productName,
          productId: item.id,
          sellPrice: item.sellPrice,
          retailPrice: item.retailPrice,
          distPrice01: item.distPrice01,
          distPrice02: item.distPrice02,
          distPrice03: item.distPrice03,
          distPrice04: item.distPrice04,
          distPrice05: item.distPrice05,
          distPrice06: item.distPrice06,
          distPrice07: item.distPrice07,
          distPrice08: item.distPrice08
        },
        code: item.productCode,
        productId: item.id,
        name: item.productName
      }

      arrayProd[currentReplaceBundle.no - 1] = data
      yield put({
        type: 'pos/checkQuantityEditProduct',
        payload: {
          data,
          arrayProd,
          setting,
          type: payload.type
        }
      })
    },

    * setNewServiceDiff (payload, { call, put, select }) {
      console.log('setNewServiceDiff')
      const currentBuildComponent = yield select(({ pos }) => (pos ? pos.currentBuildComponent : {}))
      const memberInformation = yield select(({ pos }) => (pos ? pos.memberInformation : {}))
      const mechanicInformation = yield select(({ pos }) => pos.mechanicInformation)
      const dineInTax = yield select(({ pos }) => pos.dineInTax)
      if (currentBuildComponent && currentBuildComponent.no) {
        const response = yield call(queryServiceById, { id: 'TDF' })
        if (response && response.success) {
          let product = getCashierTrans()
          let consignment = getConsignment()
          let service = localStorage.getItem('service_detail') ? JSON.parse(localStorage.getItem('service_detail')) : []
          const bundleItem = getBundleTrans()
          let bundle = groupProduct(product.filter(filtered => filtered.bundleId), bundleItem)
          let dataPos = product.filter(filtered => !filtered.bundleId).concat(bundle).concat(service).concat(consignment)
          let a = dataPos
          let totalPayment = a.reduce((cnt, o) => cnt + o.total, 0)
          let usageLoyalty = memberInformation.useLoyalty || 0
          const totalDiscount = usageLoyalty
          const curNetto = (parseFloat(totalPayment) - parseFloat(totalDiscount)) || 0
          const dineIn = curNetto * (dineInTax / 100)
          const netto = parseFloat(curNetto) + parseFloat(dineIn)
          const arrayProd = getServiceTrans()
          let price = currentBuildComponent.targetRetailPrice - netto
          arrayProd.push({
            no: arrayProd.length + 1,
            bundleId: currentBuildComponent.bundleId,
            bundleCode: currentBuildComponent.code,
            bundleName: currentBuildComponent.name,
            hide: false,
            replaceable: false,
            code: response.data.serviceCode,
            name: response.data.serviceName,
            productId: response.data.id,
            employeeId: mechanicInformation.employeeId,
            employeeName: `${mechanicInformation.employeeName} (${mechanicInformation.employeeCode})`,
            retailPrice: price,
            distPrice01: price,
            distPrice02: price,
            distPrice03: price,
            distPrice04: price,
            distPrice05: price,
            distPrice06: price,
            distPrice07: price,
            distPrice08: price,
            qty: 1,
            typeCode: 'S',
            sellPrice: price,
            price,
            discount: 0,
            disc1: 0,
            disc2: 0,
            disc3: 0,
            total: price
          })

          setServiceTrans(JSON.stringify(arrayProd))
          yield put({
            type: 'setCurTotal'
          })
        }
      }
    },

    * setServiceDiff ({ payload }, { put, select }) {
      console.log('setServiceDiff')
      const currentBuildComponent = yield select(({ pos }) => (pos ? pos.currentBuildComponent : {}))
      const memberInformation = yield select(({ pos }) => (pos ? pos.memberInformation : {}))
      const dineInTax = yield select(({ pos }) => pos.dineInTax)
      if (currentBuildComponent && currentBuildComponent.no) {
        let product = getCashierTrans()
        let consignment = getConsignment()
        let service = localStorage.getItem('service_detail') ? JSON.parse(localStorage.getItem('service_detail')).filter(filtered => filtered.code !== 'TDF') : []
        const bundleItem = getBundleTrans()
        let bundle = groupProduct(product.filter(filtered => filtered.bundleId), bundleItem)
        let dataPos = product.filter(filtered => !filtered.bundleId).concat(bundle).concat(service).concat(consignment)
        let a = dataPos
        let totalPayment = a.reduce((cnt, o) => cnt + o.total, 0)
        let usageLoyalty = memberInformation.useLoyalty || 0
        const totalDiscount = usageLoyalty
        const curNetto = (parseFloat(totalPayment) - parseFloat(totalDiscount)) || 0
        const dineIn = curNetto * (dineInTax / 100)
        const netto = parseFloat(curNetto) + parseFloat(dineIn)
        const arrayProd = getServiceTrans()
        let price = currentBuildComponent.targetRetailPrice - netto
        payload.item.retailPrice = price
        payload.item.distPrice01 = price
        payload.item.distPrice02 = price
        payload.item.distPrice03 = price
        payload.item.distPrice04 = price
        payload.item.distPrice05 = price
        payload.item.distPrice06 = price
        payload.item.distPrice07 = price
        payload.item.distPrice08 = price
        payload.item.sellPrice = price
        payload.item.price = price
        payload.item.total = price
        arrayProd[payload.item.no - 1] = payload.item

        setServiceTrans(JSON.stringify(arrayProd))
        yield put({
          type: 'setCurTotal'
        })
      }
    },

    * chooseProduct ({ payload }, { select, put }) {
      const currentGrabOrder = yield select(({ pos }) => (pos ? pos.currentGrabOrder : {}))
      const selectedPaymentShortcut = yield select(({ pos }) => (pos ? pos.selectedPaymentShortcut : {}))
      const currentReplaceBundle = yield select(({ pos }) => (pos ? pos.currentReplaceBundle : {}))
      const currentBuildComponent = yield select(({ pos }) => (pos ? pos.currentBuildComponent : {}))
      if (currentReplaceBundle && currentReplaceBundle.no) {
        yield put({
          type: 'replaceProduct',
          payload: {
            item: payload.item,
            currentReplaceBundle
          }
        })
        return
      }
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
          item.distPrice06 = price[0].distPrice06
          item.distPrice07 = price[0].distPrice07
          item.distPrice08 = price[0].distPrice08
        }
      }

      const currentReward = yield select(({ pospromo }) => (pospromo ? pospromo.currentReward : {}))
      let qty = 1
      if (payload && payload.qty) {
        qty = payload.qty
      }
      if (currentReward && currentReward.categoryCode && currentReward.type === 'P') {
        item.sellPrice = currentReward.sellPrice
        item.distPrice01 = currentReward.distPrice01
        item.distPrice02 = currentReward.distPrice02
        item.distPrice03 = currentReward.distPrice03
        item.distPrice04 = currentReward.distPrice04
        item.distPrice05 = currentReward.distPrice05
        item.distPrice06 = currentReward.distPrice06
        item.distPrice07 = currentReward.distPrice07
        item.distPrice08 = currentReward.distPrice08
        qty = currentReward.qty
      }
      const memberInformation = yield select(({ pos }) => pos.memberInformation)
      const mechanicInformation = yield select(({ pos }) => pos.mechanicInformation)
      const curQty = yield select(({ pos }) => pos.curQty)
      const setting = yield select(({ app }) => app.setting)
      if (!!(memberInformation && memberInformation.id) && !!(mechanicInformation && mechanicInformation.employeeId)) {
        let arrayProd = getCashierTrans()
        const checkExists = arrayProd.filter(el => el.code === item.productCode)
        if (currentReward && currentReward.categoryCode && currentReward.type === 'P' && checkExists && checkExists[0]) {
          const currentItem = checkExists[0]
          const newQty = currentItem.qty + currentReward.qty
          let selectedPrice = memberInformation.memberSellPrice ? item[memberInformation.memberSellPrice.toString()] : item.sellPrice
          if (selectedPaymentShortcut
            && selectedPaymentShortcut.sellPrice
            // eslint-disable-next-line eqeqeq
            && selectedPaymentShortcut.memberId == 0) {
            selectedPrice = item[selectedPaymentShortcut.sellPrice] ? item[selectedPaymentShortcut.sellPrice] : item.sellPrice
          }
          if (!((currentBuildComponent || {}).no)
            && !((currentReward || {}).categoryCode)
            && currentGrabOrder
            && currentGrabOrder.campaignItem
            && currentGrabOrder.campaignItem.length > 0) {
            item.discount = getDiscountByProductCode(currentGrabOrder, item.productCode)
          }
          const data = {
            no: currentItem.no,
            categoryCode: currentReward && currentReward.categoryCode && currentReward.type === 'P' ? currentReward.categoryCode : undefined,
            bundleId: currentReward && currentReward.categoryCode && currentReward.type === 'P' ? currentReward.bundleId : undefined,
            bundleCode: currentReward && currentReward.categoryCode && currentReward.type === 'P' ? currentReward.bundleCode : undefined,
            bundleName: currentReward && currentReward.categoryCode && currentReward.type === 'P' ? currentReward.bundleName : undefined,
            hide: currentReward && currentReward.categoryCode && currentReward.type === 'P' ? currentReward.hide : undefined,
            replaceable: currentReward && currentReward.categoryCode && currentReward.type === 'P' ? currentReward.replaceable : undefined,
            code: item.productCode,
            productId: item.id,
            name: item.productName,
            oldValue: item.oldValue,
            newValue: item.newValue,
            retailPrice: item.sellPrice,
            distPrice01: item.distPrice01,
            distPrice02: item.distPrice02,
            distPrice03: item.distPrice03,
            distPrice04: item.distPrice04,
            distPrice05: item.distPrice05,
            distPrice06: item.distPrice06,
            distPrice07: item.distPrice07,
            distPrice08: item.distPrice08,
            employeeId: mechanicInformation.employeeId,
            employeeName: `${mechanicInformation.employeeName} (${mechanicInformation.employeeCode})`,
            typeCode: 'P',
            qty: newQty,
            sellPrice: selectedPrice,
            price: selectedPrice,
            discount: (item.discount || 0),
            disc1: 0,
            disc2: 0,
            disc3: 0,
            total: (selectedPrice * newQty) - (item.discount || 0)
          }

          if (currentBuildComponent && currentBuildComponent.no) {
            data.bundleId = currentBuildComponent.bundleId
            data.bundleCode = currentBuildComponent.code
            data.bundleName = currentBuildComponent.name
          }

          arrayProd[currentItem.no - 1] = data
          yield put({
            type: 'pos/checkQuantityEditProduct',
            payload: {
              data,
              arrayProd,
              setting,
              type: payload.type
            }
          })
        } else if (
          ((checkExists || []).length === 0)
          || ((checkExists || []).length > 0 && type === 'barcode')) {
          let selectedPrice = memberInformation.memberSellPrice ? item[memberInformation.memberSellPrice.toString()] : item.sellPrice
          if (selectedPaymentShortcut
            && selectedPaymentShortcut.sellPrice
            // eslint-disable-next-line eqeqeq
            && selectedPaymentShortcut.memberId == 0) {
            selectedPrice = item[selectedPaymentShortcut.sellPrice] ? item[selectedPaymentShortcut.sellPrice] : item.sellPrice
          }
          if (
            !((currentBuildComponent || {}).no)
            && !((currentReward || {}).categoryCode)
            && currentGrabOrder
            && currentGrabOrder.campaignItem
            && currentGrabOrder.campaignItem.length > 0) {
            item.discount = getDiscountByProductCode(currentGrabOrder, item.productCode)
          }
          const data = {
            no: arrayProd.length + 1,
            categoryCode: currentReward && currentReward.categoryCode && currentReward.type === 'P' ? currentReward.categoryCode : undefined,
            bundleId: currentReward && currentReward.categoryCode && currentReward.type === 'P' ? currentReward.bundleId : undefined,
            bundleCode: currentReward && currentReward.categoryCode && currentReward.type === 'P' ? currentReward.bundleCode : undefined,
            bundleName: currentReward && currentReward.categoryCode && currentReward.type === 'P' ? currentReward.bundleName : undefined,
            hide: currentReward && currentReward.categoryCode && currentReward.type === 'P' ? currentReward.hide : undefined,
            replaceable: currentReward && currentReward.categoryCode && currentReward.type === 'P' ? currentReward.replaceable : undefined,
            code: item.productCode,
            productId: item.id,
            name: item.productName,
            oldValue: item.oldValue,
            newValue: item.newValue,
            retailPrice: item.sellPrice,
            distPrice01: item.distPrice01,
            distPrice02: item.distPrice02,
            distPrice03: item.distPrice03,
            distPrice04: item.distPrice04,
            distPrice05: item.distPrice05,
            distPrice06: item.distPrice06,
            distPrice07: item.distPrice07,
            distPrice08: item.distPrice08,
            employeeId: mechanicInformation.employeeId,
            employeeName: `${mechanicInformation.employeeName} (${mechanicInformation.employeeCode})`,
            typeCode: 'P',
            qty,
            sellPrice: selectedPrice,
            price: selectedPrice,
            discount: (item.discount || 0),
            disc1: 0,
            disc2: 0,
            disc3: 0,
            total: (selectedPrice * curQty) - (item.discount || 0)
          }

          if (currentBuildComponent && currentBuildComponent.no) {
            data.bundleId = currentBuildComponent.bundleId
            data.bundleCode = currentBuildComponent.code
            data.bundleName = currentBuildComponent.name
          }

          arrayProd.push(data)
          yield put({
            type: 'pos/checkQuantityNewProduct',
            payload: {
              data,
              arrayProd,
              setting,
              type: payload.type
            }
          })
        } else if ((checkExists || []).length > 0 && checkExists[0].bundleId) {
          Modal.warning({
            title: 'Exists in bundle',
            content: 'This product exists in bundle'
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

    * setCurrentBuildComponent (payload, { put }) {
      const bundle = getBundleTrans()
      if (bundle && bundle.length > 0) {
        const bundleWithBuildComponent = bundle.filter(filtered => filtered.buildComponent)
        if (bundleWithBuildComponent && bundleWithBuildComponent[0]) {
          yield put({
            type: 'updateState',
            payload: {
              currentBuildComponent: bundleWithBuildComponent[0]
            }
          })
          return
        }
      }
      yield put({
        type: 'updateState',
        payload: {
          currentBuildComponent: {}
        }
      })
    },

    * getProductByBarcode ({ payload }, { call, put }) {
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
              qty: payload.qty,
              type: payload.type
            }
          })
        }

        if (response.data.code) {
          yield put({
            type: 'pospromo/addPosPromo',
            payload: {
              bundleId: response.data.id,
              currentBundle: getBundleTrans(),
              currentProduct: getCashierTrans(),
              currentService: getServiceTrans()
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
          modalProductVisible: false,
          listProduct: [],
          tmpProductList: [],
          currentReplaceBundle: {}
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
      const currentReward = yield select(({ pospromo }) => (pospromo ? pospromo.currentReward : {}))
      if (currentReward && currentReward.categoryCode) {
        payload.categoryCode = currentReward.categoryCode
        payload.type = 'all'
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
      localStorage.removeItem('voucher_list')
      localStorage.removeItem('payShortcutSelected')
      localStorage.removeItem('grabmartOrder')
      localStorage.removeItem('cashier_trans')
      localStorage.setItem('typePembelian', TYPE_PEMBELIAN_UMUM)
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
        type: 'pos/setPaymentShortcut'
      })
      yield put({
        type: 'pos/getGrabmartOrder'
      })
      yield put({
        type: 'updateState',
        payload: {
          currentBundlePayment: {},
          currentBuildComponent: {},
          currentReplaceBundle: {},
          typePembelian: TYPE_PEMBELIAN_UMUM,
          listVoucher: [],
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

    * submitGrabmartCode ({ payload = {} }, { select, call, put }) {
      const item = yield select(({ pos }) => pos.modalGrabmartCodeItem)
      const response = yield call(queryGrabmartCode, payload)
      if (response && response.success) {
        const event = item.dineInTax
        const type = item.consignmentPaymentType
        setGrabmartOrder(response.data)
        yield put({
          type: 'updateState',
          payload: {
            modalGrabmartCodeVisible: false
          }
        })
        localStorage.setItem('dineInTax', event)
        localStorage.setItem('typePembelian', type)

        yield put({
          type: 'pos/changeDineIn',
          payload: {
            dineInTax: event,
            typePembelian: type,
            selectedPaymentShortcut: item
          }
        })

        yield put({
          type: 'pos/updateState',
          payload: {
            dineInTax: event,
            typePembelian: type
          }
        })

        yield put({
          type: 'pos/setPaymentShortcut',
          payload: {
            item
          }
        })
        yield put({
          type: 'getGrabmartOrder',
          payload: {}
        })
      } else {
        throw response
      }
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
        listVoucher: [],
        currentBundlePayment: {},
        currentReplaceBundle: {},
        currentBuildComponent: {},
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
