import modelExtend from 'dva-model-extend'
import { lstorage } from 'utils'
import moment from 'moment'
import { pageModel } from './../common'

const {
  getCurrentUserRole,
  getCurrentUserStore
} = lstorage

export default modelExtend(pageModel, {
  namespace: 'xenditRecon',

  state: {
    activeKey: '0'
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        const { query } = location
        const { activeKey, from, to } = query
        dispatch({
          type: 'query',
          payload: {
            from,
            to
          }
        })
        if (activeKey) {
          dispatch({
            type: 'updateState',
            payload: {
              activeKey
            }
          })
        }
      })
    }
  },

  effects: {
    * query ({ payload = {} }, { put }) {
      const userRole = getCurrentUserRole()
      const currentStore = getCurrentUserStore
      const { from = moment().format('YYYY-MM-DD'), to = moment().format('YYYY-MM-DD') } = payload
      console.log('userRole', userRole)
      console.log('from', from)
      console.log('to', to)
      console.log('currentStore', currentStore)
      yield put({
        type: 'updateState',
        payload: {
          test: 'test'
        }
      })
    }
  },

  reducers: {
    updateState (state, { payload }) {
      return { ...state, ...payload }
    }
  }
})
