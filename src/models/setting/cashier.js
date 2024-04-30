import modelExtend from 'dva-model-extend'
import { routerRedux } from 'dva/router'
import { message, Modal, Row, Col } from 'antd'
import { messageInfo, isEmptyObject } from 'utils'
import {
  query, add, edit, remove,
  queryCashRegisterByStore,
  queryCashierTransSource, queryCashierTransSourceDetail,
  queryCloseRegister, getCashRegisterDetails, getClosedCashRegister,
  sendRequestOpenCashRegister, getRequestedCashRegister, approveRequestOpenCashRegister
} from '../../services/setting/cashier'
import { pageModel } from './../common'

const success = () => {
  message.success('Cashier has been saved')
}

export default modelExtend(pageModel, {
  namespace: 'cashier',

  state: {
    currentItem: {},
    currentCashier: { id: null, status: null },
    modalType: 'add',
    activeKey: '0',
    activeTabKeyClose: '1',
    listCashier: [],
    cashierInfo: {},
    listCashRegister: [],
    listCashTransSummary: {},
    listCashTransDetail: {},
    searchText: null,
    modalVisible: false,
    listCashRegisterDetails: [],
    listClosedCashRegister: [],
    listRequestedCashRegister: [],
    cashRegisterDetails: [],
    requestActiveTabKey: '1',
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      current: 1
    }
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        dispatch({ type: 'refreshPage' })
        const { activeKey, ...other } = location.query
        const { pathname } = location
        if (pathname === '/setting/cashier') {
          dispatch({
            type: 'updateState',
            payload: {
              activeKey: activeKey || '0'
            }
          })
          if (activeKey === '1') dispatch({ type: 'query', payload: other })
        } else if (pathname === '/monitor/cashier/periods') {
          dispatch({ type: 'query' })
        } else if (pathname === '/monitor/cashier/request') {
          dispatch({ type: 'getClosedCashRegister', payload: { ...other } })
        } else if (pathname === '/monitor/cashier/approve') {
          dispatch({ type: 'getRequestedCashRegister' })
        } else if (pathname === '/report/pos/summary') {
          dispatch({ type: 'resetFilter' })
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
      if (data.success && data.total > 0) {
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
        if (location.pathname === '/monitor/cashier/periods') message.success('Double click the row to see the details')
      } else {
        yield put({
          type: 'updateState',
          payload: {
            listCashRegister: [],
            pagination: {
              total: 0
            }
          }
        })
        if (location.pathname === '/monitor/cashier/periods') message.error('No Data!')
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
    },

    * getCashRegisterDetails ({ payload }, { call, put }) {
      const data = yield call(getCashRegisterDetails, { id: payload })
      if (data.success && data.data.length > 0) {
        yield put({
          type: 'updateState',
          payload: {
            activeKey: '1',
            listCashRegisterDetails: data.data,
            pagination: {
              current: Number(payload.page) || 1,
              pageSize: Number(payload.pageSize) || 10,
              total: data.data.length
            }
          }
        })
      } else {
        message.error('No Details!')
      }
    },

    * getClosedCashRegister ({ payload }, { call, put }) {
      const data = yield call(getClosedCashRegister, payload)
      if (data.success && data.data.count > 0) {
        yield put({
          type: 'querySuccessClosedCashRegister',
          payload: {
            listClosedCashRegister: data.data.rows,
            pagination: {
              current: Number(data.page) || 1,
              pageSize: Number(data.pageSize) || 10,
              total: data.data.count
            }
          }
        })
      } else {
        yield put({
          type: 'updateState',
          payload: {
            listClosedCashRegister: [],
            pagination: { total: 0 }
          }
        })
        message.error('No Data!')
      }
    },

    * getRequestedCashRegister ({ payload }, { call, put }) {
      const data = yield call(getRequestedCashRegister, payload)
      if (data.success && data.data.count > 0) {
        yield put({
          type: 'querySuccessRequestedCashRegister',
          payload: {
            listRequestedCashRegister: data.data.rows,
            pagination: {
              current: Number(data.page) || 1,
              pageSize: Number(data.pageSize) || 10,
              total: data.data.count
            }
          }
        })
      } else {
        yield put({
          type: 'updateState',
          payload: {
            listRequestedCashRegister: [],
            pagination: { total: 0 }
          }
        })
        message.error('No Data!')
      }
    },

    * sendRequestOpenCashRegister ({ payload }, { call, put }) {
      const data = yield call(sendRequestOpenCashRegister, { id: payload.id, data: payload.data })
      if (data.success) {
        yield put({
          type: 'successSendRequestOpenCashRegister',
          payload: data.cashregisters
        })
      } else {
        throw data
      }
    },

    * approveRequestOpenCashRegister ({ payload }, { call, put }) {
      const data = yield call(approveRequestOpenCashRegister, payload)
      if (data.success) {
        message.success('info request open cashier period successfully approved')
        yield put({ type: 'getRequestedCashRegister' })
        yield put({ type: 'updateState', payload: { currentItem: {} } })
      } else {
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

    querySuccessClosedCashRegister (state, { payload }) {
      const { listClosedCashRegister, pagination } = payload
      return {
        ...state,
        listClosedCashRegister,
        pagination: { ...state.pagination, ...pagination }
      }
    },

    querySuccessRequestedCashRegister (state, { payload }) {
      const { listRequestedCashRegister, pagination } = payload
      return {
        ...state,
        listRequestedCashRegister,
        pagination: { ...state.pagination, ...pagination }
      }
    },

    successSendRequestOpenCashRegister (state, { payload }) {
      return {
        ...state,
        currentItem: payload
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

    checkRequest (state, { payload }) {
      const { checked, record } = payload
      let currentItem = {}
      if (checked) {
        currentItem = record
        Modal.info({
          title: 'Request to open cash Register',
          content: <Row>
            <Col span={5}>
              <p>Cashier</p>
              <p>Problem</p>
              <p>Action</p>
            </Col>
            <Col span={1}>
              <p>:</p>
              <p>:</p>
              <p>:</p>
            </Col>
            <Col span={18}>
              <p>{currentItem.cashierId}</p>
              <p>{currentItem.problemDesc}</p>
              <p>{currentItem.actionDesc}</p>
            </Col>
          </Row>
        })
      } else {
        currentItem = {}
      }
      return { ...state, currentItem }
    },

    resetFilter (state) {
      return {
        ...state,
        cashierInfo: {},
        currentCashier: { id: null, status: null },
        listCashRegister: []
      }
    },

    refreshPage (state) {
      return {
        ...state,
        currentItem: {},
        modalType: 'add',
        activeKey: '0',
        activeTabKeyClose: '1',
        listCashier: [],
        cashierInfo: {},
        listCashRegister: [],
        listCashTransSummary: {},
        listCashTransDetail: {},
        modalVisible: false,
        listClosedCashRegister: [],
        requestActiveTabKey: '1',
        pagination: {
          showSizeChanger: true,
          showQuickJumper: true,
          current: 1
        }
      }
    }
  }
})
