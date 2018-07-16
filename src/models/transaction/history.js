import modelExtend from 'dva-model-extend'
import { routerRedux } from 'dva/router'
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
          dispatch(routerRedux.push({
            pathname: '/transaction/pos/history'
          }))
          dispatch({ type: 'updateState', payload: { path: '/transaction/pos/history' } })
        } else {
          dispatch({ type: 'updateState', payload: { path: location.pathname } })
        }
      })
    }
  }
})
