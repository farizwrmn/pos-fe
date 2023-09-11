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
      const response = yield call(remove, payload)
      if (response && response.success && response.data) {
        message.success('Berhasil')
        const { pathname, query } = payload.location
        yield put(routerRedux.push({
          pathname,
          query: {
            ...query
          }
        }))
      } else {
        message.error(response.message)
      }
    },

    * add ({ payload = {} }, { call, put }) {
      payload.storeId = lstorage.getCurrentUserStore()
      const response = yield call(add, payload)
      if (response && response.success && response.data) {
        message.success('Berhasil')
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
        message.error(response.message)
      }
    },

    * edit ({ payload = {} }, { select, call, put }) {
      const id = yield select(({ balanceShift }) => balanceShift.currentItem.id)
      const newShift = { ...payload, id }
      const response = yield call(edit, newShift)
      if (response && response.data && response.success) {
        message.success('Berhasil')
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
      } else {
        yield put({
          type: 'updateState',
          payload: {
            currentItem: payload
          }
        })
        message.error(response.message)
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
