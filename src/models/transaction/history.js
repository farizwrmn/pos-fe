import modelExtend from 'dva-model-extend'
import { pageModel } from '../common'

export default modelExtend(pageModel, {
  namespace: 'history',
  state: {
    path: '/transaction/pos/history'
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/transaction/history') {
          dispatch({ type: 'updateState', payload: { path: '/transaction/pos/history' } })
        } else {
          dispatch({ type: 'updateState', payload: { path: location.pathname } })
        }
      })
    }
  }
})
