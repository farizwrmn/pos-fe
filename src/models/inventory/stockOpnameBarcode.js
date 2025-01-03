import modelExtend from 'dva-model-extend'
import { pageModel } from 'models/common'
import { query } from 'services/inventory/stockOpnameLocation'
import { lstorage } from 'utils'

export default modelExtend(pageModel, {
  namespace: 'stockOpnameBarcode',

  state: {
    list: []
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      const storeId = lstorage.getCurrentUserStore()
      history.listen((location) => {
        const { activeKey, ...other } = location.query
        console.log('other', ...other)
        const { pathname } = location
        if (pathname === '/print-barcode') {
          dispatch({ type: 'query', payload: { storeId } })
        }
      })
    }
  },

  effects: {

    * query ({ payload = {} }, { call, put }) {
      payload.storeId = lstorage.getCurrentUserStore()
      const response = yield call(query, payload)
      if (response.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            list: response.data,
            pagination: {
              current: Number(response.page) || 1,
              pageSize: Number(response.pageSize) || 10,
              total: response.total
            }
          }
        })
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
    }
  }
})
