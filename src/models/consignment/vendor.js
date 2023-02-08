import { message } from 'antd'
import modelExtend from 'dva-model-extend'
import {
  query,
  queryAdd,
  queryEdit,
  queryLast,
  queryResetPassword
} from 'services/consignment/vendors'
import { pageModel } from '../common'


export default modelExtend(pageModel, {
  namespace: 'consignmentVendor',

  state: {
    activeKey: '0',
    formType: 'add',
    list: [],
    selectedVendor: {},
    lastVendor: {},
    q: null,
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      current: 1
    }
  },

  subscriptions: {
    setup ({ history, dispatch }) {
      history.listen((location) => {
        if (location.pathname === '/integration/consignment/vendor'
          || location.pathname === '/integration/consignment/return-report'
          || location.pathname === '/integration/consignment/stock-report'
          || location.pathname === '/integration/consignment/profit-report') {
          dispatch({
            type: 'updateState',
            payload: {
              selectedVendor: {}
            }
          })
          dispatch({
            type: 'query',
            payload: {}
          })
          dispatch({
            type: 'queryLast',
            payload: {}
          })
        }
      })
    }
  },

  effects: {
    * query ({ payload = {} }, { call, put }) {
      const { q, pagination } = payload
      const params = {
        q,
        pagination: pagination || { current: 1, pageSize: 10 }
      }
      const response = yield call(query, params)
      const vendors = response.data
      yield put({
        type: 'querySuccess',
        payload: {
          ...payload,
          list: vendors.list,
          pagination: {
            showSizeChanger: true,
            showQuickJumper: true,
            current: vendors.page || 1,
            pageSize: vendors.pageSize || 10,
            total: vendors.count || 0
          }
        }
      })
    },
    * queryLast (_, { call, put }) {
      const response = yield call(queryLast)
      yield put({ type: 'querySuccess', payload: { lastVendor: response.data } })
    },
    * add ({ payload = {} }, { call, put }) {
      const params = {
        vendorCode: payload.vendorCode,
        vendorName: payload.name,
        identityNo: payload.identityNumber,
        identityType: payload.identityType,
        phone: payload.phone,
        email: payload.email,
        password: payload.password,
        bankName: payload.bankName,
        accountName: payload.accountName,
        accountNumber: payload.accountNumber,
        categoryId: payload.type
      }
      const response = yield call(queryAdd, params)
      if (response && response.meta && response.meta.success) {
        message.success('Berhasil')
        payload.resetFields()
        yield put({ type: 'querySuccess', payload: { list: [] } })
      } else {
        message.error(`Gagal : ${response.message}`)
      }
    },
    * edit ({ payload = {} }, { call, put }) {
      const params = {
        id: payload.id,
        vendorCode: payload.vendorCode,
        vendorName: payload.name,
        identityNo: payload.identityNumber,
        identityType: payload.identityType,
        phone: payload.phone,
        email: payload.email,
        bankName: payload.bankName,
        accountName: payload.accountName,
        accountNumber: payload.accountNumber,
        categoryId: payload.type
      }
      const response = yield call(queryEdit, params)
      if (response && response.meta && response.success) {
        message.success('Berhasil')
        payload.resetFields()
        yield put({ type: 'query', payload: { selectedVendor: {}, formType: 'add' } })
      } else {
        message.error(`Gagal : ${response.message}`)
      }
    },
    * resetPassword ({ payload = {} }, { call }) {
      const params = {
        id: payload.id,
        password: payload.password
      }
      const response = yield call(queryResetPassword, params)
      if (response && response.meta && response.success) {
        message.success('Berhasil')
      } else {
        message.error(`Gagal : ${response.message}`)
      }
    }
  },

  reducers: {
    querySuccess (state, action) {
      return {
        ...state,
        ...action.payload
      }
    },
    updateState (state, action) {
      return {
        ...state,
        ...action.payload
      }
    }
  }
})
