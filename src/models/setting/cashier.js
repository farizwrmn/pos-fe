import modelExtend from 'dva-model-extend'
import { routerRedux } from 'dva/router'
import { message } from 'antd'
import { lstorage, messageInfo, isEmptyObject } from 'utils'
import {
  query, add, edit, remove,
  queryCashRegisterByStore, queryCurrentOpenCashRegister,
  queryCashierTransSource, queryCashierTransSourceDetail,
  queryCloseRegister
} from '../../services/setting/cashier'
import { pageModel } from './../common'

const success = () => {
  message.success('Cashier has been saved')
}

export default modelExtend(pageModel, {
  namespace: 'cashier',

  state: {
    currentItem: {},
    modalType: 'add',
    activeKey: '0',
    activeTabKeyClose: '1',
    listCashier: [],
    cashierInfo: [],
    listCashRegister: [],
    listCashTransSummary: {},
    listCashTransDetail: {},
    modalVisible: false
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        const { activeKey } = location.query
        const { pathname } = location
        if (pathname === '/setting/cashier') {
          dispatch({
            type: 'updateState',
            payload: {
              activeKey: activeKey || '0'
            }
          })
          if (activeKey === '1') dispatch({ type: 'query' })
        } else if (pathname === '/monitor/cashier/periods') {
          dispatch({ type: 'query' })
          dispatch({ type: 'refreshView' })
        } else if (pathname === '/monitor/cashier/close') {
          const userId = lstorage.getStorageKey('udi')[1]
          dispatch({ type: 'getCashierInformation', payload: { cashierId: userId } })
        }
      })
    }
  },

  effects: {

    * query ({ payload = {} }, { call, put }) {
      const data = yield call(query, payload)
      if (data) {
        yield put({
          type: 'querySuccessCashier',
          payload: {
            list: data.data,
            pagination: {
              current: Number(payload.page) || 1,
              pageSize: Number(payload.pageSize) || 10,
              total: data.total
            }
          }
        })
      }
    },

    * getCashRegisterByStore ({ payload = {} }, { call, put }) {
      const data = yield call(queryCashRegisterByStore, payload.item)
      if (data) {
        yield put({
          type: 'querySuccessCashRegisterByStore',
          payload: {
            listCashRegister: data.data,
            pagination: {
              current: Number(payload.page) || 1,
              pageSize: Number(payload.pageSize) || 10,
              total: data.total
            }
          }
        })
      }
    },

    * getCashierInformation ({ payload = {} }, { call, put }) {
      const currentRegister = yield call(queryCurrentOpenCashRegister, payload)
      const cashierInformation = (Array.isArray(currentRegister.data)) ? currentRegister.data[0] : currentRegister.data
      // const cashierInformation = (results.data || []).length > 0 ? results.data[0] : ''
      if (currentRegister.success) {
        if (!currentRegister.data) {
          messageInfo('There is no cash register open for this store', 'warning', 10)
        } else {
          yield put({
            type: 'updateState',
            payload: {
              cashierInfo: cashierInformation
            }
          })
        }
      } else {
        throw currentRegister
      }
    },

    * getCashierTransSource ({ payload = {} }, { call, put }) {
      const results = yield call(queryCashierTransSource, payload)
      const summaryDetail = (results.data.detail || []).length > 0 ? results.data.detail : ''
      const summaryTotal = (results.data.total || []).length > 0 ? results.data.total : ''
      if (results.success) {
        yield put({
          type: 'updateState',
          payload: {
            listCashTransSummary: { data: summaryDetail, total: summaryTotal },
            activeTabKeyClose: '1'
          }
        })
      } else {
        throw results
      }
    },

    * getCashierTransSourceDetail ({ payload = {} }, { call, put }) {
      const results = yield call(queryCashierTransSourceDetail, payload)
      const transDetail = (results.data.detail || []).length > 0 ? results.data.detail : ''
      const transTotal = (results.data.total || []).length > 0 ? results.data.total : ''
      if (results.success) {
        yield put({
          type: 'updateState',
          payload: {
            listCashTransDetail: { data: transDetail, total: transTotal },
            activeTabKeyClose: '2'
          }
        })
      } else {
        throw results
      }
    },

    * closeCashRegister ({ payload = {} }, { call, put }) {
      const results = yield call(queryCloseRegister, payload)
      if (results.success) {
        messageInfo('This Cash Register has been successfully closed', 'info', 10)
        yield put({
          type: 'updateState',
          payload: {
            cashRegister: { status: 'C' }
          }
        })
      } else {
        throw results
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

    * add ({ payload }, { call, put }) {
      const data = yield call(add, payload)
      if (data.success) {
        success()
        yield put({
          type: 'updateState',
          payload: {
            modalType: 'add',
            currentItem: {}
          }
        })
      } else {
        yield put({
          type: 'updateState',
          payload: {
            currentItem: payload
          }
        })
        throw data
      }
    },

    * edit ({ payload }, { select, call, put }) {
      const id = yield select(({ cashier }) => cashier.currentItem.id)
      const newCashier = { ...payload, id }
      const data = yield call(edit, newCashier)
      if (data.success) {
        success()
        yield put({
          type: 'updateState',
          payload: {
            modalType: 'add',
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
        yield put({
          type: 'updateState',
          payload: {
            currentItem: payload
          }
        })
        throw data
      }
    }
  },

  reducers: {
    updateState (state, { payload }) {
      const { cashRegister } = payload
      if (!isEmptyObject(cashRegister)) state.cashierInfo.status = cashRegister.status
      return {
        ...state,
        ...payload
      }
    },
    updateStateClose (state, { payload }) {
      return {
        ...state,
        ...payload
      }
    },

    querySuccessCashier (state, action) {
      const { list, pagination } = action.payload
      return {
        ...state,
        list,
        listCashier: list,
        pagination: {
          ...state.pagination,
          ...pagination
        }
      }
    },

    querySuccessCashRegisterByStore (state, action) {
      const { listCashRegister, pagination } = action.payload
      return {
        ...state,
        listCashRegister,
        pagination: {
          ...state.pagination,
          ...pagination
        }
      }
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
    },

    refreshView (state) {
      return {
        ...state,
        cashierInfo: []
      }
    }
  }
})
