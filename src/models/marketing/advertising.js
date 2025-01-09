import modelExtend from 'dva-model-extend'
import { routerRedux } from 'dva/router'
import { message } from 'antd'
import FormData from 'form-data'
import { uploadAdvertisingImage } from 'services/utils/imageUploader'
import { query, add, edit, remove } from 'services/marketing/advertising'
import { pageModel } from '../common'

const success = () => {
  message.success('Advertising has been saved')
}

export default modelExtend(pageModel, {
  namespace: 'advertising',

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
        if (pathname === '/marketing/advertising') {
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
      const data = yield call(query, {
        ...payload,
        order: 'typeAds,sort,id'
      })
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

      if (payload && payload.data && payload.data.typeAds === 'CUSTROLL') {
        if (payload
          && payload.data
          && payload.data.image
          && payload.data.image.fileList
          && payload.data.image.fileList.length > 0
          && payload.data.image.fileList.length <= 5) {
          for (let key in payload.data.image.fileList) {
            const item = payload.data.image.fileList[key]
            const formData = new FormData()
            formData.append('file', item.originFileObj)
            const responseUpload = yield call(uploadAdvertisingImage, formData)
            if (responseUpload.success && responseUpload.data && responseUpload.data.filename) {
              uploadedImage.push(responseUpload.data.filename)
            }
          }
        } else if (payload
          && payload.data
          && payload.data.image
          && payload.data.image.fileList
          && payload.data.image.fileList.length > 0
          && payload.data.image.fileList.length > 10) {
          throw new Error('Cannot upload more than 10 image')
        }
        if (uploadedImage && uploadedImage.length) {
          payload.data.image = JSON.stringify(uploadedImage)
        } else {
          payload.data.image = '["no_image.png"]'
        }
      } else {
        if (payload
          && payload.data
          && payload.data.image
          && payload.data.image.fileList
          && payload.data.image.fileList.length > 0) {
          for (let key in payload.data.image.fileList) {
            const item = payload.data.image.fileList[key]
            const formData = new FormData()
            formData.append('file', item.originFileObj)
            const responseUpload = yield call(uploadAdvertisingImage, formData)
            if (responseUpload.success && responseUpload.data && responseUpload.data.filename) {
              uploadedImage.push(responseUpload.data.filename)
            }
            break
          }
        } else if (payload
          && payload.data
          && payload.data.image
          && payload.data.image.fileList
          && payload.data.image.fileList.length > 0
          && payload.data.image.fileList.length > 10) {
          throw new Error('Cannot upload more than 10 image')
        }
        if (uploadedImage && uploadedImage.length) {
          payload.data.image = uploadedImage[0]
        } else {
          payload.data.image = 'no_image.png'
        }
      }
      // End - Upload Image
      const data = yield call(add, payload.data)
      if (data.success) {
        success()
        yield put({
          type: 'updateState',
          payload: {
            modalType: 'add',
            activeKey: '1',
            currentItem: {}
          }
        })
        const { pathname } = location
        yield put(routerRedux.push({
          pathname,
          query: {
            activeKey: '1'
          }
        }))
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
      const image = yield select(({ advertising }) => advertising.currentItem.image)
      const id = yield select(({ advertising }) => advertising.currentItem.id)
      let uploadedImage = []
      const newCounter = { ...payload.data, id }
      if (payload && payload.data && payload.data.typeAds === 'CUSTROLL') {
        if (payload
          && payload.data
          && payload.data.image
          && payload.data.image.fileList
          && payload.data.image.fileList.length > 0
          && payload.data.image.fileList.length <= 5) {
          for (let key in payload.data.image.fileList) {
            const item = payload.data.image.fileList[key]
            if (item && item.originFileObj) {
              const formData = new FormData()
              formData.append('file', item.originFileObj)
              const responseUpload = yield call(uploadAdvertisingImage, formData)
              if (responseUpload.success && responseUpload.data && responseUpload.data.filename) {
                uploadedImage.push(responseUpload.data.filename)
              }
            } else if (item && item.name) {
              uploadedImage.push(item.name)
            }
          }
        } else if (payload
          && payload.data
          && payload.data.image
          && payload.data.image.fileList
          && payload.data.image.fileList.length > 0
          && payload.data.image.fileList.length > 10) {
          throw new Error('Cannot upload more than 10 image')
        } else if (image
          && image != null
          && image !== '["no_image.png"]'
          && image !== '"no_image.png"'
          && image !== 'no_image.png') {
          uploadedImage = JSON.parse(image)
        }
        // End - Upload Image
        if (uploadedImage && uploadedImage.length > 0) {
          newCounter.image = JSON.stringify(uploadedImage)
        } else {
          newCounter.image = '["no_image.png"]'
        }
      } else {
        if (payload
          && payload.data
          && payload.data.image
          && payload.data.image.fileList
          && payload.data.image.fileList.length > 0
          && payload.data.image.fileList.length <= 5) {
          for (let key in payload.data.image.fileList) {
            const item = payload.data.image.fileList[key]
            if (item && item.originFileObj) {
              const formData = new FormData()
              formData.append('file', item.originFileObj)
              const responseUpload = yield call(uploadAdvertisingImage, formData)
              if (responseUpload.success && responseUpload.data && responseUpload.data.filename) {
                uploadedImage.push(responseUpload.data.filename)
              }
            } else if (item && item.name) {
              uploadedImage.push(item.name)
            }
          }
        } else if (payload
          && payload.data
          && payload.data.image
          && payload.data.image.fileList
          && payload.data.image.fileList.length > 0
          && payload.data.image.fileList.length > 10) {
          throw new Error('Cannot upload more than 10 image')
        } else if (image
          && image != null
          && image !== '["no_image.png"]'
          && image !== '"no_image.png"'
          && image !== 'no_image.png') {
          uploadedImage = [image]
        }
        // End - Upload Image
        if (uploadedImage && uploadedImage.length > 0) {
          newCounter.image = uploadedImage && uploadedImage[0] ? uploadedImage[0] : null
        } else {
          newCounter.image = 'no_image.png'
        }
      }

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
