import { query, queryDetail } from '../../services/report/purchaseinvoice'

export default {
  namespace: 'purchaseInvoice',

  state: {
    currentInvoice: {},
    invoiceItem: []
  },
  subscriptions: {},
  effects: {
    * query ({ payload }, { call, put }) {
      const data = yield call(query, payload)
      if (data.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            currentInvoice: data.purchase
          }
        })
      }
    },
    * queryDetail ({ payload }, { call, put }) {
      const data = yield call(queryDetail, payload)
      if (data.success) {
        yield put({
          type: 'querySuccessDetail',
          payload: {
            invoiceItem: data.data
          }
        })
      }
    }
  },
  reducers: {
    querySuccess (state, { payload }) {
      const { currentInvoice } = payload

      return {
        currentInvoice,
        ...state,
        ...payload
      }
    },
    querySuccessDetail (state, { payload }) {
      const { invoiceItem } = payload
      return {
        invoiceItem,
        ...state,
        ...payload
      }
    }
  }
}
