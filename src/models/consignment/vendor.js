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
    modalState: false,
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
            payload: {
              current: 1,
              pageSize: 10
            }
          })
          dispatch({
            type: 'queryLast',
            payload: {}
          })
          if (location.pathname === '/integration/consignment/vendor') {
            if (location.query && location.query.activeKey) {
              dispatch({
                type: 'updateState',
                payload: {
                  activeKey: location.query.activeKey
                }
              })
            } else {
              dispatch({
                type: 'updateState',
                payload: {
                  activeKey: '0'
                }
              })
            }
          }
        }
      })
    }
  },

  effects: {
    * query ({ payload = {} }, { call, put }) {
      const { q, current, pageSize } = payload
      const params = {
        q,
        page: current,
        pageSize,
        order: '-id'
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
            current: Number(vendors.page || 1),
            pageSize: Number(vendors.pageSize || 10),
            total: Number(vendors.count)
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
        yield put({ type: 'query', payload: { selectedVendor: {}, formType: 'add', current: 1, pageSize: 10 } })
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
