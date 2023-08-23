import modelExtend from 'dva-model-extend'
import { getActive } from 'services/balance/balanceProcess'
import { pageModel } from './../common'

export default modelExtend(pageModel, {
  namespace: 'setoran',

  state: {
    formType: 'open',

    currentBalance: {},

    activeKey: '0'
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        const { pathname } = location
        if (pathname === '/setoran/current') {
          dispatch({
            type: 'active',
            payload: {
              countClosing: 1
            }
          })
        }
      })
    }
  },

  effects: {
    * active (_, { call, put }) {
      const response = yield call(getActive)
      if (response && response.success) {
        yield put({
          type: 'updateState',
          payload: {
            formType: 'close'
          }
        })
      }
    }
  },

  reducers: {
    updateState (state, { payload }) {
      return { ...state, ...payload }
    }
  }
})
