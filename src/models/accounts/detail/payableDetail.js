import pathToRegexp from 'path-to-regexp'
import { Modal, message } from 'antd'
import { lstorage } from 'utils'
import { routerRedux } from 'dva/router'
import { queryEntryList } from 'services/payment/bankentry'
import {
  PPAY,
  PURCHASE
} from 'utils/variable'
import { queryDetail, queryHistory } from '../../../services/purchase'
import { query, queryPaymentSplit, add, cancelPayment } from '../../../services/payment/payable'

const success = (msg) => {
  message.success(msg)
}

export default {

  namespace: 'payableDetail',

  state: {
    itemCancel: {},
    data: [],
    listAccounting: [],
    listDetail: [],
    listAmount: [],
    listPaymentOpts: [],
    modalVisible: false,
    modalCancelVisible: false,
    modalAddBankVisible: false,

    visibleTooltip: false,
    valueNumber: null
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(() => {
        const match = pathToRegexp('/accounts/payable/:id').exec(location.pathname)
        if (match) {
          dispatch({
            type: 'queryPurchaseDetail',
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
    * queryPurchaseDetail ({ payload }, { call, put }) {
      const { transNo, storeId } = payload
      yield put({
        type: 'updateState',
        payload: {
          data: [],
          listDetail: [],
          listAmount: []
        }
      })
      const data = yield call(queryDetail, { transNo, storeId })
      let dataPurchase = []
      for (let n = 0; n < (data.data || []).length; n += 1) {
        dataPurchase.push({
          no: n + 1,
          id: data.data[n].id,
          productCode: data.data[n].productCode || data.data[n].serviceCode,
          productName: data.data[n].productName || data.data[n].serviceName,
          qty: data.data[n].qty || 0,
          price: data.data[n].purchasePrice || 0,
          totalDiscount: data.data[n].totalDiscount || 0,
          netto: data.data[n].netto || 0
        })
      }
      const invoiceInfo = yield call(queryHistory, { transNo, storeId })
      const payment = yield call(queryPaymentSplit, { transNo, storeId })
      let dataPayment = []
      for (let n = 0; n < (payment.data || []).length; n += 1) {
        dataPayment.push({
          no: n + 1,
          id: payment.data[n].id,
          active: payment.data[n].active,
          storeId: payment.data[n].storeId,
          transDate: payment.data[n].transDate,
          transTime: payment.data[n].transTime,
          typeCode: payment.data[n].typeCode,
          cardNo: payment.data[n].cardNo,
          cardName: payment.data[n].cardName,
          checkNo: payment.data[n].checkNo,
          description: payment.data[n].description,
          paid: payment.data[n].paid || 0,
          createdBy: payment.data[n].createdBy,
          createdAt: payment.data[n].createdAt,
          updatedBy: payment.data[n].updatedBy,
          updatedAt: payment.data[n].updatedAt
        })
      }
      if (invoiceInfo.success) {
        let listAccounting = []
        if (payload && payload.match && invoiceInfo && invoiceInfo.purchase) {
          const reconData = yield call(queryEntryList, {
            transactionId: invoiceInfo.purchase.id,
            transactionType: PURCHASE,
            type: 'all'
          })
          if (reconData && reconData.data) {
            listAccounting = listAccounting.concat(reconData.data)
          }
          const reconDataPayment = yield call(queryEntryList, {
            transactionId: dataPayment.map(item => item.id),
            transactionType: PPAY,
            type: 'all'
          })
          if (reconDataPayment && reconDataPayment.data) {
            listAccounting = listAccounting.concat(reconDataPayment.data)
          }
        }
        if (data.success) {
          yield put({
            type: 'querySuccess',
            payload: {
              data: invoiceInfo.purchase
            }
          })
          yield put({
            type: 'updateState',
            payload: {
              listAccounting,
              listDetail: dataPurchase,
              listAmount: dataPayment
            }
          })
        }
      } else {
        Modal.warning({
          title: 'Something went wrong',
          content: 'data is not found'
        })
        yield put(routerRedux.push('/accounts/payable'))
      }
    },
    * add ({ payload }, { call, put }) {
      // console.log('payload', payload)
      const data = yield call(add, payload)
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            modalVisible: false
          }
        })
        yield put({
          type: 'queryPurchaseDetail',
          payload: {
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
          type: 'queryPurchaseDetail',
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
