import { Modal } from 'antd'
import { query as queryOpts } from '../../services/payment/paymentOptions'

export default {
  namespace: 'paymentOpts',
  state: {
    listOpts: []
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/transaction/pos/payment') {
          dispatch({
            type: 'queryOpts'
          })
        }
      })
    }
  },

  effects: {

    * queryOpts ({ payload = {} }, { call, put }) {
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
