import modelExtend from 'dva-model-extend'
import { routerRedux } from 'dva/router'
import { message } from 'antd'
import FormData from 'form-data'
import { query, queryBox, queryById, add, edit, approve, voidTrans, remove } from 'services/consignment/rentRequest'
import { query as queryVendor } from 'services/consignment/vendor'
import { uploadRentImage } from 'services/utils/imageUploader'
import { getConsignmentId } from 'utils/lstorage'
import pathToRegexp from 'path-to-regexp'
import { pageModel } from '../common'

const success = () => {
  message.success('Rent Request has been saved')
}

export default modelExtend(pageModel, {
  namespace: 'rentRequest',

  state: {
    data: {},
    currentItem: {},
    modalType: 'add',
    rentRequest: [],
    listBox: [],
    listOutlet: [],
    listVendor: [],
    consignmentId: getConsignmentId(),
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
        const match = pathToRegexp('/integration/consignment/rent-request/:id').exec(location.pathname)
        if (match) {
          dispatch({
            type: 'queryDetail',
            payload: {
              id: decodeURIComponent(match[1])
            }
          })
        }
        if (pathname === '/integration/consignment/rent-request') {
          dispatch({
            type: 'updateState',
            payload: {
              activeKey: activeKey || '0'
            }
          })
          if (activeKey === '1') {
            dispatch({
              type: 'query',
              payload: {
                status: 'pending',
                ...other
              }
            })
          } else {
            dispatch({ type: 'queryBox', payload: other })
          }
        }
      })
    }
  },

  effects: {
    * queryDetail ({ payload = {} }, { call, put }) {
      yield put({
        type: 'updateState',
        payload: {
          data: {}
        }
      })
      const data = yield call(queryById, payload)
      if (data.success && data.data) {
        yield put({
          type: 'updateState',
          payload: {
            data: data.data
          }
        })
      } else {
        throw data
      }
    },

    * queryBox ({ payload = {} }, { call, put }) {
      yield put({
        type: 'updateState',
        payload: {
          listBox: [],
          listOutlet: []
        }
      })
      const consignmentId = getConsignmentId()
      if (consignmentId) {
        payload.outlet_id = consignmentId
        const data = yield call(queryBox, payload)
        if (data.success) {
          yield put({
            type: 'updateState',
            payload: {
              listBox: data.listBox,
              listOutlet: data.listOutlet
            }
          })
        } else {
          throw data
        }
      }
    },

    * queryVendor ({ payload = {} }, { call, put }) {
      yield put({
        type: 'updateState',
        payload: {
          listVendor: []
        }
      })
      const data = yield call(queryVendor, payload)
      if (data) {
        yield put({
          type: 'updateState',
          payload: {
            listVendor: data.data
          }
        })
      } else {
        throw data
      }
    },

    * query ({ payload = {} }, { call, put }) {
      const consignmentId = getConsignmentId()
      if (consignmentId) {
        payload.outlet_id = consignmentId
        const data = yield call(query, {
          ...payload,
          order: '-id'
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
      } else {
        yield put({
          type: 'querySuccess',
          payload: {
            list: [],
            pagination: {
              current: 1,
              pageSize: 10,
              total: 0
            }
          }
        })
      }
    },

    * delete ({ payload }, { call, put }) {
      const data = yield call(remove, payload)
      if (data.success) {
        yield put({
          type: 'query',
          payload: {
            status: 'pending'
          }
        })
      } else {
        throw data
      }
    },

    * add ({ payload }, { call, put }) {
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
          type: 'query',
          payload: {
            status: 'pending'
          }
        })
        if (payload.reset) {
          payload.reset()
        }
        const { pathname } = location
        yield put(routerRedux.push({
          pathname,
          query: {
            activeKey: '1'
          }
        }))
      } else {
        throw data
      }
    },

    * edit ({ payload }, { select, call, put }) {
      const id = yield select(({ rentRequest }) => rentRequest.currentItem.id)
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
        yield put({
          type: 'query',
          payload: {
            status: 'pending'
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

    * approveRequest ({ payload }, { call, put }) {
      // Start - Upload Image
      const uploadedImage = []
      if (payload
        && payload.data
        && payload.data.image
        && payload.data.image.fileList
        && payload.data.image.fileList.length > 0) {
        for (let key in payload.data.image.fileList) {
          const item = payload.data.image.fileList[key]
          const formData = new FormData()
          formData.append('file', item.originFileObj)
          const responseUpload = yield call(uploadRentImage, formData)
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
        && payload.data.image.fileList.length > 5) {
        throw new Error('Cannot upload more than 5 image')
      }
      if (uploadedImage && uploadedImage.length) {
        payload.data.image = uploadedImage[0]
      } else {
        payload.data.image = 'no_image.png'
      }
      // End - Upload Image
      const data = yield call(approve, payload.data)
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
        yield put({
          type: 'query',
          payload: {
            status: 'pending'
          }
        })
      } else {
        throw data
      }
    },

    * voidRequest ({ payload }, { call, put }) {
      const data = yield call(voidTrans, payload.data)
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
        yield put({
          type: 'query',
          payload: {
            status: 'pending'
          }
        })
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
