import pathToRegexp from 'path-to-regexp'
import { Modal, message } from 'antd'
import { lstorage } from 'utils'
import { routerRedux } from 'dva/router'
import { queryEntryList } from 'services/payment/bankentry'
import {
  SALESPAY,
  SALES
} from 'utils/variable'
import { query, queryPaymentInvoice, add, cancelPayment } from '../../../services/payment/payment'
import { queryDetail } from '../../../services/payment'

const success = (msg) => {
  message.success(msg)
}

export default {

  namespace: 'paymentDetail',

  state: {
    itemCancel: {},
    data: [],
    listAccounting: [],
    listDetail: [],
    listAmount: [],
    listAmountInvoice: [],
    listPaymentOpts: [],
    modalVisible: false,
    modalCancelVisible: false
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(() => {
        const match = pathToRegexp('/accounts/payment/:id').exec(location.pathname)
        if (match) {
          dispatch({
            type: 'queryPosDetail',
            payload: {
              id: decodeURIComponent(match[1]),
              transNo: decodeURIComponent(match[1]),
              storeId: lstorage.getCurrentUserStore(),
              match
            }
          })
        }
      })
    }
  },

  effects: {
    * query ({ payload }, { call, put }) {
      const data = yield call(query, payload)
      const { success, message, status, ...other } = data
      if (success) {
        yield put({
          type: 'querySuccess',
          payload: {
            data: other.data
          }
        })
      } else {
        throw data
      }
    },
    * queryPosDetail ({ payload }, { call, put }) {
      yield put({
        type: 'updateState',
        payload: {
          data: [],
          listDetail: [],
          listAmount: []
        }
      })
      const { id, ...other } = payload
      const invoiceInfo = yield call(query, payload)
      const payment = yield call(queryPaymentInvoice, {
        reference: invoiceInfo && invoiceInfo.data && invoiceInfo.data[0] && invoiceInfo.data[0].id,
        storeId: other.storeId
      })
      const data = yield call(queryDetail, {
        id
      })
      let dataPos = []
      let dataPayment = []
      let dataPaymentInvoice = []
      for (let n = 0; n < data.pos.length; n += 1) {
        dataPos.push({
          no: n + 1,
          id: data.pos[n].id,
          bundleId: data.pos[n].bundleId,
          bundleCode: data.pos[n].bundleCode,
          bundleName: data.pos[n].bundleName,
          hide: data.pos[n].hide,
          replaceable: data.pos[n].replaceable,
          categoryCode: data.pos[n].categoryCode,
          typeCode: data.pos[n].typeCode,
          productCode: data.pos[n].productCode || data.pos[n].serviceCode,
          productName: data.pos[n].productName || data.pos[n].serviceName,
          qty: data.pos[n].qty || 0,
          sellPrice: data.pos[n].sellPrice || 0,
          oldValue: data.pos[n].oldValue,
          newValue: data.pos[n].newValue,
          retailPrice: data.pos[n].retailPrice || 0,
          distPrice01: data.pos[n].distPrice01 || 0,
          distPrice02: data.pos[n].distPrice02 || 0,
          distPrice03: data.pos[n].distPrice03 || 0,
          distPrice04: data.pos[n].distPrice04 || 0,
          distPrice05: data.pos[n].distPrice05 || 0,
          distPrice06: data.pos[n].distPrice06 || 0,
          distPrice07: data.pos[n].distPrice07 || 0,
          distPrice08: data.pos[n].distPrice08 || 0,
          distPrice09: data.pos[n].distPrice09 || 0,
          sellingPrice: data.pos[n].sellingPrice || 0,
          discountLoyalty: data.pos[n].discountLoyalty || 0,
          discount: data.pos[n].discount || 0,
          disc1: data.pos[n].disc1 || 0,
          disc2: data.pos[n].disc2 || 0,
          disc3: data.pos[n].disc3 || 0
        })
      }
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
            paymentMachine: payment.data[n].paymentMachine,
            cost: payment.data[n].cost,
            cardNo: payment.data[n].cardNo,
            cardName: payment.data[n].cardName,
            batchNumber: payment.data[n].batchNumber,
            chargeNominal: payment.data[n].chargeNominal,
            chargePercent: payment.data[n].chargePercent,
            chargeTotal: payment.data[n].chargeTotal,
            validPayment: payment.data[n].validPayment,
            recon: payment.data[n].recon,
            description: payment.data[n].description,
            paid: payment.data[n].paid || 0
          })
        }
      }
      let listAccounting = []
      if (payload && payload.match && invoiceInfo && invoiceInfo.data && invoiceInfo.data[0]) {
        const reconData = yield call(queryEntryList, {
          transactionId: invoiceInfo.data[0].id,
          transactionType: SALES,
          type: 'all'
        })
        if (reconData && reconData.data) {
          listAccounting = listAccounting.concat(reconData.data)
        }
        if (dataPayment && dataPayment.length > 0) {
          const reconDataPayment = yield call(queryEntryList, {
            transactionId: dataPayment.map(item => item.id),
            transactionType: SALESPAY,
            type: 'all'
          })
          if (reconDataPayment && reconDataPayment.data) {
            listAccounting = listAccounting.concat(reconDataPayment.data)
          }
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
            paymentMachine: payment.invoice[n].paymentMachine,
            cost: payment.invoice[n].cost,
            cardNo: payment.invoice[n].cardNo,
            cardName: payment.invoice[n].cardName,
            chargeNominal: payment.invoice[n].chargeNominal,
            chargePercent: payment.invoice[n].chargePercent,
            chargeTotal: payment.invoice[n].chargeTotal,
            validPayment: payment.data[n].validPayment,
            recon: payment.data[n].recon,
            description: payment.invoice[n].description,
            paid: payment.invoice[n].paid || 0
          })
        }
      }
      if (invoiceInfo.data && invoiceInfo.data.length > 0) {
        if (data.success) {
          yield put({
            type: 'querySuccess',
            payload: {
              data: invoiceInfo.data
            }
          })
          yield put({
            type: 'updateState',
            payload: {
              listAccounting,
              listDetail: dataPos,
              listAmount: dataPayment,
              listAmountInvoice: dataPaymentInvoice
            }
          })
        }
      } else {
        Modal.warning({
          title: 'Something went wrong',
          content: 'data is not found'
        })
        yield put(routerRedux.push('/accounts/payment'))
      }
    },
    * add ({ payload }, { call, put }) {
      const data = yield call(add, payload)
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            modalVisible: false
          }
        })
        yield put({
          type: 'queryPosDetail',
          payload: {
            reference: data.id,
            id: payload.data.transNo,
            transNo: payload.data.transNo,
            storeId: lstorage.getCurrentUserStore()
          }
        })
        success('Payment has been saved')
        // setTimeout(() => { location.reload() }, 1000)
      } else {
        throw data
      }
    },
    * cancelPayment ({ payload }, { call, put }) {
      const data = yield call(cancelPayment, payload)
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            modalCancelVisible: false,
            itemPayment: {}
          }
        })
        yield put({
          type: 'queryPosDetail',
          payload: {
            id: payload.transNo,
            transNo: payload.transNo,
            storeId: lstorage.getCurrentUserStore()
          }
        })
        success(`Payment ${payload.transNo} has been void`)
        // setTimeout(() => { location.reload() }, 1000)
      } else {
        throw data
      }
    }
  },

  reducers: {
    querySuccess (state, { payload }) {
      const { data } = payload
      return {
        ...state,
        data
      }
    },
    updateState (state, { payload }) {
      return { ...state, ...payload }
    }
  }
}
