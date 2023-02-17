import { message } from 'antd'
import FormData from 'form-data'
import modelExtend from 'dva-model-extend'
import pathToRegexp from 'path-to-regexp'
import { uploadExpressConsignmentProductImage } from 'services/utils/imageUploader'
import { query, queryDelete, queryEdit, queryDestroy, queryById } from 'services/consignment/products'
import { routerRedux } from 'dva/router'
import { pageModel } from '../common'


export default modelExtend(pageModel, {
  namespace: 'consignmentProduct',

  state: {
    formType: 'add',
    activeKey: '0',
    list: [],
    selectedProduct: {},
    q: null,
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      current: 1
    }
  },

  subscriptions: {
    setup ({ history, dispatch }) {
      history.listen((location) => {
        const match = pathToRegexp('/integration/consignment/product/:id').exec(location.pathname)
        if (match) {
          dispatch({
            type: 'queryDetail',
            payload: {
              id: decodeURIComponent(match[1])
            }
          })
        }
        if (location.pathname === '/integration/consignment/product') {
          dispatch({
            type: 'query',
            payload: {
              current: 1,
              pageSize: 10
            }
          })
        }
      })
    }
  },

  effects: {
    * query ({ payload = {} }, { call, put }) {
      const { q, current, pageSize } = payload
      const params = {
        q,
        page: current,
        pageSize
      }
      const response = yield call(query, params)
      yield put({
        type: 'querySuccess',
        payload: {
          ...payload,
          list: response.data.list,
          pagination: {
            showSizeChanger: true,
            showQuickJumper: true,
            current: Number(response.data.page || 1),
            pageSize: Number(response.data.pageSize || 10),
            total: Number(response.data.count)
          }
        }
      })
    },
    * queryDetail ({ payload = {} }, { call, put }) {
      const response = yield call(queryById, payload)
      const product = response.data[0]
      yield put({
        type: 'querySuccess',
        payload: {
          ...payload,
          selectedProduct: product
        }
      })
    },
    * queryEdit ({ payload = {} }, { call, put }) {
      const uploadedImage = []
      if (payload
        && payload.data
        && payload.data.photo
        && payload.data.photo.fileList
        && payload.data.photo.fileList.length > 0
        && payload.data.photo.fileList.length <= 1) {
        for (let key in payload.data.photo.fileList) {
          const item = payload.data.photo.fileList[key]
          const formData = new FormData()
          formData.append('file', item.originFileObj)
          const responseUpload = yield call(uploadExpressConsignmentProductImage, formData)
          if (responseUpload.success && responseUpload.data && responseUpload.data.filename) {
            uploadedImage.push(responseUpload.data.filename)
          }
        }
      } else if (payload
        && payload.data
        && payload.data.photo
        && payload.data.photo.fileList
        && payload.data.photo.fileList.length > 0
        && payload.data.photo.fileList.length > 1) {
        throw new Error('Cannot upload more than 1 image')
      }
      // End - Upload Image
      if (uploadedImage.length > 0) {
        payload.data.photo = uploadedImage[0]
      }
      const response = yield call(queryEdit, payload.data)
      if (response && response.meta && response.meta.success) {
        message.success('Berhasil')
        yield put(routerRedux.push('/integration/consignment/product'))
      } else {
        message.error(`GagaL : ${response.message}`)
      }
    },
    * queryDelete ({ payload = {} }, { call, put }) {
      const params = {
        id: payload.id
      }
      const response = yield call(queryDelete, params)
      if (response && response.meta && response.meta.success) {
        message.success('Berhasil')
        yield put({
          type: 'query',
          payload: {
            current: 1,
            pageSize: 10
          }
        })
      } else {
        message.success(`Gagal : ${response.message}`)
      }
    },
    * queryDestroy ({ payload = {} }, { call, put }) {
      const params = {
        id: payload.id
      }
      const response = yield call(queryDestroy, params)
      if (response && response.meta && response.meta.success) {
        message.success('Berhasil')
        yield put({
          type: 'query',
          payload: {
            current: 1,
            pageSize: 10
          }
        })
      } else {
        message.error(`Gagal : ${response.message}`)
      }
    }
  },

  reducers: {
    querySuccess (state, action) {
      return {
        ...state,
        ...action.payload
      }
    },
    updateState (state, action) {
      return {
        ...state,
        ...action.payload
      }
    }
  }
})
