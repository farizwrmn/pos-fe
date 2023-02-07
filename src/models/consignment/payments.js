import { message } from 'antd'
import modelExtend from 'dva-model-extend'
import { queryByOutletId, queryAdd, queryEdit, queryDestroy } from 'services/consignment/paymentMethod'
import { getConsignmentId } from 'utils/lstorage'
import { pageModel } from '../common'


export default modelExtend(pageModel, {
  namespace: 'consignmentPayment',

  state: {
    formType: 'add',
    activeKey: '0',

    list: [],
    currentItem: {},

    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      current: 1
    }
  },

  subscriptions: {
    setup ({ history, dispatch }) {
      history.listen((location) => {
        if (location.pathname === '/integration/consignment/payments') {
          dispatch({
            type: 'query',
            payload: {}
          })
        }
      })
    }
  },

  effects: {
    * query (_, { call, put }) {
      const consignmentId = getConsignmentId()
      if (consignmentId) {
        const params = {
          outletId: consignmentId
        }
        const response = yield call(queryByOutletId, params)
        if (response.success) {
          yield put({
            type: 'querySuccess',
            payload: {
              list: response.data
            }
          })
        }
      } else {
        yield put({
          type: 'querySuccess',
          payload: {
            list: []
          }
        })
      }
    },
    * queryAdd ({ payload = {} }, { call }) {
      const consignmentId = getConsignmentId()
      if (consignmentId) {
        const params = {
          outletId: consignmentId,
          method: payload.method,
          feeFood: payload.feeFood,
          feeNonFood: payload.feeNonFood,
          code: payload.code
        }
        const response = yield call(queryAdd, params)
        if (response && response.meta && response.meta.success) {
          message.success('Berhasil')
          payload.resetFields()
        } else {
          message.error(`Gagal : ${response.message}`)
        }
      } else {
        message.error('Gagal: Outlet tidak terdaftar untuk consignment!')
      }
    },
    * queryEdit ({ payload = {} }, { call, put }) {
      const params = {
        id: payload.id,
        method: payload.method,
        feeFood: payload.feeFood,
        feeNonFood: payload.feeNonFood,
        code: payload.code
      }
      const response = yield call(queryEdit, params)
      if (response && response.meta && response.meta.success) {
        message.success('Berhasil')
        payload.resetFields()
        yield put({
          type: 'querySuccess',
          payload: {
            currentItem: {},
            formType: 'add'
          }
        })
      } else {
        message.error(`Gagal : ${response.message}`)
      }
    },
    * queryDestroy ({ payload = {} }, { call, put }) {
      const params = {
        id: payload.id
      }
      const response = yield call(queryDestroy, params)
      if (response && response.meta && response.meta.success) {
        message.success('Berhasil')
        yield put({
          type: 'query',
          payload: {}
        })
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
