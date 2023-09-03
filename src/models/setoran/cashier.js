import modelExtend from 'dva-model-extend'
import pathToRegexp from 'path-to-regexp'
import { pageModel } from './../common'

export default modelExtend(pageModel, {
  namespace: 'setoranCashier',

  state: {
    list: [],
    pagination: {
      current: 1
    },

    visibleSetoranNewModal: false
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        const { pathname } = location
        const match = pathToRegexp('/setoran/cashier/:id').exec(pathname)
        if (match) {
          dispatch({
            type: 'updateStatexs',
            payload: {
              balanceId: decodeURIComponent(match[1])
            }
          })
        }
        if (pathname === '/setoran/cashier/new') {
          dispatch({
            type: 'updateState',
            payload: {
              visibleSetoranNewModal: false
            }
          })
        }
      })
    }
  },

  effects: {
  },

  reducers: {
    updateState (state, { payload }) {
      return { ...state, ...payload }
    }
  }
})
