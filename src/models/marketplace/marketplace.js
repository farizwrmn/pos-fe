import modelExtend from 'dva-model-extend'
import { routerRedux } from 'dva/router'
import { message } from 'antd'
import { query, add, edit, remove } from 'services/marketplace/marketplace'
import { uploadProductImage } from 'services/utils/imageUploader'
import FormData from 'form-data'
import { pageModel } from '../common'

const success = () => {
  message.success('Marketplace has been saved')
}

export default modelExtend(pageModel, {
  namespace: 'marketplace',

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
        if (pathname === '/integration/marketplace') {
          dispatch({
            type: 'updateState',
            payload: {
              activeKey: activeKey || '0'
            }
          })
          if (activeKey === '1') dispatch({ type: 'query', payload: other })
        }
        if (pathname === '/integration/marketplace-product') {
          dispatch({
            type: 'query',
            payload: {
              type: 'all'
            }
          })
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
        && payload.data.marketplaceImage
        && payload.data.marketplaceImage.fileList
        && payload.data.marketplaceImage.fileList.length > 0
        && payload.data.marketplaceImage.fileList.length <= 1) {
        for (let key in payload.data.marketplaceImage.fileList) {
          const item = payload.data.marketplaceImage.fileList[key]
          const formData = new FormData()
          formData.append('file', item.originFileObj)
          const responseUpload = yield call(uploadProductImage, formData)
          if (responseUpload.success && responseUpload.data && responseUpload.data.filename) {
            uploadedImage.push(responseUpload.data.filename)
          }
        }
      } else if (payload
        && payload.data
        && payload.data.marketplaceImage
        && payload.data.marketplaceImage.fileList
        && payload.data.marketplaceImage.fileList.length > 0
        && payload.data.marketplaceImage.fileList.length > 1) {
        throw new Error('Cannot upload more than 1 image')
      }
      // End - Upload Image
      if (uploadedImage && uploadedImage.length) {
        payload.data.marketplaceImage = uploadedImage[0]
      } else {
        payload.data.marketplaceImage = 'no_image.png'
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
        yield put({
          type: 'updateState',
          payload: {
            modalType: 'add',
            currentItem: {},
            activeKey: '1'
          }
        })
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
        && payload.data.marketplaceImage
        && payload.data.marketplaceImage.fileList
        && payload.data.marketplaceImage.fileList.length > 0
        && payload.data.marketplaceImage.fileList.length <= 5) {
        for (let key in payload.data.marketplaceImage.fileList) {
          const item = payload.data.marketplaceImage.fileList[key]
          if (item && item.originFileObj) {
            const formData = new FormData()
            formData.append('file', item.originFileObj)
            const responseUpload = yield call(uploadProductImage, formData)
            if (responseUpload.success && responseUpload.data && responseUpload.data.filename) {
              uploadedImage.push(responseUpload.data.filename)
            }
          } else if (item && item.name) {
            uploadedImage.push(item.name)
          }
        }
      } else if (payload
        && payload.data
        && payload.data.marketplaceImage
        && payload.data.marketplaceImage.fileList
        && payload.data.marketplaceImage.fileList.length > 0
        && payload.data.marketplaceImage.fileList.length > 5) {
        throw new Error('Cannot upload more than 5 image')
      }
      // End - Upload Image
      const id = yield select(({ marketplace }) => marketplace.currentItem.id)
      const currentItem = yield select(({ marketplace }) => marketplace.currentItem)
      if (uploadedImage && uploadedImage.length) {
        payload.data.marketplaceImage = uploadedImage[0]
      } else if (currentItem && currentItem.marketplaceImage && currentItem.marketplaceImage.raw) {
        payload.data.marketplaceImage = currentItem.marketplaceImage.raw
      } else {
        payload.data.marketplaceImage = 'no_image.png'
      }
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
        yield put({
          type: 'updateState',
          payload: {
            modalType: 'add',
            currentItem: {},
            activeKey: '1'
          }
        })
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
