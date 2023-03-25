import modelExtend from 'dva-model-extend'
import pathToRegexp from 'path-to-regexp'
import { message } from 'antd'
import { edit } from '../../services/product/bookmark'
import { queryById } from '../../services/product/bookmarkGroup'
import { pageModel } from './../common'

const success = () => {
  message.success('Bookmark has been saved')
}

export default modelExtend(pageModel, {
  namespace: 'productBookmarkDetail',

  state: {
    data: {},
    listBookmark: [],
    modalProductVisible: false,
    modalBundleVisible: false,
    modalBookmarkVisible: false,
    modalBookmarkItem: {}
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
    },

    * updateBookmarkDetail ({ payload = {} }, { call, put }) {
      const response = yield call(edit, {
        id: payload.id,
        shortcutCode: payload.shortcutCode,
        groupId: payload.groupId,
        productId: payload.productId,
        type: payload.type
      })
      if (response.success) {
        yield put({
          type: 'updateState',
          payload: {
            modalBookmarkItem: {},
            modalBookmarkVisible: false
          }
        })
        yield put({ type: 'query', payload: { id: payload.groupId } })
        success()
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
