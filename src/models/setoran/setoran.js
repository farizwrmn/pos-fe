import modelExtend from 'dva-model-extend'
import { message } from 'antd'
import { getActive } from 'services/balance/balanceProcess'
import { pageModel } from './../common'

export default modelExtend(pageModel, {
  namespace: 'setoran',

  state: {
    modalType: 'add',
    activeKey: '0'
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        const { pathname } = location
        if (pathname === '/setoran/current') {
          dispatch({ type: 'active' })
        }
      })
    }
  },

  effects: {
    * active ({ payload }, { call, put }) {
      const response = yield call(getActive, payload)
      if (response && response.success) {
        yield put({
          type: 'updateState',
          payload: {
            listPurchaseLatestDetail: response.data
          }
        })
      } else {
        message.error(response.message)
      }
    }
  },

  reducers: {
    updateState (state, { payload }) {
      return { ...state, ...payload }
    }
  }
})
