import modelExtend from 'dva-model-extend'
import { routerRedux } from 'dva/router'
import { message } from 'antd'
import {
  query as querySafetyStock,
  queryDetail,
  querySupplier,
  queryBrand,
  queryCategory
} from 'services/procurement/purchaseSafetyStock'
import { query as querySequence } from 'services/sequence'
import { query, add, edit, remove } from 'services/procurement/purchaseRequisition'
import { pageModel } from 'models/common'
import { lstorage } from 'utils'

const success = () => {
  message.success('Purchase Requisition has been saved')
}

export default modelExtend(pageModel, {
  namespace: 'purchaseRequisition',

  state: {
    currentSafety: {},
    listSafety: [],

    listSafetySupplier: [],
    listSafetyBrand: [],
    listSafetyCategory: [],

    listItem: [],

    currentItem: {},
    modalType: 'add',
    activeKey: '0',
    list: [],

    paginationSafety: {
      showSizeChanger: true,
      showQuickJumper: false,
      current: 1
    },

    pagination: {
      showSizeChanger: true,
      showQuickJumper: false,
      current: 1
    }
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        const { pathname } = location
        if (pathname === '/transaction/procurement/requisition') {
          dispatch({ type: 'querySequence' })
          dispatch({
            type: 'querySafetyStock',
            payload: {
              storeId: lstorage.getCurrentUserStore()
            }
          })
        }
      })
    }
  },

  effects: {
    * queryDetailSafety ({ payload = {} }, { select, call, put }) {
      const currentSafety = yield select(({ purchaseRequisition }) => purchaseRequisition.currentSafety)
      const response = yield call(queryDetail, {
        ...payload,
        id: currentSafety.id
      })
      if (response.success && response.data && response.data.length > 0) {
        yield put({
          type: 'updateState',
          payload: {
            listSafety: response.data,
            paginationSafety: {
              showSizeChanger: true,
              showQuickJumper: false,
              current: Number(response.page) || 1,
              pageSize: Number(response.pageSize) || 10,
              total: response.total
            }
          }
        })
      } else {
        yield put({
          type: 'updateState',
          payload: {
            listSafety: [],
            pagination: {
              showSizeChanger: true,
              showQuickJumper: false,
              current: 1
            }
          }
        })
        throw response
      }
    },

    * querySupplierSafety ({ payload = {} }, { select, call, put }) {
      const currentSafety = yield select(({ purchaseRequisition }) => purchaseRequisition.currentSafety)
      const response = yield call(querySupplier, {
        ...payload,
        id: currentSafety.id
      })
      if (response.success && response.data && response.data.length > 0) {
        yield put({
          type: 'updateState',
          payload: {
            listSafetySupplier: response.data
          }
        })
      } else {
        yield put({
          type: 'updateState',
          payload: {
            listSafetySupplier: []
          }
        })
        throw response
      }
    },

    * queryBrandSafety ({ payload = {} }, { select, call, put }) {
      const currentSafety = yield select(({ purchaseRequisition }) => purchaseRequisition.currentSafety)
      const response = yield call(queryBrand, {
        ...payload,
        id: currentSafety.id
      })
      if (response.success && response.data && response.data.length > 0) {
        yield put({
          type: 'updateState',
          payload: {
            listSafetyBrand: response.data
          }
        })
      } else {
        yield put({
          type: 'updateState',
          payload: {
            listSafetyBrand: []
          }
        })
        throw response
      }
    },

    * queryCategorySafety ({ payload = {} }, { select, call, put }) {
      const currentSafety = yield select(({ purchaseRequisition }) => purchaseRequisition.currentSafety)
      const response = yield call(queryCategory, {
        ...payload,
        id: currentSafety.id
      })
      if (response.success && response.data && response.data.length > 0) {
        yield put({
          type: 'updateState',
          payload: {
            listSafetyCategory: response.data
          }
        })
      } else {
        yield put({
          type: 'updateState',
          payload: {
            listSafetyCategory: []
          }
        })
        throw response
      }
    },

    * querySequence ({ payload = {} }, { select, call, put }) {
      const invoice = {
        seqCode: 'PR',
        type: lstorage.getCurrentUserStore(),
        ...payload
      }
      const data = yield call(querySequence, invoice)
      const currentItem = yield select(({ purchaseRequisition }) => purchaseRequisition.currentItem)
      const transNo = data.data
      yield put({
        type: 'updateState',
        payload: {
          currentItem: {
            ...currentItem,
            transNo
          }
        }
      })
    },

    * querySafetyStock ({ payload = {} }, { call, put }) {
      const response = yield call(querySafetyStock, {
        storeId: payload.storeId,
        order: '-rangeDateTo',
        pageSize: 1
      })
      if (response.success && response.data && response.data[0]) {
        const currentSafety = response.data[0]
        yield put({
          type: 'updateState',
          payload: {
            currentSafety,
            paginationSafety: {
              showSizeChanger: true,
              showQuickJumper: false,
              current: 1
            }
          }
        })
        yield put({ type: 'queryDetailSafety', payload: { id: currentSafety.id } })
        yield put({ type: 'querySupplierSafety', payload: { id: currentSafety.id } })
        yield put({ type: 'queryBrandSafety', payload: { id: currentSafety.id } })
        yield put({ type: 'queryCategorySafety', payload: { id: currentSafety.id } })
      } else {
        message.error('Safety Stock not found, please generate one first')
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
      const id = yield select(({ purchaseRequisition }) => purchaseRequisition.currentItem.id)
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
