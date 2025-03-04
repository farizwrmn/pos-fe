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
      payload.pageSize = 10
      payload.page = 1

      let allData = []
      let hasMore = true

      while (hasMore) {
        const response = yield call(query, payload)
        if (response.success) {
          allData = allData.concat(response.data)
          hasMore = allData.length < response.total
          payload.page += 1
        } else {
          hasMore = false
        }
      }
      yield put({
        type: 'querySuccess',
        payload: {
          list: allData
        }
      })
    }
  },

  reducers: {
    querySuccess (state, action) {
      const { list } = action.payload
      return {
        ...state,
        list
      }
    }
  }
})
