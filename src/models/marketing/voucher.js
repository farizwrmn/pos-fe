import modelExtend from 'dva-model-extend'
import { routerRedux } from 'dva/router'
import FormData from 'form-data'
import { message } from 'antd'
import { uploadVoucherImage } from 'services/utils/imageUploader'
import { query, add, edit, remove } from 'services/marketing/voucher'
import { query as querySequence } from 'services/sequence'
import { pageModel } from '../common'

const success = () => {
  message.success('Voucher has been saved')
}

export default modelExtend(pageModel, {
  namespace: 'marketingVoucher',

  state: {
    currentItem: {},
    newTransNo: '',
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
        const { activeKey, modalType, ...other } = location.query
        const { pathname } = location
        if (pathname === '/marketing/voucher') {
          dispatch({
            type: 'updateState',
            payload: {
              activeKey: activeKey || '0'
            }
          })
          if (activeKey === '1') {
            dispatch({ type: 'query', payload: other })
          } else {
            dispatch({ type: 'queryLastAdjust', payload: { modalType } })
          }
        }
      })
    }
  },

  effects: {
    * queryLastAdjust ({ payload = {} }, { call, put }) {
      const invoice = {
        seqCode: 'VOU',
        type: 1,
        ...payload
      }
      const data = yield call(querySequence, invoice)
      const transNo = data.data
      yield put({
        type: 'updateState',
        payload: {
          newTransNo: transNo
        }
      })
    },

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
      const formData = new FormData()
      let imagePass = true
      if (
        payload
        && payload.bookmarkImage
        && typeof payload.bookmarkImage === 'object'
        && payload.bookmarkImage.file
      ) {
        formData.append('file', payload.bookmarkImage.file.originFileObj)
        const imageUpload = yield call(uploadVoucher, formData)
        if (imageUpload && imageUpload.success) {
          payload.data.bookmarkImage = imageUpload.data.filename
        } else {
          imagePass = false
          throw imageUpload
        }
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
      const id = yield select(({ marketingVoucher }) => marketingVoucher.currentItem.id)
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
