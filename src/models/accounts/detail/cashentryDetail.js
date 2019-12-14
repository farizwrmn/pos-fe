import pathToRegexp from 'path-to-regexp'
import { Modal, message } from 'antd'
import { lstorage } from 'utils'
import { routerRedux } from 'dva/router'
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
              storeId: lstorage.getCurrentUserStore()
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
      yield put({
        type: 'updateState',
        payload: {
          data: [],
          listDetail: [],
          listAmount: []
        }
      })
      const data = yield call(queryDetail, { transNo: payload.transNo })
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
      const { id, ...other } = payload
      const invoiceInfo = yield call(queryHistory, payload)
      const payment = yield call(queryPaymentSplit, other)
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
        yield put(routerRedux.push('/accounts/payment'))
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
        // setInterval(() => { location.reload() }, 1000)
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
        // setInterval(() => { location.reload() }, 1000)
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
