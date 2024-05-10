import modelExtend from 'dva-model-extend'
import { routerRedux } from 'dva/router'
import { Modal, message } from 'antd'
import { lstorage } from 'utils'
import { query as querySequence } from 'services/sequence'
import { queryEntryList } from 'services/payment/bankentry'
import {
  VOUCHER,
  VOUCHER_STORE_ID
} from 'utils/variable'
import { queryById, query, queryId, add, addPayment, edit, remove } from 'services/marketing/voucher'
import { pageModel } from 'common'
import pathToRegexp from 'path-to-regexp'

const success = () => {
  message.success('Voucher entry has been saved')
}

export default modelExtend(pageModel, {
  namespace: 'voucherdetail',

  state: {
    data: {},
    listDetail: [],
    listAccounting: [],
    selectedRowKeys: [],
    currentItem: {},
    currentItemList: {},
    match: {},
    modalType: 'add',
    modalItemType: 'add',
    inputType: null,
    activeKey: '0',
    listCash: [],
    visiblePayment: false,
    modalVisible: false,
    listItem: [],
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      current: 1
    }
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        const match = pathToRegexp('/marketing/voucher/:id').exec(location.pathname)
        if (match) {
          dispatch({
            type: 'queryDetail',
            payload: {
              id: decodeURIComponent(match[1]),
              storeId: lstorage.getCurrentUserStore(),
              match
            }
          })
          dispatch({
            type: 'updateState',
            payload: {
              match
            }
          })
        }
      })
    }
  },

  effects: {
    * paymentVoucher ({ payload = {} }, { select, call, put }) {
      const { data } = payload
      const selectedRowKeys = yield select(({ voucherdetail }) => voucherdetail.selectedRowKeys)
      const listDetail = yield select(({ voucherdetail }) => voucherdetail.listDetail)
      const detailItem = yield select(({ voucherdetail }) => voucherdetail.data)
      const match = yield select(({ voucherdetail }) => voucherdetail.match)
      if (selectedRowKeys.length === 0) {
        message.error('Select at least 1 row')
        return
      }
      let listSelectedId = listDetail
        .filter(filtered => selectedRowKeys.includes(filtered.no))
        .map(detail => detail.id)
      if (listSelectedId.length === 0) {
        message.error('Select at least 1 row')
        return
      }
      const response = yield call(addPayment, { item: { id: detailItem.id, description: data.description, accountId: data.accountId, storeId: VOUCHER_STORE_ID }, listSelectedId })
      if (response && response.success) {
        yield put({
          type: 'queryDetail',
          payload: {
            id: detailItem.id,
            storeId: lstorage.getCurrentUserStore(),
            match
          }
        })
        yield put({
          type: 'updateState',
          payload: {
            selectedRowKeys: [],
            visiblePayment: false
          }
        })
        if (payload && payload.reset) {
          payload.reset()
        }
      } else {
        throw response
      }
    },

    * queryDetail ({ payload = {} }, { call, put }) {
      const data = yield call(queryById, payload)
      if (data.success && data.data) {
        const { purchase, ...other } = data.data
        const voucherDetail = data.detail
        let listAccounting = []
        if (payload && payload.match && other && other.id) {
          const reconData = yield call(queryEntryList, {
            transactionId: other.id,
            transactionType: VOUCHER,
            type: 'all'
          })
          if (reconData && reconData.data) {
            listAccounting = listAccounting.concat(reconData.data)
          }
        }
        yield put({
          type: 'updateState',
          payload: {
            data: other,
            listDetail: voucherDetail.map((item, index) => ({ no: index + 1, ...item })),
            listAccounting
          }
        })
      } else {
        throw data
      }
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

    * querySequence ({ payload = {} }, { select, call, put }) {
      const invoice = {
        seqCode: 'VOU',
        type: lstorage.getCurrentUserStore(),
        ...payload
      }
      const data = yield call(querySequence, invoice)
      const currentItem = yield select(({ voucherdetail }) => voucherdetail.currentItem)
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
        const { journalEntryDetail, ...currentItem } = data.data
        yield put({
          type: 'updateState',
          payload: {
            currentItem,
            modalType: 'edit',
            listItem: journalEntryDetail ?
              journalEntryDetail.map((item, index) => ({
                no: index + 1,
                ...item,
                accountId: item.accountId,
                accountCode: {
                  key: item.accountId,
                  label: `${item.accountCode.accountName} (${item.accountCode.accountCode})`
                }
              }))
              : []
          }
        })
      } else {
        throw data
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

    * add ({ payload = {} }, { call, put }) {
      const { oldValue } = payload
      yield put({
        type: 'updateState',
        payload: {
          currentItem: oldValue
        }
      })
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
        yield put({
          type: 'updateState',
          payload: {
            currentItem: payload.oldValue
          }
        })
        throw data
      }
    },

    * edit ({ payload }, { select, call, put }) {
      const id = yield select(({ voucherdetail }) => voucherdetail.currentItem.id)
      const newCounter = { ...payload, id }
      const data = yield call(edit, newCounter)
      if (data.success) {
        success()
        payload.reset()
        yield put({
          type: 'updateState',
          payload: {
            modalType: 'add',
            currentItem: {},
            listItem: [],
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
