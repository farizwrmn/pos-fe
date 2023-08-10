import pathToRegexp from 'path-to-regexp'
import { query } from '../../services/users'

export default {

  namespace: 'userDetail',

  state: {
    data: {}
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(() => {
        const match = pathToRegexp('/master/user/:id').exec(location.pathname)
        if (match) {
          dispatch({ type: 'query', payload: { id: match[1] } })
        }
        if (location.pathname === '/balance/closing'
          || location.pathname === '/setoran/current') {
          dispatch({ type: 'query' })
        }
      })
    }
  },

  effects: {
    * query ({ payload }, { call, put }) {
      const data = yield call(query, payload)
      const { success, message, status, ...other } = data
      if (success) {
        yield put({
          type: 'querySuccess',
          payload: {
            data: other
          }
        })
      } else {
        throw data
      }
    }
  },

  reducers: {
    querySuccess (state, { payload }) {
      const { data } = payload
      return {
        ...state,
        data
      }
    }
  }
}
