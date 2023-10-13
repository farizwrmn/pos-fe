import { message } from 'antd'
import modelExtend from 'dva-model-extend'
import FormData from 'form-data'
import { uploadConsignmentIdImage, uploadConsignmentTaxIdImage } from 'services/utils/imageUploader'
import {
  query,
  queryAdd,
  queryEdit,
  queryLast,
  queryResetPassword
} from 'services/consignment/vendors'
import { routerRedux } from 'dva/router'
import { pageModel } from '../common'


export default modelExtend(pageModel, {
  namespace: 'consignmentVendor',

  state: {
    modalState: false,
    activeKey: '0',
    formType: 'add',
    list: [],
    selectedVendor: {},
    lastVendor: {},
    modalCommissionItem: {},
    modalCommissionVisible: false,
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
        if (location.pathname === '/integration/consignment/vendor'
          || location.pathname === '/integration/consignment/return-report'
          || location.pathname === '/integration/consignment/stock-report'
          || location.pathname === '/integration/consignment/profit-report') {
          dispatch({
            type: 'updateState',
            payload: {
              selectedVendor: {}
            }
          })
          if (location.query.vendorId) {
            dispatch({
              type: 'query',
              payload: {
                current: 1,
                pageSize: 10,
                id: location.query.vendorId
              }
            })
          } else {
            dispatch({
              type: 'query',
              payload: {
                current: 1,
                pageSize: 10
              }
            })
          }
          if (location.pathname === '/integration/consignment/vendor') {
            dispatch({
              type: 'queryLast',
              payload: {}
            })
            if (location.query && location.query.activeKey) {
              dispatch({
                type: 'updateState',
                payload: {
                  activeKey: location.query.activeKey
                }
              })
            } else {
              dispatch({
                type: 'updateState',
                payload: {
                  activeKey: '0'
                }
              })
            }
          }
        }
      })
    }
  },

  effects: {
    * query ({ payload = {} }, { call, put }) {
      const { q, id, current, pageSize } = payload
      const params = {
        id,
        q,
        page: current,
        pageSize,
        order: '-id'
      }
      const response = yield call(query, params)
      const vendors = response.data
      yield put({
        type: 'querySuccess',
        payload: {
          ...payload,
          list: vendors.list,
          pagination: {
            showSizeChanger: true,
            showQuickJumper: true,
            current: Number(vendors.page || 1),
            pageSize: Number(vendors.pageSize || 10),
            total: Number(vendors.count)
          }
        }
      })
    },
    * queryLast (_, { call, put }) {
      const response = yield call(queryLast)
      yield put({ type: 'querySuccess', payload: { lastVendor: response.data } })
    },
    * add ({ payload = {} }, { call, put }) {
      const params = {
        vendorCode: payload.vendorCode,
        vendorName: payload.name,
        identityNo: payload.identityNumber,
        identityType: payload.identityType,
        address: payload.address,
        phone: payload.phone,
        email: payload.email,
        password: payload.password,
        bankName: payload.bankName,
        commissionValue: payload.commissionValue,
        accountName: payload.accountName,
        accountNumber: payload.accountNumber,
        categoryId: payload.type
      }
      // Start - Upload Image
      const uploadedImage = []
      if (payload
        && payload.identityImage
        && payload.identityImage.fileList
        && payload.identityImage.fileList.length > 0
        && payload.identityImage.fileList.length <= 5) {
        for (let key in payload.identityImage.fileList) {
          const item = payload.identityImage.fileList[key]
          const formData = new FormData()
          formData.append('file', item.originFileObj)
          const responseUpload = yield call(uploadConsignmentIdImage, formData)
          if (responseUpload.success && responseUpload.data && responseUpload.data.filename) {
            uploadedImage.push(responseUpload.data.filename)
          }
        }
      } else if (payload
        && payload
        && payload.identityImage
        && payload.identityImage.fileList
        && payload.identityImage.fileList.length > 0
        && payload.identityImage.fileList.length > 5) {
        throw new Error('Cannot upload more than 5 image')
      }
      if (uploadedImage && uploadedImage.length > 0) {
        params.identityImage = uploadedImage[0]
      } else {
        params.identityImage = 'no_image.png'
      }
      // End - Upload Image
      // Start - Upload Image
      const uploadedImageTax = []
      if (payload
        && payload.taxIdImage
        && payload.taxIdImage.fileList
        && payload.taxIdImage.fileList.length > 0
        && payload.taxIdImage.fileList.length <= 5) {
        for (let key in payload.taxIdImage.fileList) {
          const item = payload.taxIdImage.fileList[key]
          const formData = new FormData()
          formData.append('file', item.originFileObj)
          const responseUpload = yield call(uploadConsignmentIdImage, formData)
          if (responseUpload.success && responseUpload.data && responseUpload.data.filename) {
            uploadedImageTax.push(responseUpload.data.filename)
          }
        }
      } else if (payload
        && payload
        && payload.taxIdImage
        && payload.taxIdImage.fileList
        && payload.taxIdImage.fileList.length > 0
        && payload.taxIdImage.fileList.length > 5) {
        throw new Error('Cannot upload more than 5 image')
      }
      if (uploadedImageTax && uploadedImageTax.length > 0) {
        params.taxIdImage = uploadedImageTax[0]
      } else {
        params.taxIdImage = 'no_image.png'
      }
      // End - Upload Image
      const response = yield call(queryAdd, params)
      if (response && response.meta && response.meta.success) {
        message.success('Berhasil')
        payload.resetFields()
        yield put({
          type: 'updateState',
          payload: {
            selectedVendor: {}
          }
        })
        yield put({ type: 'querySuccess', payload: { list: [] } })
        yield put({
          type: 'consignmentVendor/updateState',
          payload: {
            activeKey: '1'
          }
        })
        const { query, pathname } = location
        yield put(routerRedux.push({
          pathname,
          query: {
            ...query,
            activeKey: 1
          }
        }))
      } else {
        message.error(`Gagal : ${response.message}`)
      }
    },
    * edit ({ payload = {} }, { select, call, put }) {
      const identityImage = yield select(({ consignmentVendor }) => consignmentVendor.selectedVendor.identityImage)
      const taxIdImage = yield select(({ consignmentVendor }) => consignmentVendor.selectedVendor.taxIdImage)
      const params = {
        id: payload.id,
        vendorName: payload.name,
        identityNo: payload.identityNumber,
        identityType: payload.identityType,
        address: payload.address,
        phone: payload.phone,
        email: payload.email,
        bankName: payload.bankName,
        commissionValue: payload.commissionValue,
        accountName: payload.accountName,
        accountNumber: payload.accountNumber
      }
      let uploadedImage = []
      if (payload
        && payload.identityImage
        && payload.identityImage.fileList
        && payload.identityImage.fileList.length > 0
        && payload.identityImage.fileList.length <= 5) {
        for (let key in payload.identityImage.fileList) {
          const item = payload.identityImage.fileList[key]
          if (item && item.originFileObj) {
            const formData = new FormData()
            formData.append('file', item.originFileObj)
            const responseUpload = yield call(uploadConsignmentIdImage, formData)
            if (responseUpload.success && responseUpload.data && responseUpload.data.filename) {
              uploadedImage.push(responseUpload.data.filename)
            }
          } else if (item && item.name) {
            uploadedImage.push(item.name)
          }
        }
      } else if (payload
        && payload.identityImage
        && payload.identityImage.fileList
        && payload.identityImage.fileList.length > 0
        && payload.identityImage.fileList.length > 5) {
        throw new Error('Cannot upload more than 5 image')
      } else if (identityImage
        && identityImage != null
        && identityImage !== '["no_image.png"]'
        && identityImage !== '"no_image.png"'
        && identityImage !== 'no_image.png') {
        uploadedImage = identityImage
      }
      if (uploadedImage && uploadedImage.length > 0) {
        params.identityImage = uploadedImage[0]
      } else {
        params.identityImage = 'no_image.png'
      }
      let uploadedImageTax = []
      if (payload
        && payload.taxIdImage
        && payload.taxIdImage.fileList
        && payload.taxIdImage.fileList.length > 0
        && payload.taxIdImage.fileList.length <= 5) {
        for (let key in payload.taxIdImage.fileList) {
          const item = payload.taxIdImage.fileList[key]
          if (item && item.originFileObj) {
            const formData = new FormData()
            formData.append('file', item.originFileObj)
            const responseUpload = yield call(uploadConsignmentTaxIdImage, formData)
            if (responseUpload.success && responseUpload.data && responseUpload.data.filename) {
              uploadedImageTax.push(responseUpload.data.filename)
            }
          } else if (item && item.name) {
            uploadedImageTax.push(item.name)
          }
        }
      } else if (payload
        && payload.taxIdImage
        && payload.taxIdImage.fileList
        && payload.taxIdImage.fileList.length > 0
        && payload.taxIdImage.fileList.length > 5) {
        throw new Error('Cannot upload more than 5 image')
      } else if (taxIdImage
        && taxIdImage != null
        && taxIdImage !== '["no_image.png"]'
        && taxIdImage !== '"no_image.png"'
        && taxIdImage !== 'no_image.png') {
        uploadedImageTax = taxIdImage
      }
      if (uploadedImageTax && uploadedImageTax.length > 0) {
        params.taxIdImage = uploadedImageTax[0]
      } else {
        params.taxIdImage = 'no_image.png'
      }

      const response = yield call(queryEdit, params)
      if (response && response.meta && response.success) {
        message.success('Berhasil')
        payload.resetFields()
        yield put({
          type: 'updateState',
          payload: {
            selectedVendor: {}
          }
        })
        yield put({ type: 'query', payload: { selectedVendor: {}, formType: 'add', current: 1, pageSize: 10 } })
        yield put({
          type: 'consignmentVendor/updateState',
          payload: {
            activeKey: '1'
          }
        })
        const { query, pathname } = location
        yield put(routerRedux.push({
          pathname,
          query: {
            ...query,
            activeKey: 1
          }
        }))
      } else {
        message.error(`Gagal : ${response.message}`)
      }
    },
    * resetPassword ({ payload = {} }, { call }) {
      const params = {
        id: payload.id,
        password: payload.password
      }
      const response = yield call(queryResetPassword, params)
      if (response && response.meta && response.success) {
        message.success('Berhasil')
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
