import pathToRegexp from 'path-to-regexp'
import modelExtend from 'dva-model-extend'
import { prefix } from 'utils/config.main'
import { lstorage } from 'utils'
import { allowPrint } from 'utils/validation'
import {
  directPrinting,
  queryDetail,
  queryDetailConsignment,
  queryById as queryInvoiceById,
  queryPos as queryaPos
} from 'services/payment'
import {
  queryByCode as queryMemberCode
} from 'services/master/customer'
import {
  queryMechanicByCode as queryMechanicCode
} from 'services/master/employee'
import { query as queryOpts } from 'services/payment/paymentOptions'
import { queryPaymentInvoice } from 'services/payment/payment'
import { rearrangeDirectPrintingQris, rearrangeDirectPrinting } from 'utils/posinvoice'
import { query as querySetting } from 'services/setting'
import { pageModel } from '../common'


export default modelExtend(pageModel, {
  namespace: 'posInvoice',

  state: {
    directPrinting: [],
    listOpts: [],

    listPaymentDetail: [],
    memberPrint: [],
    mechanicPrint: [],
    posData: [],
    modalConfirmVisible: false,
    standardInvoice: true,

    companyInfo: {},

    listAmount: [],
    listAmountInvoice: []
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
        if (match) {
          dispatch({
            type: 'queryPosById',
            payload: {
              id: match[1],
              type: 'print'
            }
          })

          dispatch({
            type: 'queryOpts',
            payload: {
              type: 'all'
            }
          })
        }
      })
    }
  },

  effects: {

    * queryOpts ({ payload = {} }, { call, put }) {
      const data = yield call(queryOpts, payload)
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            listOpts: data.data
          }
        })
      }
    },

    * queryPosById ({ payload = {} }, { call, put }) {
      const { type, ...other } = payload
      const response = yield call(queryInvoiceById, other)
      if (response && response.success) {
        yield put({
          type: 'queryPosDetail',
          payload: {
            reference: payload.id,
            id: response.pos.transNo,
            data: response.pos,
            type
          }
        })
        yield put({
          type: 'updateState',
          payload: {
            directPrinting: response.directPrinting
          }
        })
        yield put({
          type: 'setListPaymentDetail',
          payload: response.pos
        })
        if (response.pos && response.directPrinting && response.directPrinting.length > 0) {
          for (let key in response.directPrinting) {
            const item = response.directPrinting[key]
            const responseDirect = yield call(directPrinting, {
              url: item.printingUrl,
              data: item.groupName === 'QRIS' ? rearrangeDirectPrintingQris(response.pos, item) : rearrangeDirectPrinting(response.pos, item)
            })
            console.log('responseDirect', responseDirect)
          }
        }
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
        const payment = yield call(queryPaymentInvoice, {
          reference: PosData.pos.id,
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
            name: item.productName,
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
          type: 'updateState',
          payload: {
            listAmount: dataPayment,
            listAmountInvoice: dataPaymentInvoice
          }
        })
        const companyData = yield call(querySetting, { settingCode: 'Company' })

        if (PosData.taxInfo && PosData.taxInfo.length > 0) {
          PosData.pos.taxInfo = PosData.taxInfo
        } else {
          PosData.pos.taxInfo = []
        }
        if (companyData && companyData.success && companyData.data && companyData.data[0] && companyData.data[0].settingValue) {
          try {
            PosData.pos.companyInfo = JSON.parse(companyData.data[0].settingValue)
          } catch (error) {
            console.log('Error parsing companyInfo', error)
            PosData.pos.companyInfo = {}
          }
        } else {
          PosData.pos.companyInfo = {}
        }
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
    }

  },

  reducers: {
    querySuccess (state, action) {
      const { list, pagination } = action.payload
      return {
        ...state,
        list,
        pagination: {
          ...state.pagination,
          ...pagination
        }
      }
    },

    updateState (state, { payload }) {
      return { ...state, ...payload }
    },

    changeTab (state, { payload }) {
      const { key } = payload
      return {
        ...state,
        activeKey: key,
        modalType: 'add',
        currentItem: {}
      }
    },

    setListPaymentDetail (state, action) {
      return { ...state, listPaymentDetail: { id: action.payload.transNo } }
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

    editItem (state, { payload }) {
      const { item } = payload
      return {
        ...state,
        modalType: 'edit',
        activeKey: '0',
        currentItem: item
      }
    }
  }
})
