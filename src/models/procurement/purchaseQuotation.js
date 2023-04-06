import modelExtend from 'dva-model-extend'
import { routerRedux } from 'dva/router'
import { message } from 'antd'
import { lstorage } from 'utils'
import {
  queryCount,
  querySupplierCount,
  query,
  add,
  edit,
  remove
} from 'services/procurement/purchaseQuotation'
import { pageModel } from 'models/common'

const success = () => {
  message.success('Purchase Quotation has been saved')
}

export default modelExtend(pageModel, {
  namespace: 'purchaseQuotation',

  state: {
    listTrans: [],
    listSupplier: [],

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

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        const { pathname } = location
        if (pathname === '/transaction/procurement/quotation') {
          dispatch({ type: 'queryCount', payload: {} })
        }
      })
    }
  },

  effects: {

    * queryCount (payload, { call, put }) {
      const response = yield call(queryCount, {
        storeId: lstorage.getCurrentUserStore()
      })
      if (response.success) {
        yield put({
          type: 'updateState',
          payload: {
            listTrans: response.data
          }
        })
      } else {
        yield put({
          type: 'updateState',
          payload: {
            listTrans: []
          }
        })
        throw response
      }
    },

    * querySupplierCount ({ payload = {} }, { call, put }) {
      yield put({
        type: 'updateState',
        payload: {
          listSupplier: []
        }
      })
      const response = yield call(querySupplierCount, {
        storeId: lstorage.getCurrentUserStore(),
        transId: payload.transId
      })
      if (response.success) {
        yield put({
          type: 'updateState',
          payload: {
            listSupplier: response.data
          }
        })
      } else {
        yield put({
          type: 'updateState',
          payload: {
            listSupplier: []
          }
        })
        throw response
      }
    },

    * query ({ payload = {} }, { call, put }) {
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
      const id = yield select(({ purchaseQuotation }) => purchaseQuotation.currentItem.id)
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
