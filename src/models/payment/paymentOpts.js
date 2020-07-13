import pathToRegexp from 'path-to-regexp'
import { Modal } from 'antd'
import { query as queryOpts } from '../../services/payment/paymentOptions'
import { query as queryOptionMaster } from '../../services/master/paymentOption'

export default {
  namespace: 'paymentOpts',
  state: {
    listOpts: []
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        const match = pathToRegexp('/accounts/payment/:id').exec(location.pathname) || pathToRegexp('/accounts/payable/:id').exec(location.pathname) || pathToRegexp('/transaction/pos/invoice/:id').exec(location.pathname)
        if (match) {
          dispatch({
            type: 'queryOpts'
          })
        }
        const matchEdc = pathToRegexp('/master/paymentoption/edc/:id').exec(location.pathname)
        if (
          location.pathname === '/transaction/pos/'
          || location.pathname === '/transaction/pos'
          || location.pathname === '/transaction/pos/payment'
          || location.pathname === '/balance/current'
          || location.pathname === '/balance/dashboard'
          || location.pathname === '/balance/closing'
          || location.pathname === '/balance/history'
          || location.pathname === '/balance/approvement'
          || location.pathname === '/report/pos/payment'
          || matchEdc
        ) {
          dispatch({
            type: 'queryOptionMaster',
            payload: {
              type: 'all',
              order: 'sort'
            }
          })
        }
      })
    }
  },

  effects: {
    * queryOptionMaster ({ payload = {} }, { call, put }) {
      const data = yield call(queryOptionMaster, payload)
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            listOpts: data.data
          }
        })
      } else {
        Modal.error({
          title: 'Cannot find payment method',
          content: 'Using default setting'
        })
      }
    },
    * query ({ payload = {} }, { call, put }) {
      const data = yield call(queryOpts, payload)
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            listOpts: data.data
          }
        })
      } else {
        Modal.error({
          title: 'Cannot find payment method',
          content: 'Using default setting'
        })
      }
    },
    * queryOpts ({ payload = {} }, { call, put }) {
      const data = yield call(queryOpts, payload)
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            listOpts: data.data
          }
        })
      }
    }
  },

  reducers: {

    querySuccess (state, action) {
      const { listSuppliers, pagination } = action.payload
      return {
        ...state,
        listSuppliers,
        pagination: {
          ...state.pagination,
          ...pagination
        }
      }
    },

    updateState (state, { payload }) {
      return { ...state, ...payload }
    }
  }
}
