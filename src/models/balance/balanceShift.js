import pathToRegexp from 'path-to-regexp'
import modelExtend from 'dva-model-extend'
import { message } from 'antd'
import { lstorage } from 'utils'
import { routerRedux } from 'dva/router'
import {
  query,
  queryByStoreId,
  queryAdd as add,
  queryDelete as remove,
  queryEdit as edit
} from 'services/balancePayment/balanceShiftService'
import { pageModel } from '../common'

export default modelExtend(pageModel, {
  namespace: 'balanceShift',

  state: {
    listShift: [],
    pagination: {
      current: 1,
      showSizeChanger: true
    },

    currentItem: {},
    modalType: 'add',
    activeKey: '0'
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        const { pathname, query } = location
        const { activeKey, page, pageSize } = query
        const match = pathToRegexp('/setoran/closed/:id').exec(location.pathname)
        if (match) {
          dispatch({ type: 'queryByStoreId' })
        }
        if (pathname === '/setoran/current') {
          dispatch({ type: 'queryByStoreId' })
        }
        if (pathname === '/master/setoran-shift') {
          dispatch({
            type: 'query',
            payload: {
              page,
              pageSize
            }
          })
        }
        if (activeKey) {
          dispatch({
            type: 'updateState',
            payload: {
              activeKey
            }
          })
        }
      })
    }
  },

  effects: {
    * query ({ payload = {} }, { call, put }) {
      payload.storeId = lstorage.getCurrentUserStore()
      const response = yield call(query, payload)
      console.log('response', response)
      if (response && response.success && response.data) {
        yield put({
          type: 'updateState',
          payload: {
            listShift: response.data,
            pagination: {
              current: Number(response.page || 1),
              pageSize: Number(response.pageSize || 10),
              total: Number(response.total || 0),
              showSizeChanger: true
            }
          }
        })
      } else {
        message.error(response.message)
      }
    },
    * queryByStoreId ({ payload = {} }, { call, put }) {
      payload.storeId = lstorage.getCurrentUserStore()
      const response = yield call(queryByStoreId, payload)
      if (response && response.success && response.data) {
        yield put({
          type: 'updateState',
          payload: {
            listShift: response.data
          }
        })
      } else {
        message.error('Failed to get balance shift by storeId')
      }
    },

    * delete ({ payload = {} }, { call, put }) {
      const data = yield call(remove, payload)
      if (data.success) {
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },

    * add ({ payload = {} }, { call, put }) {
      payload.storeId = lstorage.getCurrentUserStore()
      const data = yield call(add, payload)
      if (data && data.success) {
        yield put({
          type: 'updateState',
          payload: {
            modalType: 'add',
            currentItem: {}
          }
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

    * edit ({ payload = {} }, { select, call, put }) {
      const id = yield select(({ balanceShift }) => balanceShift.currentItem.id)
      const newShift = { ...payload, id }
      const data = yield call(edit, newShift)
      if (data.success) {
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
    updateState (state, action) {
      return { ...state, ...action.payload }
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
