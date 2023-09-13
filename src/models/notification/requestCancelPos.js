import modelExtend from 'dva-model-extend'
import { message } from 'antd'
import { lstorage } from 'utils'
import {
  queryAdd,
  queryPending,
  queryVerify
} from 'services/notification/requestCancelPos/requestCancelPosService'
import { pageModel } from '../common'

const {
  getCurrentUserStore
} = lstorage

export default modelExtend(pageModel, {
  namespace: 'requestCancelPos',

  state: {
    listPending: [],

    currentItem: {},
    visibleModalDetail: false
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        const { pathname } = location
        if (pathname === '/request-cancel-pos') {
          dispatch({
            type: 'queryPending'
          })
        }
      })
    }
  },

  effects: {
    * queryPending ({ payload = {} }, { call, put }) {
      const response = yield call(queryPending, payload)
      if (response && response.success && response.data) {
        yield put({
          type: 'updateState',
          payload: {
            listPending: response.data
          }
        })
      } else {
        message.error(response.message)
      }
    },
    * queryAdd ({ payload = {} }, { call, put }) {
      payload.storeId = getCurrentUserStore()
      const response = yield call(queryAdd, payload)
      if (response && response.success && response.data) {
        message.success('Successfully adding request cancel pos')
        yield put({
          type: 'queryPending'
        })
      } else {
        message.error(response.message)
      }
    },
    * approve ({ payload = {} }, { call, put }) {
      const response = yield call(queryVerify, payload)
      if (response && response.success && response.data) {
        yield put({
          type: 'updateState',
          payload: {
            currentItem: {},
            visibleModalDetail: false
          }
        })
      } else {
        message.error(response.message)
      }
    }
  },

  reducers: {
    updateState (state, { payload = {} }) {
      return ({
        ...state,
        ...payload
      })
    }
  }
})
