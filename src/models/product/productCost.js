import modelExtend from 'dva-model-extend'
import { querySupplier } from 'services/product/productCost'
import { pageModel } from 'models/common'

export default modelExtend(pageModel, {
  namespace: 'accountCode',

  state: {
    currentItem: {},
    modalType: 'add',
    activeKey: '0',
    list: [],
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      current: 1
    }
  },

  subscriptions: {},

  effects: {

    * query ({ payload = {} }, { call, put }) {
      const data = yield call(querySupplier, payload)
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
    }

  },

  reducers: {
    updateState (state, { payload }) {
      return { ...state, ...payload }
    }
  }
})
