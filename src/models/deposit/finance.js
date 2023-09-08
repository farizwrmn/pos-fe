import modelExtend from 'dva-model-extend'
import { pageModel } from '../common'

export default modelExtend(pageModel, {
  namespace: 'depositFinance',

  state: {
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        const { pathname, query } = location
        console.log('dispatch', dispatch)
        console.log('pathname', pathname)
        console.log('query', query)
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
