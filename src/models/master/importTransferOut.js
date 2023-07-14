import modelExtend from 'dva-model-extend'
import { message } from 'antd'
import {
  query,
  add
} from 'services/master/importTransferOut'
import { pageModel } from 'common'
import { lstorage } from 'utils'

const success = () => {
  message.success('Stock has been saved')
}

export default modelExtend(pageModel, {
  namespace: 'importTransferOut',

  state: {
    currentItem: {},
    modalType: 'add',
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
        const { ...other } = location.query
        const { pathname } = location
        if (pathname === '/inventory/transfer/out-import') {
          dispatch({ type: 'query', payload: other })
        }
      })
    }
  },

  effects: {

    * query ({ payload = {} }, { call, put }) {
      payload.updated = 0
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

    * add ({ payload }, { call, put }) {
      payload.header = {
        storeId: lstorage.getCurrentUserStore()
      }
      const data = yield call(add, payload)
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
    }
  }
})
