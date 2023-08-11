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
    * active ({ payload }, { call, put }) {
      const response = yield call(getActive)
      if (response && response.success) {
        let countClosing = 0
        if (response.data && response.data.id) {
          if (payload && payload.countClosing) {
            countClosing = payload.countClosing
          }
        }

        yield put({
          type: 'updateState',
          payload: {
            currentBalance: {
              ...response.data
            } || {}
          }
        })

        yield put({
          type: 'activeDetail',
          payload: {
            countClosing
          }
        })
      } else {
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
