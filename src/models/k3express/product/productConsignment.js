import modelExtend from 'dva-model-extend'
import FormData from 'form-data'
import { query, getProductDetail, add, edit, remove } from 'services/k3express/product/productConsignment'
import { pageModel } from 'models/common'
import { message } from 'antd'
import { uploadExpressConsignmentProductImage } from 'services/utils/imageUploader'
import { routerRedux } from 'dva/router'

const success = () => {
  message.success('K3Express Consignment has been saved')
}

export default modelExtend(pageModel, {
  namespace: 'expressProductConsignment',

  state: {
    currentItem: {},
    modalType: 'add',
    activeKey: '0',
    list: [],
    listLov: [],
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      current: 1
    },

    productDetail: []
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        const { activeKey, ...other } = location.query
        const { pathname } = location
        if (pathname === '/stock'
          || pathname === '/k3express/product-consignment'
        ) {
          if (activeKey !== '1') {
            dispatch({
              type: 'queryLov',
              payload: {
                type: 'all'
              }
            })
          }
        }
        if (pathname === '/k3express/product-consignment') {
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

    * queryLov ({ payload = {} }, { call, put }) {
      const data = yield call(query, payload)
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            listLov: data.data
          }
        })
      }
    },

    * queryProduct ({ payload = {} }, { call, put }) {
      const data = yield call(getProductDetail, payload)
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            productDetail: data.data
          }
        })
      }
    },

    * add ({ payload }, { call, put }) {
      // Start - Upload Image
      const uploadedImage = []
      if (payload
        && payload.data
        && payload.data.productImage
        && payload.data.productImage.fileList
        && payload.data.productImage.fileList.length > 0) {
        for (let key in payload.data.productImage.fileList) {
          const item = payload.data.productImage.fileList[key]
          const formData = new FormData()
          formData.append('file', item.originFileObj)
          const responseUpload = yield call(uploadExpressConsignmentProductImage, formData)
          if (responseUpload.success && responseUpload.data && responseUpload.data.filename) {
            uploadedImage.push(responseUpload.data.filename)
          }
        }
      } else if (payload
        && payload.data
        && payload.data.productImage
        && payload.data.productImage.fileList
        && payload.data.productImage.fileList.length > 0
        && payload.data.productImage.fileList.length > 1) {
        throw new Error('Cannot upload more than 1 image')
      }
      // End - Upload Image
      const data = yield call(add, { ...payload.data, uploadedImage })
      if (data.success) {
        success()
        yield put({
          type: 'updateState',
          payload: {
            modalType: 'add',
            currentItem: {},
            productDetail: []
          }
        })
        yield put({
          type: 'query'
        })
        yield put({
          type: 'queryLov',
          payload: {
            type: 'all'
          }
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
        && payload.data.productImage
        && payload.data.productImage.fileList
        && payload.data.productImage.fileList.length > 0
        && payload.data.productImage.fileList.length <= 5) {
        for (let key in payload.data.productImage.fileList) {
          const item = payload.data.productImage.fileList[key]
          if (item && item.originFileObj) {
            const formData = new FormData()
            formData.append('file', item.originFileObj)
            const responseUpload = yield call(uploadExpressConsignmentProductImage, formData)
            if (responseUpload.success && responseUpload.data && responseUpload.data.filename) {
              uploadedImage.push(responseUpload.data.filename)
            }
          } else if (item && item.name) {
            uploadedImage.push(item.name)
          }
        }
      } else if (payload
        && payload.data
        && payload.data.productImage
        && payload.data.productImage.fileList
        && payload.data.productImage.fileList.length > 0
        && payload.data.productImage.fileList.length > 1) {
        throw new Error('Cannot upload more than 1 image')
      }
      // End - Upload Image
      if (uploadedImage && uploadedImage.length) {
        payload.data.productImage = uploadedImage && uploadedImage[0] ? uploadedImage[0] : 'no_image.png'
      } else {
        payload.data.categoryImage = 'no_image.png'
      }
      const id = yield select(({ expressProductConsignment }) => expressProductConsignment.currentItem.id)
      const newCounter = { ...payload.data, id, uploadedImage }
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
        yield put({
          type: 'queryLov',
          payload: {
            type: 'all'
          }
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

    * delete ({ payload }, { call, put }) {
      const data = yield call(remove, payload)
      if (data.success) {
        yield put({ type: 'query' })
      } else {
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
