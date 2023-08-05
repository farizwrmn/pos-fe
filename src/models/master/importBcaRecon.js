import modelExtend from 'dva-model-extend'
import { message } from 'antd'
import {
  query,
  queryFilename,
  bulkInsert,
  queryMerchantByStoreId
} from 'services/master/importBcaRecon'
import {
  queryImportLog,
  insertImportLog
} from 'services/master/importBcaReconLog'
import { pageModel } from 'common'
import { lstorage } from 'utils'

const success = () => {
  message.success('File has been saved')
}

export default modelExtend(pageModel, {
  namespace: 'importBcaRecon',

  state: {
    currentItem: {},
    currentMerchant: {},
    modalType: 'add',
    modalVisible: true,
    list: [],
    listRecon: [],
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
        if (pathname === '/accounting/bca-recon') {
          dispatch({ type: 'queryBcaRecon', payload: other })
        }
        if (pathname === '/accounting/bca-recon-import') {
          dispatch({ type: 'queryImportLog', payload: other })
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
    * queryMerchantByStoreId ({ payload = {} }, { call, put }) {
      payload.updated = 0
      let storeId = lstorage.getCurrentUserStore()
      const data = yield call(queryMerchantByStoreId, storeId)
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            currentMerchant: data.data
          }
        })
      } else {
        throw data
      }
    },
    * queryBcaRecon ({ payload = {} }, { call, put }) {
      payload.updated = 0
      const data = yield call(query, payload)
      if (data.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            listRecon: data.data,
            pagination: {
              current: Number(data.page) || 1,
              pageSize: Number(data.pageSize) || 10,
              total: data.total
            }
          }
        })
      }
    },

    * queryFilename ({ payload = {} }, { call, put }) {
      payload.updated = 0
      const data = yield call(queryFilename, payload)
      if (data.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            listFilename: data.data
          }
        })
      }
    },

    * bulkInsert ({ payload }, { call, put }) {
      let dataExist = yield call(queryImportLog, { filename: payload.filename })
      if (dataExist && dataExist.data && dataExist.data.length > 0) {
        message.error('file already uploaded')
        return
      }
      const data = yield call(bulkInsert, payload)
      if (data.success) {
        yield put({ type: 'queryImportLog' })
        yield call(insertImportLog, { filename: payload.filename })
        success()
        yield put({ type: 'query', payload })
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
    * queryImportLog ({ payload = {} }, { call, put }) {
      payload.updated = 0
      const data = yield call(queryImportLog, { order: '-id' })
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            listFilename: data.data,
            pagination: {
              current: Number(data.page) || 1,
              pageSize: Number(data.pageSize) || 10,
              total: data.total
            }
          }
        })
      }
    },
    * insertImportLog ({ payload }, { call, put }) {
      const data = yield call(insertImportLog, payload)
      if (data.success) {
        success()
        yield put({ type: 'queryImportLog' })
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
