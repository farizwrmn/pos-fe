import modelExtend from 'dva-model-extend'
import { message } from 'antd'
import { queryByStoreId } from 'services/balancePayment/balanceShiftService'
import { lstorage } from 'utils'
import { pageModel } from '../common'

export default modelExtend(pageModel, {
  namespace: 'balanceShift',

  state: {
    listShift: []
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        const { pathname } = location
        if (pathname === '/setoran/current') {
          dispatch({ type: 'queryByStoreId' })
        }
      })
    }
  },

  effects: {
    * queryByStoreId ({ payload = {} }, { call, put }) {
      payload.storeId = lstorage.getCurrentUserStore()
      const response = yield call(queryByStoreId, payload)
      if (response && response.success && response.data) {
        yield put({
          type: 'updateState',
          payload: {
            listShift: response.data
          }
        })
      } else {
        message.error('Failed to get balance shift by storeId')
      }
    }
  },

  reducers: {
    updateState (state, action) {
      return { ...state, ...action.payload }
    }
  }
})
