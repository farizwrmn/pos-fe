import { lstorage } from 'utils'
import { message } from 'antd'
import modelExtend from 'dva-model-extend'
import { add as importCsv, autoRecon } from '../../services/payment/paymentValidationImport'
import { pageModel } from './../common'

export default modelExtend(pageModel, {
  namespace: 'autorecon',

  state: {
    activeKey: '0',
    modalVisible: false,
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      current: 1
    },
    conflictedCSV: [],
    conflictedPayment: [],
    accountId: null,
    from: null,
    to: null
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        const { activeKey, accountId, from, to } = location.query
        const { pathname } = location
        console.log('pathname', pathname)
        console.log('activeKey', activeKey)

        if (pathname === '/auto-recon') {
          if (accountId && from && to) {
            dispatch({
              type: 'autoRecon',
              payload: {
                accountId,
                from,
                to
              }
            })
          }
        }
      })
    }
  },

  effects: {
    * importCsv ({ payload = {} }, { call, put }) {
      const response = yield call(importCsv, payload)
      if (response && response.success) {
        message.success('Berhasil import')
        yield put({ type: 'updateState', payload: { modalVisible: false } })
      } else {
        message.error(`Gagal: ${response.message}`)
      }
    },
    * autoRecon ({ payload = {} }, { call, put }) {
      payload.storeId = lstorage.getCurrentUserStore()
      const response = yield call(autoRecon, payload)
      if (response && response.success && response.conflictedRecord) {
        const { conflictedRecord } = response
        const { conflictedImportData = [], accountLedger = [] } = conflictedRecord
        yield put({
          type: 'updateState',
          payload: {
            conflictedCSV: conflictedImportData,
            conflictedPayment: accountLedger
          }
        })
        message.success(`Berhasil! ${(conflictedImportData.length > 0 || accountLedger.length > 0) ? 'Terdapat conflict, selesaikan secara manual!' : ''}`)
      } else {
        message.error(`Gagal: ${response.message}`)
      }
    }
  },

  reducers: {
    updateState (state, { payload }) {
      return { ...state, ...payload }
    }
  }
})
