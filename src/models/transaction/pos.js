import { parse } from 'qs'
import { Modal } from 'antd'
import moment from 'moment'
import config from 'config'
import { lstorage } from 'utils'
import * as cashierService from '../../services/cashier'
import { query as queryPos, queryDetail, queryPos as queryaPos, updatePos } from '../../services/payment'
import { query as queryMembers, queryByCode as queryMemberCode } from '../../services/master/customer'
import { queryMechanics, queryMechanicByCode as queryMechanicCode } from '../../services/master/employee'
import { queryPOSstock as queryProductsInStock, queryProductByCode as queryProductCode } from '../../services/master/productstock'
import { query as queryService, queryServiceByCode } from '../../services/master/service'
import { query as queryUnit } from '../../services/units'

const { prefix } = config

const { getCashierNo, getCashierTrans, createCashierTrans, updateCashierTrans } = cashierService

export default {

  namespace: 'pos',

  state: {
    list: [],
    tmpList: [],
    listCashier: [],
    listPayment: [],
    listPaymentDetail: [],
    listMember: [],
    listUnit: [],
    listMechanic: [],
    listProduct: [],
    listSequence: {},
    posData: [],
    listByCode: [],
    listQueue: localStorage.getItem('queue1') === null ? [] : JSON.parse(localStorage.getItem('queue1')),
    memberPrint: [],
    mechanicPrint: [],
    companyPrint: [],
    curQueue: 1,
    currentItem: {},
    modalMemberVisible: false,
    modalPaymentVisible: false,
    modalServiceListVisible: false,
    modalHelpVisible: false,
    modalWarningVisible: false,
    modalMechanicVisible: false,
    modalProductVisible: false,
    modalServiceVisible: false,
    modalQueueVisible: false,
    modalVisible: false,
    modalPrintVisible: false,
    modalCancelVisible: false,
    itemPayment: {},
    itemService: {},
    visiblePopover: false,
    modalType: 'add',
    totalItem: 0,
    lastMeter: localStorage.getItem('lastMeter') ? localStorage.getItem('lastMeter') : 0,
    selectedRowKeys: [],
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => `Total ${total} Records`,
      current: 1,
      total: null
    },
    curBarcode: '',
    curTotal: 0,
    curTotalDiscount: 0,
    kodeUtil: 'member',
    infoUtil: 'Member',
    dataPosLoaded: false,
    memberInformation: localStorage.getItem('member') ? JSON.parse(localStorage.getItem('member'))[0] : [],
    tmpMemberList: [],
    tmpMemberUnit: [],
    tmpMechanicList: [],
    tmpProductList: [],
    mechanicInformation: localStorage.getItem('mechanic') ? JSON.parse(localStorage.getItem('mechanic'))[0] : [],
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
    dataCashierTrans: {}
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/transaction/pos') {
          let memberUnitInfo = localStorage.getItem('memberUnit') ? JSON.parse(localStorage.getItem('memberUnit')) : { id: null, policeNo: null, merk: null, model: null }
          dispatch({
            type: 'showShiftModal',
            payload: memberUnitInfo
          })
          dispatch({
            type: 'loadDataPos'
          })
        } else if (location.pathname === '/transaction/pos/history') {
          const infoStore = localStorage.getItem(`${prefix}store`) ? JSON.parse(localStorage.getItem(`${prefix}store`)) : null
          dispatch({
            type: 'queryHistory',
            payload: {
              startPeriod: infoStore.startPeriod,
              endPeriod: infoStore.endPeriod
            }
          })
        }
        // else if (location.pathname === '/transaction/pos/payment') {
        //   dispatch({
        //     type: 'sequenceQuery',
        //     payload: 'WO'
        //   })
        // }
      })
    }
  },

  effects: {
    * paymentEdit ({ payload }, { put }) {
      let dataPos = (localStorage.getItem('cashier_trans') === null ? [] : JSON.parse(localStorage.getItem('cashier_trans')))
      dataPos[payload.no - 1] = payload
      localStorage.setItem('cashier_trans', JSON.stringify(dataPos))
      yield put({ type: 'hidePaymentModal' })
    },

    * serviceEdit ({ payload }, { put }) {
      let dataPos = (localStorage.getItem('service_detail') === null ? [] : JSON.parse(localStorage.getItem('service_detail')))
      dataPos[payload.no - 1] = payload
      localStorage.setItem('service_detail', JSON.stringify(dataPos))
      yield put({ type: 'hideServiceModal' })
    },

    * paymentDelete ({ payload }, { put }) {
      let dataPos = (localStorage.getItem('cashier_trans') === null ? [] : JSON.parse(localStorage.getItem('cashier_trans')))
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
      let dataPos = (localStorage.getItem('service_detail') === null ? [] : JSON.parse(localStorage.getItem('service_detail')))
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

    * queryHistory ({ payload = {} }, { call, put }) {
      const data = yield call(queryPos, payload)
      if (data) {
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
      }
    },

    * cancelInvoice ({ payload }, { call, put }) {
      payload.status = 'C'
      payload.storeId = lstorage.getCurrentUserStore()
      const cancel = yield call(updatePos, payload)
      if (cancel) {
        const data = yield call(queryPos, payload)
        if (data) {
          Modal.info({
            title: 'Info',
            content: `Invoice No ${payload.transNo} Has Been Cancel...!`
          })
          yield put({
            type: 'hidePrintModal'
          })
          yield put({
            type: 'querySuccessPayment',
            payload: {
              listPayment: data.data,
              pagination: {
                current: Number(payload.page) || 1,
                pageSize: Number(payload.pageSize) || 5,
                // pageSizeOptions: ['5','10','20','50'],
                total: data.total
              }
            }
          })
        }
      }
    },

    * queryPosDetail ({ payload }, { call, put }) {
      const data = yield call(queryDetail, payload)
      const PosData = yield call(queryaPos, payload)
      const member = yield call(queryMemberCode, { memberCode: payload.data.memberCode })
      const company = localStorage.getItem(`${prefix}store`) ? JSON.parse(localStorage.getItem(`${prefix}store`)) : {}
      const mechanic = yield call(queryMechanicCode, payload.data.technicianId)
      if (data) {
        yield put({
          type: 'querySuccessPaymentDetail',
          payload: {
            posData: PosData.pos,
            listPaymentDetail: { id: payload.data.transNo, cashierId: payload.data.cashierId, policeNo: payload.data.policeNo, lastMeter: payload.data.lastMeter, data: data.pos },
            memberPrint: member.data,
            companyPrint: company.data,
            mechanicPrint: mechanic.mechanic
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
                ((((data.pos[n].qty * data.pos[n].sellingPrice) * (data.pos[n].disc1 / 100)) * (data.pos[n].disc2 / 100)) * (data.pos[n].disc2 / 100))
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
                ((((data.pos[n].qty * data.pos[n].sellingPrice) * (data.pos[n].disc1 / 100)) * (data.pos[n].disc2 / 100)) * (data.pos[n].disc2 / 100))
            })
          }
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

    * getStock ({ payload }, { call, put }) {
      const data = yield call(queryProductCode, payload.productCode)
      let newData = data.data

      if (data.data !== null) {
        let arrayProd
        if (JSON.stringify(payload.listByCode) === '[]') {
          arrayProd = payload.listByCode.slice()
        } else {
          arrayProd = JSON.parse(payload.listByCode.slice())
        }

        arrayProd.push({
          no: payload.curRecord,
          code: newData.productCode,
          name: newData.productName,
          qty: 1,
          price: newData.sellPrice,
          discount: 0,
          disc1: 0,
          disc2: 0,
          disc3: 0,
          total: newData.sellPrice * payload.curQty
        })

        localStorage.setItem('cashier_trans', JSON.stringify(arrayProd))

        yield put({
          type: 'querySuccessByCode',
          payload: {
            listByCode: newData,
            curRecord: payload.curRecord + 1
          }
        })
      } else {
        const modal = Modal.warning({
          title: 'Warning',
          content: 'Stock Not Found...!'
        })

        setTimeout(() => modal.destroy(), 1000)
      }
    },

    * getService ({ payload }, { call, put }) {
      const data = yield call(queryServiceByCode, payload.serviceId)
      let newData = data.data
      if (data.data !== null) {
        let arrayProd
        if (JSON.stringify(payload.listByCode) === '[]') {
          arrayProd = payload.listByCode.slice()
        } else {
          arrayProd = JSON.parse(payload.listByCode.slice())
        }

        arrayProd.push({
          no: payload.curRecord,
          code: newData.serviceCode,
          name: newData.serviceName,
          qty: payload.curQty,
          price: newData.serviceCost,
          discount: 0,
          disc1: 0,
          disc2: 0,
          disc3: 0,
          total: newData.serviceCost * payload.curQty
        })

        localStorage.setItem('cashier_trans', JSON.stringify(arrayProd))

        yield put({
          type: 'queryServiceSuccessByCode',
          payload: {
            listByCode: newData,
            curRecord: payload.curRecord + 1
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

    * loadDataPos ({ payload = {} }, { call, put }) {
      let dataPos = (localStorage.getItem('cashier_trans') === null ? [] : JSON.parse(localStorage.getItem('cashier_trans')))
      let arrayProd = dataPos.slice()
      let curRecord = 0
      let curCashierNo = localStorage.getItem('cashierNo')
      let curItem = payload
      const dataCashier = yield call(getCashierNo)
      const dataCashierTrans = yield call(getCashierTrans, { cashierId: null, cashierNo: curCashierNo, shift: null, status: 'O' })

      if (dataCashierTrans.success) {
        curItem = dataCashierTrans.data
      } else {
        curItem = {}
      }

      if (JSON.stringify(arrayProd) !== '[]') {
        for (let i = 0; i < arrayProd.length; i += 1) {
          curRecord += 1
        }
        yield put({
          type: 'setStatePosLoaded',
          payload: {
            arrayProd: JSON.stringify(arrayProd),
            curRecord: curRecord + 1
          }
        })
      }
      yield put({
        type: 'setCashierNo',
        payload: {
          listCashier: dataCashier.data,
          dataCashierTrans: curItem
        }
      })
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

    * getMembers ({ payload }, { call, put }) {
      const data = yield call(queryMembers, payload)
      let newData = payload ? data.member : data.data
      if (data.success) {
        yield put({
          type: 'queryGetMembersSuccess',
          payload: {
            memberInformation: newData,
            tmpMemberList: newData
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

    * getServices ({ payload }, { call, put }) {
      const data = yield call(queryService, payload)
      let newData = payload ? data.service : data.data
      if (data.data !== null) {
        yield put({
          type: 'queryGetServicesSuccess',
          payload: {
            serviceInformation: newData,
            tmpServiceList: newData
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
          content: 'Mechanic Information Not Found...!'
        })
        yield put({ type: 'setUtil', payload: { kodeUtil: 'mechanic', infoUtil: 'Mechanic' } })
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
      } else {
        const modal = Modal.warning({
          title: 'Warning',
          content: 'Mechanic Not Found...!'
        })
        setTimeout(() => modal.destroy(), 1000)
        // throw data
      }
    },

    * checkQuantityEditProduct ({ payload }, { call, put }) {
      const { data } = payload
      function getQueueQuantity () {
        const queue = localStorage.getItem('queue') ? JSON.parse(localStorage.getItem('queue')) : {}
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
        console.log('queue is empty, nothing to check')
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
      const listProductData = yield call(queryProductsInStock, { from: storeInfo.startPeriod, to: moment().format('YYYY-MM-DD') })
      const listProduct = listProductData.data
      let tempListProduct = []
      function getSetting (setting) {
        let json = setting.Inventory
        let jsondata = JSON.stringify(eval(`(${json})`))
        const outOfStock = JSON.parse(jsondata).posOrder.outOfStock
        return outOfStock
      }
      if (listProductData.data.length > 0) {
        tempListProduct = listProduct.filter(el => el.productId === data.productId)
        if (data.price < (tempListProduct[0].amount === 0 ? tempListProduct[0].costPrice : tempListProduct[0].amount)) {
          Modal.warning({
            title: 'Price is under the cost'
          })
        }
        tempListProduct = tempListProduct.reduce((cnt, o) => cnt + o.count, 0)
        let outOfStock = getSetting(payload.setting)
        if (totalQty > tempListProduct && outOfStock === 0) {
          Modal.warning({
            title: 'No available stock',
            content: `Your input: ${totalCashier} Queue : ${totalQueue} Available: ${tempListProduct}`
          })
        } else if (totalQty > tempListProduct && outOfStock === 1) {
          Modal.warning({
            title: 'Waning Out of stock option',
            content: `Your input: ${totalCashier} Queue : ${totalQueue} Available: ${tempListProduct}`
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
        }
      }
    },

    * checkQuantityNewProduct ({ payload }, { call, put }) {
      const { data, arrayProd } = payload
      function getQueueQuantity () {
        const queue = localStorage.getItem('queue') ? JSON.parse(localStorage.getItem('queue')) : {}
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
        console.log('queue is empty, nothing to check')
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
      const listProductData = yield call(queryProductsInStock, { from: storeInfo.startPeriod, to: moment().format('YYYY-MM-DD') })
      const listProduct = listProductData.data
      let tempListProduct = []
      function getSetting (setting) {
        let json = setting.Inventory
        let jsondata = JSON.stringify(eval(`(${json})`))
        const outOfStock = JSON.parse(jsondata).posOrder.outOfStock
        return outOfStock
      }
      const outOfStock = getSetting(payload.setting)
      if (listProductData.data.length > 0) {
        tempListProduct = listProduct.filter(el => el.productId === data.productId)
        if (data.price < (tempListProduct[0].amount === 0 ? tempListProduct[0].costPrice : tempListProduct[0].amount)) {
          Modal.warning({
            title: 'Price is under the cost'
          })
        }
        tempListProduct = tempListProduct.reduce((cnt, o) => cnt + o.count, 0)
        if (totalQty > tempListProduct && outOfStock === 0) {
          Modal.warning({
            title: 'No available stock',
            content: `Your input: ${totalCashier} Queue : ${totalQueue} Available: ${tempListProduct}`
          })
        } else if (totalQty > tempListProduct && outOfStock === 1) {
          Modal.warning({
            title: 'Waning Out of stock option',
            content: `Your input: ${totalCashier} Queue : ${totalQueue} Available: ${tempListProduct}`
          })
          localStorage.setItem('cashier_trans', JSON.stringify(arrayProd))
          yield put({
            type: 'pos/setUtil',
            payload: { kodeUtil: 'barcode', infoUtil: 'Product' }
          })
          yield put({ type: 'pos/hideProductModal' })
        } else {
          localStorage.setItem('cashier_trans', JSON.stringify(arrayProd))
          yield put({
            type: 'pos/setUtil',
            payload: { kodeUtil: 'barcode', infoUtil: 'Product' }
          })
          yield put({ type: 'pos/hideProductModal' })
        }
      }
    },

    * getProducts ({ payload }, { call, put }) {
      const storeInfo = localStorage.getItem(`${prefix}store`) ? JSON.parse(localStorage.getItem(`${prefix}store`)) : {}
      let data = {}
      if (payload.outOfStock) {
        data = yield call(queryProductsInStock, { from: storeInfo.startPeriod, to: moment().format('YYYY-MM-DD') })
        yield put({
          type: 'showProductModal',
          payload: {
            modalType: 'browseProductFree'
          }
        })
      } else {
        const storeInfo = localStorage.getItem(`${prefix}store`) ? JSON.parse(localStorage.getItem(`${prefix}store`)) : {}
        data = yield call(queryProductsInStock, { from: storeInfo.startPeriod, to: moment().format('YYYY-MM-DD') })
        yield put({
          type: 'showProductModal',
          payload: {
            modalType: 'browseProductLock'
          }
        })
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

    * setCashierTrans ({ payload }, { call, put }) {
      const dataCashierTransById = yield call(getCashierTrans, { cashierId: payload.cashierId, cashierNo: null, shift: null, status: 'O' })
      const dataCashierTransByNo = yield call(getCashierTrans, { cashierId: null, cashierNo: payload.cashierNo, shift: null, status: 'O' })
      let dataCashierTransByShift = {}
      if (dataCashierTransByNo.success === false && dataCashierTransById.success === false) {
        dataCashierTransByShift = yield call(getCashierTrans, { cashierId: null, cashierNo: payload.cashierNo, shift: payload.shift, status: 'C' })
      }


      const newDataCashierTransById = dataCashierTransById.data
      const newDataCashierTransByNo = dataCashierTransByNo.data
      // const newDataCashierTransByShift = dataCashierTransByShift.data

      if (dataCashierTransByShift.success) {
        Modal.warning({
          title: 'Warning',
          content: 'This Shift has been closed for this Machine...!'
        })
      } else if (dataCashierTransById.success) {
        if (newDataCashierTransById.cashierNo !== payload.cashierNo) {
          Modal.warning({
            title: 'Warning',
            content: `Cashier Id ${payload.cashierId} status is Open in Machine ${newDataCashierTransById.cashierNo}...!`
          })
        } else if (newDataCashierTransById.shift !== parseInt(payload.shift, 10)) {
          Modal.warning({
            title: 'Warning',
            content: `Cashier Id ${payload.cashierId} status is Open in this Machine on Shift ${newDataCashierTransById.shift}...!`
          })
        } else {
          yield put({
            type: 'hideShiftModal',
            payload: {
              curShift: payload.shift,
              curCashierNo: payload.cashierNo
            }
          })
        }
      } else if (dataCashierTransByNo.success) {
        if (newDataCashierTransByNo.cashierId !== payload.cashierId) {
          Modal.warning({
            title: 'Warning',
            content: `This Machine is logged on by Cashier ${newDataCashierTransByNo.cashierId}...!`
          })
        } else {
          yield put({
            type: 'hideShiftModal',
            payload: {
              curShift: payload.shift,
              curCashierNo: payload.cashierNo
            }
          })
        }
      } else {
        const data = yield call(createCashierTrans, payload)

        if (data.success) {
          localStorage.setItem('cashierNo', payload.cashierNo)

          yield put({
            type: 'hideShiftModal',
            payload: {
              curShift: payload.shift,
              curCashierNo: payload.cashierNo
            }
          })
        } else {
          throw data
        }
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

    * editPayment ({ payload }, { put }) {
      let dataPos = (localStorage.getItem('cashier_trans') === null ? [] : JSON.parse(localStorage.getItem('cashier_trans')))
      let arrayProd = dataPos.slice()
      let total = arrayProd[payload.effectedRecord - 1].qty * arrayProd[payload.effectedRecord - 1].price
      let Qty = arrayProd[payload.effectedRecord - 1].qty
      let price = arrayProd[payload.effectedRecord - 1].price
      let disc1 = arrayProd[payload.effectedRecord - 1].disc1
      let disc2 = arrayProd[payload.effectedRecord - 1].disc2
      let disc3 = arrayProd[payload.effectedRecord - 1].disc3
      let discount = (arrayProd[payload.effectedRecord - 1].discount * Qty)
      if (payload.kodeUtil === 'discount') {
        let tmpDisc = (total * disc1) / 100
        let tmpDisc2 = ((total - tmpDisc) * disc2) / 100
        let tmpDisc3 = ((total - tmpDisc - tmpDisc2) * disc3) / 100

        arrayProd[payload.effectedRecord - 1].discount = payload.value
        arrayProd[payload.effectedRecord - 1].total = total - tmpDisc - tmpDisc2 - tmpDisc3 - (payload.value * Qty)
      } else if (payload.kodeUtil === 'disc1') {
        let tmpDisc = (total * payload.value) / 100

        arrayProd[payload.effectedRecord - 1].disc1 = payload.value
        arrayProd[payload.effectedRecord - 1].disc2 = 0
        arrayProd[payload.effectedRecord - 1].disc3 = 0
        arrayProd[payload.effectedRecord - 1].total = total - tmpDisc - discount
      } else if (payload.kodeUtil === 'disc2') {
        let tmpDisc = (total * disc1) / 100
        let tmpDisc2 = ((total - tmpDisc) * payload.value) / 100

        arrayProd[payload.effectedRecord - 1].disc2 = payload.value
        arrayProd[payload.effectedRecord - 1].disc3 = 0
        arrayProd[payload.effectedRecord - 1].total = total - tmpDisc - tmpDisc2 - discount
      } else if (payload.kodeUtil === 'disc3') {
        let tmpDisc = (total * disc1) / 100
        let tmpDisc2 = ((total - tmpDisc) * disc2) / 100
        let tmpDisc3 = ((total - tmpDisc - tmpDisc2) * payload.value) / 100

        arrayProd[payload.effectedRecord - 1].disc3 = payload.value
        arrayProd[payload.effectedRecord - 1].total = total - tmpDisc - tmpDisc2 - tmpDisc3 - discount
      } else if (payload.kodeUtil === 'quantity') {
        let tmpQty = payload.value
        let tmpDisc = ((tmpQty * price) * disc1) / 100
        let tmpDisc2 = (((tmpQty * price) - tmpDisc) * disc2) / 100
        let tmpDisc3 = (((tmpQty * price) - tmpDisc - tmpDisc2) * disc3) / 100
        let tmpDiscount = (discount * tmpQty)
        arrayProd[payload.effectedRecord - 1].qty = tmpQty
        arrayProd[payload.effectedRecord - 1].total = (payload.value * price) - tmpDisc - tmpDisc2 - tmpDisc3 - tmpDiscount
      } else if (payload.kodeUtil === 'Delete') {
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
        ary.remove(arrayProd[payload.effectedRecord - 1])
        arrayProd = []
        for (let n = 0; n < ary.length; n += 1) {
          arrayProd.push({
            no: n + 1,
            code: ary[n].code,
            productId: ary[n].productId,
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
      }
      if (arrayProd.length === 0) {
        localStorage.removeItem('cashier_trans')
      } else {
        localStorage.setItem('cashier_trans', JSON.stringify(arrayProd))
        yield put({
          type: 'setCurTotal'
        })
      }
    },

    * editService ({ payload }, { put }) {
      let dataPos = (localStorage.getItem('service_detail') === null ? [] : JSON.parse(localStorage.getItem('service_detail')))
      let arrayProd = dataPos.slice()
      let total = arrayProd[payload.effectedRecord - 1].qty * arrayProd[payload.effectedRecord - 1].price
      let Qty = arrayProd[payload.effectedRecord - 1].qty
      let price = arrayProd[payload.effectedRecord - 1].price
      let disc1 = arrayProd[payload.effectedRecord - 1].disc1
      let disc2 = arrayProd[payload.effectedRecord - 1].disc2
      let disc3 = arrayProd[payload.effectedRecord - 1].disc3
      let discount = (arrayProd[payload.effectedRecord - 1].discount * Qty)
      if (payload.kodeUtil === 'discount') {
        let tmpDisc = (total * disc1) / 100
        let tmpDisc2 = ((total - tmpDisc) * disc2) / 100
        let tmpDisc3 = ((total - tmpDisc - tmpDisc2) * disc3) / 100

        arrayProd[payload.effectedRecord - 1].discount = payload.value
        arrayProd[payload.effectedRecord - 1].total = total - tmpDisc - tmpDisc2 - tmpDisc3 - (payload.value * Qty)
      } else if (payload.kodeUtil === 'disc1') {
        let tmpDisc = (total * payload.value) / 100

        arrayProd[payload.effectedRecord - 1].disc1 = payload.value
        arrayProd[payload.effectedRecord - 1].disc2 = 0
        arrayProd[payload.effectedRecord - 1].disc3 = 0
        arrayProd[payload.effectedRecord - 1].total = total - tmpDisc - discount
      } else if (payload.kodeUtil === 'disc2') {
        let tmpDisc = (total * disc1) / 100
        let tmpDisc2 = ((total - tmpDisc) * payload.value) / 100

        arrayProd[payload.effectedRecord - 1].disc2 = payload.value
        arrayProd[payload.effectedRecord - 1].disc3 = 0
        arrayProd[payload.effectedRecord - 1].total = total - tmpDisc - tmpDisc2 - discount
      } else if (payload.kodeUtil === 'disc3') {
        let tmpDisc = (total * disc1) / 100
        let tmpDisc2 = ((total - tmpDisc) * disc2) / 100
        let tmpDisc3 = ((total - tmpDisc - tmpDisc2) * payload.value) / 100

        arrayProd[payload.effectedRecord - 1].disc3 = payload.value
        arrayProd[payload.effectedRecord - 1].total = total - tmpDisc - tmpDisc2 - tmpDisc3 - discount
      } else if (payload.kodeUtil === 'quantity') {
        let tmpQty = payload.value
        let tmpDisc = ((tmpQty * price) * disc1) / 100
        let tmpDisc2 = (((tmpQty * price) - tmpDisc) * disc2) / 100
        let tmpDisc3 = (((tmpQty * price) - tmpDisc - tmpDisc2) * disc3) / 100
        let tmpDiscount = (discount * tmpQty)
        arrayProd[payload.effectedRecord - 1].qty = tmpQty
        arrayProd[payload.effectedRecord - 1].total = (payload.value * price) - tmpDisc - tmpDisc2 - tmpDisc3 - tmpDiscount
      } else if (payload.kodeUtil === 'Delete') {
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
        ary.remove(arrayProd[payload.effectedRecord - 1])
        arrayProd = []
        for (let n = 0; n < ary.length; n += 1) {
          arrayProd.push({
            no: n + 1,
            code: ary[n].code,
            productId: ary[n].productId,
            disc1: ary[n].disc1,
            disc2: ary[n].disc2,
            disc3: ary[n].disc3,
            discount: ary[n].discount,
            name: ary[n].name,
            price: ary[n].price,
            qty: ary[n].qty,
            total: ary[n].total
          })
        }
      }

      if (arrayProd.length === 0) {
        localStorage.removeItem('service_detail')
      } else {
        localStorage.setItem('service_detail', JSON.stringify(arrayProd))
        yield put({
          type: 'setCurTotal'
        })
      }
    },

    * insertQueueCache ({ payload = [] }, { put }) {
      let arrayProd = payload

      const memberUnit = localStorage.getItem('memberUnit') ? localStorage.getItem('memberUnit') : ''
      const policeNo = localStorage.getItem('memberUnit') ? JSON.parse(localStorage.getItem('memberUnit')).policeNo : ''
      const lastMeter = localStorage.getItem('lastMeter') ? localStorage.getItem('lastMeter') : 0
      const cashier_trans = localStorage.getItem('cashier_trans') ? JSON.parse(localStorage.getItem('cashier_trans')) : []
      const service_detail = localStorage.getItem('service_detail') ? JSON.parse(localStorage.getItem('service_detail')) : []
      const woNumber = localStorage.getItem('woNumber') ? localStorage.getItem('woNumber') : null

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
        memberCode: memberInfo.memberCode,
        memberName: memberInfo.memberName,
        point: memberInfo.point,
        memberTypeId: memberInfo.memberTypeId,
        woNumber,
        memberUnit,
        policeNo,
        lastMeter,
        address01: memberInfo.address01,
        gender: memberInfo.gender,
        id: memberInfo.id,
        phone: memberInfo.phone,
        mechanicCode: mechanic.mechanicCode,
        mechanicName: mechanic.mechanicName
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
            console.log(queue.queue2)
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
    * insertQueue ({ payload }, { put }) {
      Modal.info({
        title: 'Payment Suspend',
        content: `Your Payment has stored in queue ${payload.queue}`
      })
      localStorage.removeItem('cashier_trans')
      localStorage.removeItem('service_detail')
      localStorage.removeItem('member')
      localStorage.removeItem('memberUnit')
      localStorage.removeItem('mechanic')
      localStorage.removeItem('lastMeter')
      localStorage.removeItem('woNumber')
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
    }
  },

  reducers: {
    querySuccess (state, action) {
      const { list, pagination, tmpList } = action.payload
      let dataPos = (localStorage.getItem('cashier_trans') === null ? [] : JSON.parse(localStorage.getItem('cashier_trans')))
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
      let dataPos = (localStorage.getItem('cashier_trans') === null ? [] : JSON.parse(localStorage.getItem('cashier_trans')))
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

      let dataPos = (localStorage.getItem('cashier_trans') === null ? [] : JSON.parse(localStorage.getItem('cashier_trans')))
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

      let dataPos = (localStorage.getItem('cashier_trans') === null ? [] : JSON.parse(localStorage.getItem('cashier_trans')))
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
      let dataPos = (localStorage.getItem('cashier_trans') === null ? [] : JSON.parse(localStorage.getItem('cashier_trans')))
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
      const { memberInformation, tmpMemberList } = action.payload
      let dataPos = (localStorage.getItem('cashier_trans') === null ? [] : JSON.parse(localStorage.getItem('cashier_trans')))
      let a = dataPos
      let grandTotal = a.reduce((cnt, o) => { return cnt + o.total }, 0)

      return {
        ...state,
        listMember: memberInformation,
        tmpMemberList,
        curTotal: grandTotal
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
      let dataPos = (localStorage.getItem('cashier_trans') === null ? [] : JSON.parse(localStorage.getItem('cashier_trans')))
      let a = dataPos
      let grandTotal = a.reduce((cnt, o) => { return cnt + o.total }, 0)

      return {
        ...state,
        listService: serviceInformation,
        tmpServiceList,
        curTotal: grandTotal
      }
    },

    queryGetMechanicSuccess (state, action) {
      const { mechanicInformation } = action.payload
      let dataPos = (localStorage.getItem('cashier_trans') === null ? [] : JSON.parse(localStorage.getItem('cashier_trans')))
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
      let dataPos = (localStorage.getItem('cashier_trans') === null ? [] : JSON.parse(localStorage.getItem('cashier_trans')))
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
      let dataPos = (localStorage.getItem('cashier_trans') === null ? [] : JSON.parse(localStorage.getItem('cashier_trans')))
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
      let dataPos = (localStorage.getItem('cashier_trans') === null ? [] : JSON.parse(localStorage.getItem('cashier_trans')))
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

    setStatePosLoaded (state, action) {
      if (!state.dataPosLoaded) {
        localStorage.setItem('cashier_trans', action.payload.arrayProd)

        let dataPos = (localStorage.getItem('cashier_trans') === null ? [] : JSON.parse(localStorage.getItem('cashier_trans')))
        let a = dataPos
        let grandTotal = a.reduce((cnt, o) => { return cnt + o.total }, 0)

        return {
          ...state,
          dataPosLoaded: true,
          curTotal: grandTotal,
          curRecord: action.payload.curRecord
        }
      }
      return { ...state }
    },

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
      return { ...state, curQty: 1, curRecord: 1, curTotal: 0, listByCode: [], memberInformation: [], mechanicInformation: [], curTotalDiscount: 0, curRounding: 0, memberUnitInfo: { id: null, policeNo: null, merk: null, model: null }, lastMeter: 0 }
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
      let product = (localStorage.getItem('cashier_trans') === null ? [] : JSON.parse(localStorage.getItem('cashier_trans')))
      let service = (localStorage.getItem('service_detail') === null ? [] : JSON.parse(localStorage.getItem('service_detail')))
      let dataPos = product.concat(service)
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

      let ratusan = grandTotal.toString().substr(grandTotal.toString().length - 2, 2)
      // Ganti 100 dengan Jumlah Pembulatan yang diinginkan
      let selisih = 100 - parseInt(ratusan, 10)
      let curRounding

      if (selisih > 50) {
        curRounding = parseInt(ratusan, 10) * -1
      } else {
        curRounding = parseInt(selisih, 10)
      }

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
        const match = record.employeeName.match(reg) || record.employeeId.match(reg) || record.positionName.match(reg) || record.positionId.match(reg)
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
