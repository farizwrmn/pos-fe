import modelExtend from 'dva-model-extend'
import pathToRegexp from 'path-to-regexp'
import { queryById } from '../../services/product/bookmarkGroup'
import { pageModel } from './../common'

export default modelExtend(pageModel, {
  namespace: 'productBookmarkDetail',

  state: {
    data: {},
    listBookmark: [],
    modalProductVisible: false,
    modalBundleVisible: false
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

        yield put({
          type: 'updateState',
          payload: {
            listBookmark: response.data.bookmark
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
    },
    updateState (state, { payload }) {
      return { ...state, ...payload }
    }
  }
})
