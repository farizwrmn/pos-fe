import modelExtend from 'dva-model-extend'
import { message } from 'antd'
import { query, add, edit, remove, queryLov } from 'services/master/paymentOption/paymentCostService'
import { pageModel } from 'common'
import { lstorage } from 'utils'
import pathToRegexp from 'path-to-regexp'

const success = () => {
  message.success('Payment method has been saved')
}

export default modelExtend(pageModel, {
  namespace: 'paymentCost',

  state: {
    currentItem: {},
    modalType: 'add',
    activeKey: '0',
    listPayment: [],
    paymentLov: [],
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
        const match = pathToRegexp('/master/paymentoption/cost/:id').exec(pathname)
          || pathToRegexp('/accounts/payment/:id').exec(pathname)
          || pathToRegexp('/accounts/payable/:id').exec(pathname)
        if (match) {
          dispatch({
            type: 'query',
            payload: {
              machineId: match[1],
              type: 'all'
            }
          })
        }
        if (pathname === '/transaction/pos') {
          dispatch({
            type: 'queryLov',
            payload: {}
          })
        }
      })
    }
  },

  effects: {

    * query ({ payload = {} }, { call, put }) {
      const data = yield call(query, payload)
      if (data.success) {
        yield put({
          type: 'querySuccessCounter',
          payload: {
            listPayment: data.data,
            pagination: {
              current: Number(data.page) || 1,
              pageSize: Number(data.pageSize) || 10,
              total: data.total
            }
          }
        })
      } else {
        throw data
      }
    },

    * queryLov ({ payload = {} }, { call, put }) {
      const storeId = lstorage.getCurrentUserStore()
      const cachedCost = lstorage.getCost()
      if (cachedCost && cachedCost[0] && cachedCost[0].storeId === storeId) {
        yield put({
          type: 'querySuccessLov',
          payload: {
            paymentLov: cachedCost
          }
        })
      } else {
        const data = yield call(queryLov, { ...payload, storeId })
        if (data.success) {
          lstorage.setCost(data.data)
          yield put({
            type: 'querySuccessLov',
            payload: {
              paymentLov: data.data
            }
          })
        } else {
          throw data
        }
      }
    },

    * delete ({ payload }, { call, put }) {
      const data = yield call(remove, payload)
      if (data.success) {
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },

    * add ({ payload }, { call, put }) {
      const data = yield call(add, payload)
      if (data.success) {
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

    * edit ({ payload }, { select, call, put }) {
      const id = yield select(({ paymentCost }) => paymentCost.currentItem.id)
      const newCounter = { ...payload, id }
      const data = yield call(edit, newCounter)
      if (data.success) {
        success()
        yield put({
          type: 'updateState',
          payload: {
            modalType: 'add',
            currentItem: {}
          }
        })
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
    querySuccessCounter (state, action) {
      const { listPayment, pagination } = action.payload
      return {
        ...state,
        listPayment,
        pagination: {
          ...state.pagination,
          ...pagination
        }
      }
    },

    querySuccessLov (state, action) {
      return {
        ...state,
        paymentLov: action.payload.paymentLov
      }
    },

    updateState (state, { payload }) {
      return { ...state, ...payload }
    },

    changeTab (state) {
      return {
        ...state,
        modalType: 'add',
        currentItem: {}
      }
    },

    editItem (state, { payload }) {
      const { item } = payload
      return {
        ...state,
        modalType: 'add',
        currentItem: item
      }
    }
  }
})
