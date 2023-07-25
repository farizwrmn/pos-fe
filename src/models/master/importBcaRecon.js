import modelExtend from 'dva-model-extend'
import { message } from 'antd'
import {
  query,
  bulkInsert
} from 'services/master/importBcaRecon'
import { pageModel } from 'common'

const success = () => {
  message.success('File has been saved')
}

export default modelExtend(pageModel, {
  namespace: 'importBcaRecon',

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
        if (pathname === '/accounting-bca-recon-import') {
          dispatch({ type: 'pathname', payload: other })
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

    * bulkInsert ({ payload }, { call, put }) {
      const data = yield call(bulkInsert, payload)
      if (data.success) {
        success()
        yield put({ type: 'query' })
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
