import modelExtend from 'dva-model-extend'
import {
  queryListVoidEdcDeposit,
  queryListEdcByBalanceId,
  queryListVoidByBalanceId,
  queryListEdcInputByBalanceId,
  queryListVoidInputByBalanceId,
  insertVoidEdcDeposit,
  queryListTransaction,
  queryListVoidTransaction
} from 'services/setoran/physicalMoney'
import moment from 'moment'
import { message } from 'antd'
import { lstorage } from 'utils'
import pathToRegexp from 'path-to-regexp'
import { pageModel } from '../common'

const success = () => {
  message.success('Account Code has been saved')
}

export default modelExtend(pageModel, {
  namespace: 'posSetoran',

  state: {
    currentItem: {},
    newTransNo: '',
    modalType: 'add',
    activeKey: '0',
    list: [],
    listEdc: [],
    listVoid: [],
    listEdcInput: [],
    listVoidInput: [],
    listTransaction: [],
    listVoidTransaction: [],
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      current: 1
    }
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        const { activeKey, modalType, ...other } = location.query
        const { pathname } = location
        if (pathname === '/balance/closing') {
          const transDate = moment().format('YYYY-MM-DD')
          const storeName = lstorage.getCurrentUserStoreName().trim().slice(2)
          dispatch({ type: 'queryListVoidEdcDeposit', payload: { ...other, storeName, transDate } })
        }
        const match = pathToRegexp('/balance/invoice/:id').exec(pathname)
        const balanceId = match && match[1]
        if (match) {
          dispatch({ type: 'queryListEdcByBalanceId', payload: { ...other, balanceId } })
          dispatch({ type: 'queryListVoidByBalanceId', payload: { ...other, balanceId } })
          dispatch({ type: 'queryListEdcInputByBalanceId', payload: { ...other, balanceId } })
          dispatch({ type: 'queryListVoidInputByBalanceId', payload: { ...other, balanceId } })
          dispatch({ type: 'queryListTransaction', payload: { ...other, balanceId } })
          dispatch({ type: 'queryListVoidTransaction', payload: { ...other, balanceId } })
        }
      })
    }
  },

  effects: {
    * queryListVoidEdcDeposit ({ payload = {} }, { call, put }) {
      const data = yield call(queryListVoidEdcDeposit, payload)
      if (data.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            list: data.data,
            pagination: {
              current: Number(data.page) || 1,
              pageSize: Number(data.pageSize) || 10,
              total: data.total
            }
          }
        })
      }
    },
    * queryListTransaction ({ payload = {} }, { call, put }) {
      const data = yield call(queryListTransaction, payload)
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            listTransaction: data.data,
            pagination: {
              current: Number(data.page) || 1,
              pageSize: Number(data.pageSize) || 10,
              total: data.total
            }
          }
        })
      }
    },
    * queryListVoidTransaction ({ payload = {} }, { call, put }) {
      const data = yield call(queryListVoidTransaction, payload)
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            listVoidTransaction: data.data,
            pagination: {
              current: Number(data.page) || 1,
              pageSize: Number(data.pageSize) || 10,
              total: data.total
            }
          }
        })
      }
    },
    * queryListEdcByBalanceId ({ payload = {} }, { call, put }) {
      const data = yield call(queryListEdcByBalanceId, payload)
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            listEdc: data.data,
            pagination: {
              current: Number(data.page) || 1,
              pageSize: Number(data.pageSize) || 10,
              total: data.total
            }
          }
        })
      }
    },
    * queryListVoidByBalanceId ({ payload = {} }, { call, put }) {
      const data = yield call(queryListVoidByBalanceId, payload)
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            listVoid: data.data,
            pagination: {
              current: Number(data.page) || 1,
              pageSize: Number(data.pageSize) || 10,
              total: data.total
            }
          }
        })
      }
    },
    * queryListEdcInputByBalanceId ({ payload = {} }, { call, put }) {
      const data = yield call(queryListEdcInputByBalanceId, payload)
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            listEdcInput: data.data,
            pagination: {
              current: Number(data.page) || 1,
              pageSize: Number(data.pageSize) || 10,
              total: data.total
            }
          }
        })
      }
    },
    * queryListVoidInputByBalanceId ({ payload = {} }, { call, put }) {
      const data = yield call(queryListVoidInputByBalanceId, payload)
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            listVoidInput: data.data,
            pagination: {
              current: Number(data.page) || 1,
              pageSize: Number(data.pageSize) || 10,
              total: data.total
            }
          }
        })
      }
    }
  },
  * insertVoidEdcDeposit ({ payload = {} }, { call, put }) {
    const data = yield call(insertVoidEdcDeposit, payload)
    if (data.success) {
      success()
      yield put({
        type: 'updateState',
        payload: {
          modalType: 'add',
          currentItem: {}
        }
      })
      if (payload.reset) {
        payload.reset()
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
