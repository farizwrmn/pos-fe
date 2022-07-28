import modelExtend from 'dva-model-extend'
import { routerRedux } from 'dva/router'
import { message } from 'antd'
import FormData from 'form-data'
import { uploadExpressBrandImage } from 'services/utils/imageUploader'
import { query, add, edit, remove } from 'services/k3express/product/productBrand'
import { pageModel } from 'models/common'

const success = () => {
  message.success('K3Express Brand has been saved')
}

export default modelExtend(pageModel, {
  namespace: 'expressProductBrand',

  state: {
    currentItem: {},
    modalType: 'add',
    activeKey: '0',
    list: [],
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      current: 1
    }
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        const { activeKey, ...other } = location.query
        const { pathname } = location
        if (pathname === '/k3express/product-brand') {
          dispatch({
            type: 'updateState',
            payload: {
              activeKey: activeKey || '0'
            }
          })
          if (activeKey === '1') dispatch({ type: 'query', payload: other })
        }
      })
    }
  },

  effects: {

    * query ({ payload = {} }, { call, put }) {
      const data = yield call(query, payload)
      if (data.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            list: data.data,
            pagination: {
              current: Number(data.page) || 1,
              pageSize: Number(data.pageSize) || 10,
              total: data.total
            }
          }
        })
      }
    },

    * delete ({ payload }, { call, put }) {
      const data = yield call(remove, payload)
      if (data.success) {
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },

    * add ({ payload }, { call, put }) {
      // Start - Upload Image
      const uploadedImage = []
      if (payload
        && payload.data
        && payload.data.brandImage
        && payload.data.brandImage.fileList
        && payload.data.brandImage.fileList.length > 0
        && payload.data.brandImage.fileList.length <= 5) {
        for (let key in payload.data.brandImage.fileList) {
          const item = payload.data.brandImage.fileList[key]
          const formData = new FormData()
          formData.append('file', item.originFileObj)
          const responseUpload = yield call(uploadExpressBrandImage, formData)
          if (responseUpload.success && responseUpload.data && responseUpload.data.filename) {
            uploadedImage.push(responseUpload.data.filename)
          }
        }
      } else if (payload
        && payload.data
        && payload.data.brandImage
        && payload.data.brandImage.fileList
        && payload.data.brandImage.fileList.length > 0
        && payload.data.brandImage.fileList.length > 5) {
        throw new Error('Cannot upload more than 5 image')
      }
      // End - Upload Image
      if (uploadedImage && uploadedImage.length) {
        payload.data.brandImage = uploadedImage && uploadedImage[0] ? uploadedImage[0] : 'no_image.png'
      } else {
        payload.data.brandImage = 'no_image.png'
      }
      const data = yield call(add, payload.data)
      if (data.success) {
        success()
        yield put({
          type: 'updateState',
          payload: {
            modalType: 'add',
            currentItem: {}
          }
        })
        yield put({
          type: 'query'
        })
        if (payload.reset) {
          payload.reset()
        }
      } else {
        yield put({
          type: 'updateState',
          payload: {
            currentItem: payload
          }
        })
        throw data
      }
    },

    * edit ({ payload }, { select, call, put }) {
      // Start - Upload Image
      const uploadedImage = []
      if (payload
        && payload.data
        && payload.data.brandImage
        && payload.data.brandImage.fileList
        && payload.data.brandImage.fileList.length > 0
        && payload.data.brandImage.fileList.length <= 5) {
        for (let key in payload.data.brandImage.fileList) {
          const item = payload.data.brandImage.fileList[key]
          if (item && item.originFileObj) {
            const formData = new FormData()
            formData.append('file', item.originFileObj)
            const responseUpload = yield call(uploadExpressBrandImage, formData)
            if (responseUpload.success && responseUpload.data && responseUpload.data.filename) {
              uploadedImage.push(responseUpload.data.filename)
            }
          } else if (item && item.name) {
            uploadedImage.push(item.name)
          }
        }
      } else if (payload
        && payload.data
        && payload.data.brandImage
        && payload.data.brandImage.fileList
        && payload.data.brandImage.fileList.length > 0
        && payload.data.brandImage.fileList.length > 1) {
        throw new Error('Cannot upload more than 1 image')
      }
      // End - Upload Image
      if (uploadedImage && uploadedImage.length) {
        payload.data.brandImage = uploadedImage && uploadedImage[0] ? uploadedImage[0] : 'no_image.png'
      } else {
        payload.data.brandImage = 'no_image.png'
      }
      const id = yield select(({ expressProductBrand }) => expressProductBrand.currentItem.id)
      const newCounter = { ...payload.data, id }
      const data = yield call(edit, newCounter)
      if (data.success) {
        success()
        yield put({
          type: 'updateState',
          payload: {
            modalType: 'add',
            currentItem: {},
            activeKey: '1'
          }
        })
        const { pathname } = location
        yield put(routerRedux.push({
          pathname,
          query: {
            activeKey: '1'
          }
        }))
        yield put({ type: 'query' })
        if (payload.reset) {
          payload.reset()
        }
      } else {
        yield put({
          type: 'updateState',
          payload: {
            currentItem: payload
          }
        })
        throw data
      }
    }
  },

  reducers: {
    querySuccess (state, action) {
      const { list, pagination } = action.payload
      return {
        ...state,
        list,
        pagination: {
          ...state.pagination,
          ...pagination
        }
      }
    },

    updateState (state, { payload }) {
      return { ...state, ...payload }
    },

    changeTab (state, { payload }) {
      const { key } = payload
      return {
        ...state,
        activeKey: key,
        modalType: 'add',
        currentItem: {}
      }
    },

    editItem (state, { payload }) {
      const { item } = payload
      return {
        ...state,
        modalType: 'edit',
        activeKey: '0',
        currentItem: item
      }
    }
  }
})
