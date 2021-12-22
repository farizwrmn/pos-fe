import modelExtend from 'dva-model-extend'
import { message } from 'antd'
import { lstorage } from 'utils'
import { queryById, queryEmployee, add } from 'services/finance/pettyCashDetail'
import { queryEntryList } from 'services/payment/bankentry'
import pathToRegexp from 'path-to-regexp'
import {
  JOURNALENTRY,
  EXPENSE,
  PPAYHEADER
} from 'utils/variable'
import { pageModel } from '../common'

export default modelExtend(pageModel, {
  namespace: 'pettyCashDetail',

  state: {
    data: {},
    listDetail: [],
    listDetailTrans: [],
    listAccounting: [],
    currentItem: {},
    currentItemList: {},
    modalType: 'add',
    modalItemType: 'add',
    inputType: null,
    activeKey: '0',
    listCash: [],
    modalVisible: false,
    listItem: [],
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      current: 1
    },
    list: [],
    listEmployee: []
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        const match = pathToRegexp('/balance/finance/petty-cash/:id').exec(location.pathname)
        if (match) {
          dispatch({
            type: 'queryDetail',
            payload: {
              id: decodeURIComponent(match[1]),
              storeId: lstorage.getCurrentUserStore(),
              match
            }
          })
        }
      })
    }
  },

  effects: {
    * queryDetail ({ payload = {} }, { call, put }) {
      const response = yield call(queryById, payload)
      if (response.success && response.data) {
        yield put({
          type: 'updateState',
          payload: {
            data: response.data,
            listDetail: response.detailOpen,
            listDetailTrans: response.detail,
            listAccounting: []
          }
        })
        yield put({
          type: 'queryAccounting',
          payload: {
            response
          }
        })
      } else {
        throw response
      }
    },

    * queryAccounting ({ payload = {} }, { call, put }) {
      const { response } = payload
      let listAccounting = []
      if (response.success && response.data && response.data.id) {
        if (response.data.journalEntryId) {
          const reconData = yield call(queryEntryList, {
            transactionId: response.data.journalEntryId,
            transactionType: JOURNALENTRY,
            type: 'all'
          })
          if (reconData && reconData.data) {
            listAccounting = listAccounting.concat(reconData.data)
          }
        }
        if (response.detail && response.detail.length > 0) {
          for (let key in response.detail) {
            const item = response.detail[key]
            if (item.transactionType === 'OUT' && item.cashEntryId) {
              const reconData = yield call(queryEntryList, {
                transactionId: item.cashEntryId,
                transactionType: EXPENSE,
                type: 'all'
              })
              if (reconData && reconData.data) {
                listAccounting = listAccounting.concat(reconData.data)
              }
            }
            if (item.transactionType === 'IN' && item.journalEntryId) {
              const reconData = yield call(queryEntryList, {
                transactionId: item.journalEntryId,
                transactionType: JOURNALENTRY,
                type: 'all'
              })
              if (reconData && reconData.data) {
                listAccounting = listAccounting.concat(reconData.data)
              }
            }
            if (item.transactionType === 'CLOSE' && item.journalEntryId) {
              const reconData = yield call(queryEntryList, {
                transactionId: item.journalEntryId,
                transactionType: JOURNALENTRY,
                type: 'all'
              })
              if (reconData && reconData.data) {
                listAccounting = listAccounting.concat(reconData.data)
              }
            }
            if (item.transactionType === 'PRC' && item.purchaseId) {
              const reconData = yield call(queryEntryList, {
                parentTransactionId: item.purchaseId,
                parentTransactionType: PPAYHEADER,
                type: 'all'
              })
              if (reconData && reconData.data) {
                listAccounting = listAccounting.concat(reconData.data)
              }
            }
          }
        }
        yield put({
          type: 'updateState',
          payload: {
            listAccounting
          }
        })
      }
    },

    * queryEmployee ({ payload = {} }, { call, put }) {
      const response = yield call(queryEmployee, payload)
      if (response.success) {
        yield put({
          type: 'updateState',
          payload: {
            listEmployee: response.data
          }
        })
      } else {
        throw response
      }
    },

    * insertExpense ({ payload = {} }, { call, put }) {
      const response = yield call(add, {
        ...payload.item,
        storeId: lstorage.getCurrentUserStore()
      })
      if (response.success) {
        yield put({
          type: 'pos/updateState',
          payload: {
            modalCashRegisterVisible: false
          }
        })
        yield put({
          type: 'pettyExpense/updateState',
          payload: {
            modalCashRegisterVisible: false
          }
        })
        if (payload.reset) {
          payload.reset()
        }
        message.success('Success insert expense')
      } else {
        throw response
      }
    }
  },

  reducers: {
    querySuccess (state, action) {
      const { list, pagination } = action.payload
      return {
        ...state,
        list,
        pagination: {
          ...state.pagination,
          ...pagination
        }
      }
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
