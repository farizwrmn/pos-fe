import modelExtend from 'dva-model-extend'
import pathToRegexp from 'path-to-regexp'
import FormData from 'form-data'
import { message } from 'antd'
import { uploadBookmarkImage } from 'services/utils/imageUploader'
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

    * updateBookmarkDetail ({ payload = {} }, { select, call, put }) {
      const id = yield select(({ productBookmarkDetail }) => {
        return productBookmarkDetail.modalBookmarkItem.id
      })
      const bookmarkImage = yield select(({ productBookmarkDetail }) => {
        return productBookmarkDetail.modalBookmarkItem.bookmarkImage
      })
      const newUser = { ...payload, bookmarkImage, id }
      const formData = new FormData()
      let imagePass = true
      if (
        payload
        && payload.bookmarkImage
        && typeof payload.bookmarkImage === 'object'
        && payload.bookmarkImage.file
      ) {
        formData.append('file', payload.bookmarkImage.file.originFileObj)
        const imageUpload = yield call(uploadBookmarkImage, formData)
        if (imageUpload && imageUpload.success) {
          newUser.bookmarkImage = imageUpload.data.filename
        } else {
          imagePass = false
          throw imageUpload
        }
      }

      if (imagePass) {
        const response = yield call(edit, newUser)
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
      } else {
        message.error('Failed to upload image')
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
