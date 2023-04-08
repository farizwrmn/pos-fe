import modelExtend from 'dva-model-extend'
import { routerRedux } from 'dva/router'
import { message } from 'antd'
import { lstorage } from 'utils'
import pathToRegexp from 'path-to-regexp'
import {
  queryCount,
  querySupplierCount,
  query,
  querySupplierDetail,
  addSupplierDetail
} from 'services/procurement/purchaseQuotation'
import {
  queryId as queryRequisitionId
} from 'services/procurement/purchaseRequisition'
import { pageModel } from 'models/common'

const success = () => {
  message.success('Purchase Quotation has been saved')
}

export default modelExtend(pageModel, {
  namespace: 'purchaseQuotation',

  state: {
    listTrans: [],
    listSupplierDetail: [],
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
        const { pathname, query } = location
        const { supplierId } = query
        if (pathname === '/transaction/procurement/quotation') {
          dispatch({ type: 'queryCount', payload: {} })
        }
        const match = pathToRegexp('/transaction/procurement/quotation/:id').exec(location.pathname)
        if (match) {
          dispatch({
            type: 'queryRequisitionDetail',
            payload: {
              id: match[1],
              transId: match[1],
              supplierId
            }
          })
        }
      })
    }
  },

  effects: {

    * queryRequisitionDetail ({ payload = {} }, { call, put }) {
      yield put({
        type: 'updateState',
        payload: {
          currentItem: {}
        }
      })
      const response = yield call(queryRequisitionId, payload)
      if (response.success) {
        yield put({
          type: 'updateState',
          payload: {
            currentItem: response.data
          }
        })

        yield put({
          type: 'querySupplierDetail',
          payload: {
            transId: payload.transId,
            supplierId: payload.supplierId
          }
        })
      } else {
        yield put({
          type: 'updateState',
          payload: {
            currentItem: {}
          }
        })
        throw response
      }
    },

    * querySupplierDetail ({ payload = {} }, { select, call, put }) {
      const response = yield call(querySupplierDetail, {
        transId: payload.transId,
        storeId: lstorage.getCurrentUserStore(),
        supplierId: payload.supplierId
      })
      if (response.success && response.data) {
        const currentItem = yield select(({ purchaseQuotation }) => purchaseQuotation.currentItem)
        if (response.data[0]) {
          currentItem.supplierName = response.data[0].supplierName
          yield put({
            type: 'updateState',
            payload: {
              currentItem
            }
          })
        }
        yield put({
          type: 'updateState',
          payload: {
            listSupplierDetail: response.data.map((item, index) => ({ ...item, no: index + 1 }))
          }
        })
      } else {
        yield put({
          type: 'updateState',
          payload: {
            listSupplierDetail: []
          }
        })
        throw response
      }
    },

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

    * add ({ payload }, { call, put }) {
      const response = yield call(addSupplierDetail, {
        storeId: lstorage.getCurrentUserStore(),
        transId: payload.transId,
        transNo: payload.transNo,
        detail: payload.data
      })
      if (response.success) {
        success()
        yield put({
          type: 'updateState',
          payload: {
            modalType: 'add',
            currentItem: {},
            listSupplierDetail: []
          }
        })
        yield put(routerRedux.push('/transaction/procurement/quotation'))
      } else {
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
