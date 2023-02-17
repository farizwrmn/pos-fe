import { message } from 'antd'
import modelExtend from 'dva-model-extend'
import { query, queryAdd, queryEdit, queryResetPassword } from 'services/consignment/admins'
import { pageModel } from '../common'


export default modelExtend(pageModel, {
  namespace: 'consignmentUsers',

  state: {
    activeKey: '0',
    formType: 'add',
    list: [],
    selectedUser: {},
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
        if (location.pathname === '/integration/consignment/users') {
          dispatch({
            type: 'query',
            payload: {
              current: 1,
              pageSize: 10
            }
          })
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
        order: '-status'
      }
      const response = yield call(query, params)
      yield put({
        type: 'querySuccess',
        payload: {
          ...payload,
          list: response.data.list,
          pagination: {
            showSizeChanger: true,
            showQuickJumper: true,
            current: Number(response.data.page || 1),
            pageSize: Number(response.data.pageSize || 10),
            total: Number(response.data.count)
          }
        }
      })
    },
    * queryAdd ({ payload = {} }, { call, put }) {
      const body = {
        name: payload.name,
        email: payload.email,
        password: payload.password,
        role: payload.role,
        status: payload.status,
        outletId: payload.outlet
      }
      payload.resetFields()
      const response = yield call(queryAdd, body)
      if (response && response.meta && response.meta.success) {
        message.success('Berhasil')
        payload.resetFields()
        yield put({ type: 'querySuccess', payload: { ...payload } })
      } else {
        message.error(`Gagal : ${response.message}`)
      }
    },
    * queryEdit ({ payload = {} }, { call, put }) {
      const body = {
        id: payload.id,
        name: payload.name,
        email: payload.email,
        role: payload.role,
        status: payload.status,
        outletId: payload.outlet
      }
      const response = yield call(queryEdit, body)
      if (response && response.meta && response.meta.success) {
        message.success('Berhasil')
        payload.resetFields()
        yield put({ type: 'querySuccess', payload: { selectedUser: {}, formType: 'add', ...payload } })
      } else {
        message.error(`Gagal : ${response.message}`)
      }
    },
    * queryResetPassword ({ payload = {} }, { call, put }) {
      const body = {
        id: payload.id,
        password: payload.password
      }
      const response = yield call(queryResetPassword, body)
      if (response && response.meta && response.meta.success) {
        message.success('Berhasil')
        yield put({ type: 'querySuccess', payload: { ...payload } })
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
