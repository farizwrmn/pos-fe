import modelExtend from 'dva-model-extend'
import { routerRedux } from 'dva/router'
import { Modal, message } from 'antd'
import { lstorage } from 'utils'
import moment from 'moment'
import pathToRegexp from 'path-to-regexp'
import { query as querySequence } from '../../services/sequence'
import { queryById, query, queryId, add, edit, remove, transfer, queryBankRecon, updateBankRecon } from '../../services/payment/bankentry'
import { queryCurrentOpenCashRegister } from '../../services/setting/cashier'
import { queryById as queryPaymentById } from '../../services/payment/payment'
import { queryById as queryPayableById } from '../../services/payment/payable'
import { add as importCsv, autoRecon, updateRecon } from '../../services/payment/paymentValidationImport'
import { pageModel } from './../common'

const success = () => {
  message.success('Deposit has been saved')
}

export default modelExtend(pageModel, {
  namespace: 'bankentry',

  state: {
    data: {},
    listDetail: [],
    currentItem: {},
    currentItemList: {},
    modalType: 'add',
    modalItemType: 'add',
    inputType: null,
    activeKey: '0',
    listCash: [],
    modalVisible: false,
    selectedRowKeys: [],
    listItem: [],
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      current: 1
    },
    listBankRecon: [],
    conflictedCSV: [],
    selectedConflictedRowKeys: [],
    summaryBankRecon: [],
    accountId: null,
    from: null,
    to: null
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        const { activeKey, edit, ...other } = location.query
        const { pathname } = location
        const match = pathToRegexp('/bank-entry/:id').exec(location.pathname)
        if (match) {
          dispatch({
            type: 'queryDetail',
            payload: {
              id: decodeURIComponent(match[1]),
              storeId: lstorage.getCurrentUserStore()
            }
          })
        }
        if (pathname === '/bank-history'
          || pathname === '/bank-recon') {
          dispatch({
            type: 'bankentry/queryBankRecon',
            payload: other
          })
        }
        if (pathname === '/bank-entry') {
          dispatch({
            type: 'updateState',
            payload: {
              activeKey: activeKey || '0'
            }
          })
          if (activeKey === '1') {
            dispatch({ type: 'query', payload: other })
          }

          if (edit && edit !== '' && edit !== '0') {
            dispatch({
              type: 'setEdit',
              payload: {
                edit
              }
            })
          } else {
            dispatch({ type: 'querySequence' })
          }
        }
      })
    }
  },

  effects: {
    * queryDetail ({ payload = {} }, { call, put }) {
      const data = yield call(queryById, payload)
      if (data.success && data.data) {
        const { purchase, bankEntryDetail, ...other } = data.data
        yield put({
          type: 'updateState',
          payload: {
            data: other,
            listDetail: bankEntryDetail
          }
        })
      } else {
        throw data
      }
    },

    * linkSales ({ payload = {} }, { select, call, put }) {
      const user = yield select(({ app }) => app.user)
      const data = yield call(queryPaymentById, payload)
      if (data.success) {
        const loginTimeDiff = lstorage.getLoginTimeDiff()
        const localId = lstorage.getStorageKey('udi')
        const listUserStores = lstorage.getListUserStores()
        const serverTime = moment(new Date()).subtract(loginTimeDiff, 'milliseconds').toDate()
        const dataUdi = [
          localId[1],
          localId[2],
          [data.data.storeId],
          localId[4],
          moment(new Date(serverTime)),
          localId[6],
          listUserStores.filter(filtered => filtered.value === data.data.storeId)[0].consignmentId ? listUserStores.filter(filtered => filtered.value === data.data.storeId)[0].consignmentId.toString() : null
        ]
        lstorage.putStorageKey('udi', dataUdi, localId[0])
        localStorage.setItem('newItem', JSON.stringify({ store: false }))
        localStorage.removeItem('cashier_trans')
        localStorage.removeItem('queue')
        localStorage.removeItem('member')
        localStorage.removeItem('workorder')
        localStorage.removeItem('memberUnit')
        localStorage.removeItem('mechanic')
        localStorage.removeItem('service_detail')
        localStorage.removeItem('consignment')
        localStorage.removeItem('bundle_promo')
        localStorage.removeItem('cashierNo')
        yield put({ type: 'app/query', payload: { userid: user.userid, role: data.data.storeId } })
        yield put(routerRedux.push(`/accounts/payment/${encodeURIComponent(data.data.transNo)}`, { target: '_blank' }))
      } else {
        throw data
      }
    },

    * linkPurchase ({ payload = {} }, { select, call, put }) {
      const user = yield select(({ app }) => app.user)
      const data = yield call(queryPayableById, payload)
      if (data.success) {
        const loginTimeDiff = lstorage.getLoginTimeDiff()
        const localId = lstorage.getStorageKey('udi')
        const listUserStores = lstorage.getListUserStores()
        const serverTime = moment(new Date()).subtract(loginTimeDiff, 'milliseconds').toDate()
        const dataUdi = [
          localId[1],
          localId[2],
          [data.data.storeId],
          localId[4],
          moment(new Date(serverTime)),
          localId[6],
          listUserStores.filter(filtered => filtered.value === data.data.storeId)[0].consignmentId ? listUserStores.filter(filtered => filtered.value === data.data.storeId)[0].consignmentId.toString() : null
        ]
        lstorage.putStorageKey('udi', dataUdi, localId[0])
        localStorage.setItem('newItem', JSON.stringify({ store: false }))
        localStorage.removeItem('cashier_trans')
        localStorage.removeItem('queue')
        localStorage.removeItem('member')
        localStorage.removeItem('workorder')
        localStorage.removeItem('memberUnit')
        localStorage.removeItem('mechanic')
        localStorage.removeItem('service_detail')
        localStorage.removeItem('consignment')
        localStorage.removeItem('bundle_promo')
        localStorage.removeItem('cashierNo')
        yield put({ type: 'app/query', payload: { userid: user.userid, role: data.data.storeId } })
        yield put(routerRedux.push(`/accounts/payable/${encodeURIComponent(data.data.transNo)}`))
      } else {
        throw data
      }
    },

    * linkCashEntry ({ payload = {} }, { select, put }) {
      const user = yield select(({ app }) => app.user)
      yield put({ type: 'app/query', payload: { userid: user.userid, role: payload.storeId } })
      yield put(routerRedux.push(`/cash-entry/${payload.id}`))
    },

    * linkAdjust ({ payload = {} }, { select, put }) {
      const user = yield select(({ app }) => app.user)
      yield put({ type: 'app/query', payload: { userid: user.userid, role: payload.storeId } })
      yield put(routerRedux.push(`/transaction/adjust/${payload.id}`))
    },

    * linkBankEntry ({ payload = {} }, { select, put }) {
      const user = yield select(({ app }) => app.user)
      yield put({ type: 'app/query', payload: { userid: user.userid, role: payload.storeId } })
      yield put(routerRedux.push(`/bank-entry/${payload.id}`))
    },

    * linkJournalEntry ({ payload = {} }, { select, put }) {
      const user = yield select(({ app }) => app.user)
      yield put({ type: 'app/query', payload: { userid: user.userid, role: payload.storeId } })
      yield put(routerRedux.push(`/journal-entry/${payload.id}`))
    },

    * query ({ payload = {} }, { call, put }) {
      const { edit, ...other } = payload
      const data = yield call(query, other)
      if (data) {
        yield put({
          type: 'querySuccessCounter',
          payload: {
            listCash: data.data,
            pagination: {
              current: Number(payload.page) || 1,
              pageSize: Number(payload.pageSize) || 10,
              total: data.total
            }
          }
        })
      }
    },

    * queryBankRecon ({ payload = {} }, { call, put }) {
      yield put({
        type: 'updateState',
        payload: {
          selectedRowKeys: []
        }
      })
      const response = yield call(queryBankRecon, {
        ...payload,
        type: 'all',
        order: 'transDate'
      })
      if (response && response.success) {
        yield put({
          type: 'updateState',
          payload
        })
        yield put({
          type: 'querySuccessBankRecon',
          payload: {
            listBankRecon: response.data,
            summaryBankRecon: response.summary,
            pagination: {
              current: Number(payload.page) || 1,
              pageSize: Number(payload.pageSize) || 10,
              total: response.total
            }
          }
        })
      } else {
        throw response
      }
    },
    * importCsv ({ payload = {} }, { call }) {
      console.log('payload', payload)
      const response = yield call(importCsv, payload)
      if (response && response.success) {
        message.success('Berhasil import')
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
            listBankRecon: accountLedger,
            summaryBankRecon: []
          }
        })
        message.success(`Berhasil! ${conflictedImportData.length > 0 ? 'Terdapat conflict, selesaikan secara manual!' : ''}`)
      } else {
        message.error(`Gagal: ${response.message}`)
      }
    },
    * reconImportData ({ payload = {} }, { call, put }) {
      payload.storeId = lstorage.getCurrentUserStore()
      const { conflictedCSV, id } = payload
      const response = yield call(updateRecon, id)
      if (response && response.success) {
        yield put({
          type: 'updateState',
          payload: {
            conflictedCSV: conflictedCSV.filter(filtered => filtered.id !== id)
          }
        })
        message.success('Berhasil!')
      } else {
        message.error(`Gagal: ${response.message}`)
      }
    },
    * updateBankRecon ({ payload = {} }, { call, put, select }) {
      let {
        accountId,
        from,
        to
      } = yield select(({ bankentry }) => bankentry)
      const response = yield call(updateBankRecon, payload)
      if (response.success) {
        yield put({
          type: 'updateState',
          payload: {
            selectedRowKeys: []
          }
        })
        yield put({
          type: 'queryBankRecon',
          payload: {
            accountId,
            from,
            to,
            recon: 0
          }
        })
        message.success('Bank reconciliation successfully updated')
      } else {
        throw response
      }
    },

    * querySequence ({ payload = {} }, { select, call, put }) {
      const invoice = {
        seqCode: 'BTR',
        type: lstorage.getCurrentUserStore(),
        ...payload
      }
      const data = yield call(querySequence, invoice)
      const currentItem = yield select(({ bankentry }) => bankentry.currentItem)
      const transNo = data.data
      yield put({
        type: 'updateState',
        payload: {
          currentItem: {
            ...currentItem,
            transNo
          }
        }
      })
    },

    * setEdit ({ payload }, { call, put }) {
      const data = yield call(queryId, { id: payload.edit, relationship: 1 })
      if (data.success) {
        const { bankEntryDetail, ...currentItem } = data.data
        yield put({
          type: 'updateState',
          payload: {
            currentItem,
            modalType: 'edit',
            listItem: bankEntryDetail ?
              bankEntryDetail.map((item, index) => ({
                no: index + 1,
                ...item,
                accountId: item.accountId
              }))
              : []
          }
        })
      } else {
        throw data
      }
    },

    * transfer ({ payload }, { call, put }) {
      const response = yield call(transfer, payload)
      if (response.success) {
        yield put({
          type: 'updateState',
          payload: {
            modalType: 'add',
            currentItem: {},
            listItem: []
          }
        })
        payload.resetFields()
      } else {
        throw response
      }
    },

    * delete ({ payload }, { call, put }) {
      const data = yield call(remove, payload)
      if (data.success) {
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },

    * add ({ payload }, { call, put, select }) {
      yield put({
        type: 'updateState',
        payload: {
          currentItem: payload.oldValue
        }
      })
      const cashier = yield select(({ app }) => app.user)
      const currentRegister = yield call(queryCurrentOpenCashRegister, { cashierId: cashier.userid })
      if (currentRegister.success) {
        if (currentRegister.data) {
          const cashierInformation = (Array.isArray(currentRegister.data)) ? currentRegister.data[0] : currentRegister.data
          payload.data.cashierTransId = cashierInformation ? cashierInformation.id : undefined
          payload.data.transDate = cashierInformation ? cashierInformation.period : payload.data.transDate ? payload.data.transDate : undefined
          const data = yield call(add, payload)
          if (data.success) {
            success()
            payload.reset()
            yield put({
              type: 'updateState',
              payload: {
                modalType: 'add',
                currentItem: {},
                listItem: []
              }
            })
            yield put({ type: 'querySequence' })
            Modal.success({
              title: 'Transaction success',
              content: 'Transaction has been saved'
            })
          } else {
            throw data
          }
        } else {
          Modal.warning({
            title: 'No cashierInformation',
            content: `No cashier information for ${cashier.userid}`
          })
        }
      } else {
        throw currentRegister
      }
    },

    * edit ({ payload }, { select, call, put }) {
      const id = yield select(({ bankentry }) => bankentry.currentItem.id)
      const newCounter = { ...payload, id }
      const data = yield call(edit, newCounter)
      if (data.success) {
        success()
        payload.reset()
        yield put({
          type: 'updateState',
          payload: {
            modalType: 'add',
            listItem: [],
            currentItem: {},
            activeKey: '1'
          }
        })
        const { pathname } = location
        yield put(routerRedux.push({
          pathname,
          query: {
            activeKey: '1'
          }
        }))
        yield put({ type: 'query' })
      } else {
        throw data
      }
    }
  },

  reducers: {
    querySuccessCounter (state, action) {
      const { listCash, pagination } = action.payload
      return {
        ...state,
        listCash,
        pagination: {
          ...state.pagination,
          ...pagination
        }
      }
    },

    querySuccessBankRecon (state, action) {
      const { listBankRecon, summaryBankRecon, pagination } = action.payload
      return {
        ...state,
        listBankRecon,
        summaryBankRecon,
        pagination: {
          ...state.pagination,
          ...pagination
        }
      }
    },

    updateCurrentItem (state, { payload }) {
      const { currentItem } = state
      return { ...state, currentItem: { ...currentItem, ...payload } }
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
