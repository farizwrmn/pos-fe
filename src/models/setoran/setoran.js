import modelExtend from 'dva-model-extend'
import { message } from 'antd'
import { routerRedux } from 'dva/router'
import { getActive } from 'services/balance/balanceProcess'
import { queryClose, queryOpen } from 'services/setoran/balancePaymentService'
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
      if (response && response.success && response.data) {
        yield put({
          type: 'updateState',
          payload: {
            formType: 'close',
            currentBalance: response.data
          }
        })
      }
    },
    * openBalance ({ payload = {} }, { call, put }) {
      const response = yield call(queryOpen, payload)
      if (response && response.success && response.data) {
        yield put(routerRedux.push('/transaction/pos'))
      } else {
        message.error(response.message)
      }
    },
    * closeBalance ({ payload = {} }, { call }) {
      const response = yield call(queryClose, payload)
      if (response && response.success && response.data) {
        console.log('response', response)
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
