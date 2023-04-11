import { lstorage } from 'utils'
import { message } from 'antd'
import modelExtend from 'dva-model-extend'
import { add as importCsv, autoRecon } from 'services/payment/paymentValidationImport'
import { query, queryDetail, queryAdd, queryResolve, queryAll } from 'services/payment/paymentValidationConflict'
import { query as queryBankMerchant, add as addMerchant, edit as editMerchant } from 'services/payment/paymentValidationImportBank'
import pathToRegexp from 'path-to-regexp'
import { routerRedux } from 'dva/router'
import { pageModel } from './../common'

export default modelExtend(pageModel, {
  namespace: 'autorecon',

  state: {
    activeKey: '0',
    modalVisible: false,
    resolveModalVisible: false,
    conflictModalVisible: false,
    BankMerchantModalVisible: false,
    formModalVisible: false,
    pagination: {
      pageSize: 15,
      current: 1,
      simple: true,
      total: 0
    },
    ledgerEntry: [],
    currentLedgerEntry: {},
    list: [],
    listBankMerchant: [],
    currentBankMerchant: [],
    conflictedCSV: [],
    selectedCsvRowKeys: [],
    conflictedPayment: [],
    selectedPaymentRowKeys: [],
    accountId: null,
    from: null,
    to: null,
    showPDFModal: false,
    mode: '',
    changed: false,
    listPrintAll: [],
    detail: {}
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        const { activeKey, accountId, from, to, page, pageSize, q } = location.query
        const { pathname } = location
        const match = pathToRegexp('/auto-recon/:id').exec(location.pathname)
        if (match) {
          dispatch({
            type: 'queryDetail',
            payload: {
              id: decodeURIComponent(match[1])
            }
          })
        }
        if (pathname === '/auto-recon') {
          if (accountId && from && to && activeKey === '1') {
            dispatch({
              type: 'query',
              payload: {
                accountId,
                from,
                to,
                page: page || 1,
                pageSize: pageSize || 15,
                q
              }
            })
          }
          if (activeKey === '2') {
            dispatch({
              type: 'queryBankMerchant',
              payload: {
                page: page || 1,
                pageSize: pageSize || 15,
                q
              }
            })
          }
          if (activeKey) {
            dispatch({
              type: 'updateState',
              payload: {
                activeKey
              }
            })
          }
        }
      })
    }
  },

  effects: {
    * query ({ payload = {} }, { call, put }) {
      const response = yield call(query, { ...payload, order: 'resolved,-id' })
      if (response && response.success && response.meta && response.data) {
        yield put({
          type: 'querySuccess',
          payload: {
            list: response.data,
            pagination: {
              pageSize: 15,
              current: Number(payload.page),
              total: Number(response.meta.count),
              simple: true
            }
          }
        })
      } else {
        message.error(`Failed to get data: ${response.message}`)
      }
    },
    * queryBankMerchant ({ payload = {} }, { call, put }) {
      const response = yield call(queryBankMerchant, payload)
      if (response && response.success && response.meta && response.data) {
        yield put({
          type: 'querySuccess',
          payload: {
            listBankMerchant: response.data,
            pagination: {
              pageSize: 15,
              current: Number(payload.page),
              total: Number(response.meta.count),
              simple: true
            }
          }
        })
      } else {
        message.error(`Failed to get data: ${response.message}`)
      }
    },
    * queryAll ({ payload = {} }, { call, put }) {
      const response = yield call(queryAll, { ...payload })
      if (response && response.success && response.meta && response.data) {
        if (response.data.length === 0) {
          message.error('Data not found!')
        }
        yield put({
          type: 'querySuccess',
          payload: {
            ...payload,
            listPrintAll: response.data
          }
        })
      } else {
        message.error(`Failed to get data: ${response.message}`)
      }
    },
    * queryDetail ({ payload = {} }, { call, put }) {
      const response = yield call(queryDetail, payload)
      if (response && response.success && response.meta && response.data) {
        yield put({
          type: 'querySuccess',
          payload: {
            ...payload,
            detail: response.data
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
            ...payload,
            conflictedCSV: conflictedImportData,
            conflictedPayment: accountLedger,
            selectedCsvRowKeys: [],
            selectedPaymentRowKeys: []
          }
        })
        const { location, from, to, accountId } = payload
        const { pathname, query } = location
        yield put(routerRedux.push({
          pathname,
          query: {
            ...query,
            from,
            to,
            accountId
          }
        }))
        message.success(`Berhasil! ${(conflictedImportData.length > 0 || accountLedger.length > 0) ? 'Terdapat conflict, selesaikan secara manual!' : ''}`)
      } else {
        message.error(`Gagal: ${response.message}`)
      }
    },
    * add ({ payload = {} }, { call, put }) {
      const response = yield call(queryAdd, payload)
      if (response && response.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            conflictModalVisible: false
          }
        })
        yield put({
          type: 'autoRecon',
          payload: {
            ...payload,
            ledgerEntry: []
          }
        })
        message.success('Berhasil')
      } else {
        message.error(`Gagal: ${response.message}`)
      }
    },
    * resolve ({ payload = {} }, { call, put }) {
      const response = yield call(queryResolve, payload)
      console.log('response', response)
      if (response && response.success) {
        yield put({
          type: 'updateState',
          payload: {
            resolveModalVisible: false
          }
        })
        yield put({
          type: 'queryDetail',
          payload: {
            id: payload.paymentConflict.id
          }
        })
        message.success('Berhasil')
      } else {
        message.error(`Gagal: ${response.message}`)
      }
    },
    * addMerchant ({ payload = {} }, { call, put }) {
      const response = yield call(addMerchant, payload)
      if (response && response.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            BankMerchantModalVisible: false
          }
        })
        const { location } = payload
        const { query } = location
        const { page = 1, pageSize = 15 } = query
        yield put({
          type: 'queryBankMerchant',
          payload: {
            page,
            pageSize
          }
        })
        message.success('Berhasil')
      } else {
        message.error(`Gagal: ${response.message}`)
      }
    },
    * editMerchant ({ payload = {} }, { call, put }) {
      const response = yield call(editMerchant, payload)
      if (response && response.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            BankMerchantModalVisible: false
          }
        })
        const { location } = payload
        const { query } = location
        const { page = 1, pageSize = 15 } = query
        yield put({
          type: 'queryBankMerchant',
          payload: {
            page,
            pageSize
          }
        })
        message.success('Berhasil')
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
