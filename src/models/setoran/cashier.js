import modelExtend from 'dva-model-extend'
import pathToRegexp from 'path-to-regexp'
import { routerRedux } from 'dva/router'
import { message } from 'antd'
import { lstorage } from 'utils'
import { queryAdd } from 'services/setoran/balanceDepositService'
import { pageModel } from './../common'

const {
  getCurrentUserStore
} = lstorage

export default modelExtend(pageModel, {
  namespace: 'setoranCashier',

  state: {
    list: [],
    pagination: {
      current: 1
    },

    visibleAddSetoranModal: false
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        const { pathname } = location
        const match = pathToRegexp('/setoran/cashier/:id').exec(pathname)
        if (match) {
          dispatch({
            type: 'updateState',
            payload: {
              id: decodeURIComponent(match[1])
            }
          })
        }
      })
    }
  },

  effects: {
    * add ({ payload = {} }, { call, put }) {
      payload.storeId = getCurrentUserStore()
      const response = yield call(queryAdd, payload)
      if (response && response.success && response.data) {
        yield put(routerRedux.push(`/setoran/cashier/${response.data.id}`))
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
