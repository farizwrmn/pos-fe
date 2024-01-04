import modelExtend from 'dva-model-extend'
import { queryDetail } from 'services/deliveryOrder/deliveryOrderPacker'
import deliveryOrder from 'utils/storage/deliveryOrder'
import { lstorage } from 'utils'
import { pageModel } from 'models/common'
import pathToRegexp from 'path-to-regexp'

export default modelExtend(pageModel, {
  namespace: 'deliveryOrderPacker',

  state: {
    currentItem: {},
    modalType: 'add',
    activeKey: '0',
    list: [],
    pagination: {
      current: 1
    }
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        const match = pathToRegexp('/delivery-order-packer/:id').exec(location.pathname)
        if (match) {
          dispatch({
            type: 'queryDetail',
            payload: {
              id: decodeURIComponent(match[1]),
              storeId: lstorage.getCurrentUserStore()
            }
          })
        }
      })
    }
  },

  effects: {
    * queryDetail ({ payload = {} }, { call, put }) {
      const response = yield call(queryDetail, payload)
      if (!navigator.onLine) {
        const deliveryOrderDetail = yield call(deliveryOrder.load, { transNo: response.data.transNo })
        if (deliveryOrderDetail.id) {
          yield put({
            type: 'updateState',
            payload: {
              deliveryOrderDetail
            }
          })
        }
      }
      if (response.success && response.data && response.data.id) {
        const responsePouch = yield call(deliveryOrder.saveLocal, response.data)
        if (responsePouch && responsePouch.ok) {
          const deliveryOrderDetail = yield call(deliveryOrder.load, { transNo: response.data.transNo })
          // TODO insert into pouchdb
          yield put({
            type: 'updateState',
            payload: {
              deliveryOrderDetail
            }
          })
        }
      } else {
        const deliveryOrderDetail = yield call(deliveryOrder.load, { transNo: response.data.transNo })
        if (deliveryOrderDetail.id) {
          yield put({
            type: 'updateState',
            payload: {
              deliveryOrderDetail
            }
          })
        }
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
