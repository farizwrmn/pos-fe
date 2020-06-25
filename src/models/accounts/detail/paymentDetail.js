import pathToRegexp from 'path-to-regexp'
import { Modal, message } from 'antd'
import { lstorage } from 'utils'
import { routerRedux } from 'dva/router'
import { query, queryPaymentSplit, add, cancelPayment } from '../../../services/payment/payment'
import { queryDetail } from '../../../services/payment'

const success = (msg) => {
  message.success(msg)
}

export default {

  namespace: 'paymentDetail',

  state: {
    itemCancel: {},
    data: [],
    listDetail: [],
    listAmount: [],
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
      const payment = yield call(queryPaymentSplit, other)
      const data = yield call(queryDetail, payload)
      let dataPos = []
      let dataPayment = []
      for (let n = 0; n < data.pos.length; n += 1) {
        dataPos.push({
          no: n + 1,
          id: data.pos[n].id,
          typeCode: data.pos[n].typeCode,
          productCode: data.pos[n].productCode || data.pos[n].serviceCode,
          productName: data.pos[n].productName || data.pos[n].serviceName,
          qty: data.pos[n].qty || 0,
          sellPrice: data.pos[n].sellPrice || 0,
          sellingPrice: data.pos[n].sellingPrice || 0,
          discountLoyalty: data.pos[n].discountLoyalty || 0,
          discount: data.pos[n].discount || 0,
          disc1: data.pos[n].disc1 || 0,
          disc2: data.pos[n].disc2 || 0,
          disc3: data.pos[n].disc3 || 0
        })
      }
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
      if (invoiceInfo.data.length > 0) {
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
              listDetail: dataPos,
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
