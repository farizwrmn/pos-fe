import modelExtend from 'dva-model-extend'
import { routerRedux } from 'dva/router'
import { message } from 'antd'
import { querySupplier, add, edit, remove } from 'services/procurement/purchaseReceive'
import { query as getPurchaseOrder } from 'services/procurement/purchaseOrder'
import { pageModel } from 'models/common'
import { lstorage } from 'utils'

const success = () => {
  message.success('Purchase Receive has been saved')
}

export default modelExtend(pageModel, {
  namespace: 'purchaseReceive',

  state: {
    currentItem: {},
    modalType: 'add',
    activeKey: '0',
    listTrans: [],
    listDetail: [],
    listItem: [],
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
        const { pathname } = location
        if (pathname === '/transaction/procurement/receive') {
          dispatch({
            type: 'queryHeader'
          })
        }
      })
    }
  },

  effects: {

    * queryHeader (payload, { call, put }) {
      yield put({
        type: 'updateState',
        payload: {
          listTrans: []
        }
      })
      const response = yield call(querySupplier, {
        storeId: lstorage.getCurrentUserStore()
      })
      if (response.success && response.data) {
        yield put({
          type: 'updateState',
          payload: {
            listTrans: response.data
          }
        })
      } else {
        throw response
      }
    },

    * queryDetail ({ payload = {} }, { call, put }) {
      yield put({
        type: 'updateState',
        payload: {
          listDetail: []
        }
      })
      const response = yield call(getPurchaseOrder, {
        storeId: lstorage.getCurrentUserStore(),
        supplierId: payload.supplierId,
        type: 'all',
        status: 1
      })
      if (response.success && response.data) {
        yield put({
          type: 'updateState',
          payload: {
            listDetail: response.data.map((item, index) => ({
              ...item,
              no: index + 1
            }))
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

    * edit ({ payload }, { select, call, put }) {
      const id = yield select(({ purchaseInvoice }) => purchaseInvoice.currentItem.id)
      const newCounter = { ...payload.data, id }
      const response = yield call(edit, newCounter)
      if (response.success) {
        success()
        yield put({
          type: 'updateState',
          payload: {
            modalType: 'add',
            currentItem: {},
            activeKey: '1'
          }
        })
        const { pathname } = location
        yield put(routerRedux.push({
          pathname,
          query: {
            activeKey: '1'
          }
        }))
        yield put({ type: 'query' })
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
