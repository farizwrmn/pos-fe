import pathToRegexp from 'path-to-regexp'
import { Modal } from 'antd'
import { lstorage, alertModal } from 'utils'
import { routerRedux } from 'dva/router'
import { queryEntryList } from 'services/payment/bankentry'
import { MUIN } from 'utils/variable'
import { queryTrans, queryDetail, voidTrans } from '../../../services/transferStockIn.js'

const { stockMinusAlert } = alertModal

export default {

  namespace: 'transferInDetail',

  state: {
    itemCancel: {},
    showPrint: false,
    data: [],
    listAccounting: [],
    listDetail: [],
    listAmount: [],
    listPaymentOpts: [],
    modalVisible: false,
    disableConfirm: false,
    modalCancelVisible: false
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(() => {
        const match = pathToRegexp('/inventory/transfer/in/:id').exec(location.pathname)
        if (match) {
          dispatch({
            type: 'queryDetail',
            payload: {
              transNo: decodeURIComponent(match[1]),
              storeId: lstorage.getCurrentUserStore()
            }
          })
        }
      })
    }
  },

  effects: {
    * queryDetail ({ payload }, { call, put }) {
      const invoiceInfo = yield call(queryTrans, payload)
      const data = yield call(queryDetail, payload)
      const dataInvoice = []
      const dataDetail = []
      dataInvoice.push(invoiceInfo.mutasi)

      if (invoiceInfo.mutasi) {
        for (let n = 0; n < data.mutasi.length; n += 1) {
          dataDetail.push({
            no: n + 1,
            id: data.mutasi[n].id,
            productCode: data.mutasi[n].productCode,
            productName: data.mutasi[n].productName,
            qty: data.mutasi[n].qty
          })
        }
        if (data.success) {
          let listAccounting = []
          const reconData = yield call(queryEntryList, {
            transactionId: invoiceInfo.mutasi.id,
            transactionType: MUIN,
            type: 'all'
          })
          if (reconData && reconData.data) {
            listAccounting = listAccounting.concat(reconData.data)
          }
          yield put({
            type: 'querySuccess',
            payload: {
              data: dataInvoice
            }
          })
          yield put({
            type: 'updateState',
            payload: {
              listDetail: dataDetail,
              listAccounting
            }
          })
        }
      } else {
        Modal.warning({
          title: 'Something went wrong',
          content: 'data is not found'
        })
        yield put(routerRedux.push('/inventory/transfer/in'))
      }
    },
    * voidTrans ({ payload }, { call, put }) {
      // console.log('payload', payload)
      const data = yield call(voidTrans, payload)
      if (data.success) {
        if (data.success) {
          yield put({
            type: 'updateState',
            payload: {
              modalCancelVisible: false,
              disableConfirm: false
            }
          })
        }
        yield put(routerRedux.push('/inventory/transfer/in/'))
        Modal.info({
          title: 'Transaction has been canceled'
        })
      } else {
        if (data.data && (data.data || []).length > 0) {
          stockMinusAlert(data)
        } else {
          Modal.warning({
            title: 'Something went wrong',
            content: data.message
          })
        }
        yield put({
          type: 'updateState',
          payload: {
            disableConfirm: false
          }
        })
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
