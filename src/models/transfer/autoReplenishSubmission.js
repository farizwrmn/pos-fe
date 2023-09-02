import modelExtend from 'dva-model-extend'
import { message } from 'antd'
import pathToRegexp from 'path-to-regexp'
import { query, queryHeader, add, edit, remove } from 'services/transfer/autoReplenishSubmission'
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
        } else if (pathname === '/inventory/transfer/auto-replenish-submission') {
          dispatch({ type: 'queryHeader' })
        }
      })
    }
  },

  effects: {

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
