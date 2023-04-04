import { lstorage } from 'utils'
import { message } from 'antd'
import modelExtend from 'dva-model-extend'
import { add as importCsv, autoRecon } from 'services/payment/paymentValidationImport'
import { query } from 'services/payment/paymentValidationConflict'
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
        const { accountId, from, to, page, pageSize } = location.query
        const { pathname } = location

        if (pathname === '/auto-recon') {
          if (accountId && from && to) {
            dispatch({
              type: 'query',
              payload: {
                accountId,
                from,
                to,
                page: page || 1,
                pageSize: pageSize || 10
              }
            })
          }
        }
      })
    }
  },

  effects: {
    * query ({ payload = {} }, { call, put }) {
      const response = yield call(query, payload)
      if (response && response.success && response.meta) {
        yield put({
          type: 'querySuccess',
          payload: {

          }
        })
      } else {
        message.error(`Failed to get data: ${response.message}`)
      }
    },
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
    querySuccess (state, { payload }) {
      return {
        ...state,
        ...payload
      }
    },

    updateState (state, { payload }) {
      return { ...state, ...payload }
    }
  }
})
