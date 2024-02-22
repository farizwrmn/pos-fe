import modelExtend from 'dva-model-extend'
import { message } from 'antd'
import pathToRegexp from 'path-to-regexp'
import { query, queryDeliveryOrder, queryHeader, add, edit, remove } from 'services/transfer/autoReplenishSubmission'
import { edit as editHeader } from 'services/transfer/autoReplenish'
import { queryLov } from 'services/transferStockOut'
import { pageModel } from 'models/common'
import { lstorage } from 'utils'

const success = () => {
  message.success('Auto Replenish has been saved')
}

export default modelExtend(pageModel, {
  namespace: 'autoReplenishSubmission',

  state: {
    currentItem: {},
    modalType: 'add',
    activeKey: '0',
    list: [],
    listTransferOut: [],
    listDeliveryOrder: [],
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      current: 1
    }
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        const { pathname } = location

        const match = pathToRegexp('/inventory/transfer/auto-replenish-submission/:id').exec(location.pathname)
        if (match) {
          dispatch({
            type: 'query',
            payload: {
              transId: decodeURIComponent(match[1]),
              storeId: location.query.storeId
            }
          })
          dispatch({
            type: 'queryDeliveryOrder',
            payload: {
              transId: decodeURIComponent(match[1]),
              storeId: location.query.storeId
            }
          })
        } else if (pathname === '/inventory/transfer/auto-replenish-submission') {
          dispatch({ type: 'queryHeader' })
        }
      })
    }
  },

  effects: {

    * queryDeliveryOrder ({ payload = {} }, { call, put }) {
      const response = yield call(queryDeliveryOrder, payload)
      if (response.success) {
        yield put({
          type: 'updateState',
          payload: {
            listDeliveryOrder: response.data
          }
        })
        if (response.data && response.data.length > 0 && payload.storeId) {
          yield put({
            type: 'queryTransferOutPrint',
            payload: {
              deliveryOrderNo: response.data.map(item => item.transNo)
            }
          })
        }
      } else {
        throw response
      }
    },

    * editHeader ({ payload }, { call, put }) {
      const response = yield call(editHeader, payload)
      if (response.success) {
        success()
        yield put({ type: 'queryHeader' })
      } else {
        yield put({ type: 'queryHeader' })
        throw response
      }
    },

    * queryTransferOutPrint ({ payload = {} }, { call, put }) {
      const request = {}
      request.active = '1'
      request.deliveryOrderNo = payload.deliveryOrderNo
      const response = yield call(queryLov, request)
      if (response && response.success) {
        yield put({
          type: 'updateState',
          payload: {
            listTransferOut: response.data
          }
        })
      }
    },

    * query ({ payload = {} }, { call, put }) {
      const response = yield call(query, payload)
      if (response.success) {
        yield put({
          type: 'updateState',
          payload: {
            listTransferOut: response.data
          }
        })
      } else {
        throw response
      }
    },

    * queryHeader ({ payload = {} }, { call, put }) {
      payload.storeIdReceiver = lstorage.getListUserStores().map(item => item.value)
      payload.storeId = lstorage.getCurrentUserStore()
      const response = yield call(queryHeader, payload)
      if (response.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            list: response.data
          }
        })
      } else {
        throw response
      }
    },

    * delete ({ payload }, { call, put }) {
      const response = yield call(remove, payload)
      if (response.success) {
        yield put({ type: 'query' })
      } else {
        throw response
      }
    },

    * add ({ payload }, { call, put }) {
      const response = yield call(add, payload.data)
      if (response.success) {
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
        throw response
      }
    },

    * edit ({ payload }, { call, put }) {
      const newCounter = { id: payload.id }
      const response = yield call(edit, newCounter)
      if (response.success) {
        success()
        const match = pathToRegexp('/inventory/transfer/auto-replenish-submission/:id').exec(payload.pathname)
        if (match) {
          yield put({
            type: 'query',
            payload: {
              transId: decodeURIComponent(match[1]),
              storeId: payload.query.storeId
            }
          })
          yield put({
            type: 'queryDeliveryOrder',
            payload: {
              transId: decodeURIComponent(match[1]),
              storeId: payload.query.storeId
            }
          })
          yield put({
            type: 'transferOut/updateState',
            payload: {
              showPrintModal: false
            }
          })
        }
      } else {
        throw response
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
