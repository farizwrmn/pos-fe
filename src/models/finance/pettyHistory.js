import modelExtend from 'dva-model-extend'
import { query, closing } from 'services/finance/pettyHistory'
import { pageModel } from '../common'

export default modelExtend(pageModel, {
  namespace: 'pettyHistory',

  state: {
    currentItem: {},
    modalType: 'add',
    activeKey: '0',
    list: [],
    modalClosingVisible: false,
    currentItemClosing: {},
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      current: 1
    }
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        const { activeKey, ...other } = location.query
        const { pathname } = location
        if (pathname === '/balance/finance/history') {
          dispatch({
            type: 'updateState',
            payload: {
              activeKey: activeKey || '0'
            }
          })
          dispatch({ type: 'query', payload: other })
        }
      })
    }
  },

  effects: {
    * query ({ payload = {} }, { call, put }) {
      const { storeName, ...other } = payload
      if (!payload.storeId) {
        yield put({
          type: 'updateState',
          payload: {
            list: [],
            currentItemClosing: {}
          }
        })
        return
      }
      yield put({
        type: 'updateState',
        payload: {
          currentItem: {}
        }
      })
      const data = yield call(query, { ...other })
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
        yield put({
          type: 'updateState',
          payload: {
            currentItem: payload
          }
        })
      } else {
        throw data
      }
    },

    * closingPeriod ({ payload = {} }, { call, put }) {
      const response = yield call(closing, payload)
      if (response.success) {
        yield put({
          type: 'updateState',
          payload: {
            modalClosingVisible: false,
            currentItemClosing: {}
          }
        })
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
