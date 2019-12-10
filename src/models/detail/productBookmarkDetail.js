import pathToRegexp from 'path-to-regexp'
import { queryById } from '../../services/product/bookmarkGroup'

export default {

  namespace: 'productBookmarkDetail',

  state: {
    data: {}
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(() => {
        const match = pathToRegexp('/master/product/bookmark/:id').exec(location.pathname)
        if (match) {
          dispatch({ type: 'query', payload: { id: match[1] } })
        }
      })
    }
  },

  effects: {
    * query ({
      payload
    }, { call, put }) {
      const response = yield call(queryById, payload)
      if (response && response.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            data: response.data
          }
        })
      } else {
        throw response
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
