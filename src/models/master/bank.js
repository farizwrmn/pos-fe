import modelExtend from 'dva-model-extend'
import pathToRegexp from 'path-to-regexp'
import { message } from 'antd'
import { routerRedux } from 'dva/router'
import { query, add, edit, remove } from 'services/master/bank'
import { pageModel } from 'common'

const success = () => {
  message.success('Bank has been saved')
}

export default modelExtend(pageModel, {
  namespace: 'bank',

  state: {
    currentItem: {},
    listBank: [],
    searchText: '',
    modalType: 'add',
    activeKey: '0'
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        const { activeKey } = location.query
        const { pathname } = location
        if (pathname === '/master/bank') {
          dispatch({
            type: 'updateState',
            payload: {
              activeKey: activeKey || '0'
            }
          })
          if (activeKey === '1') dispatch({ type: 'query' })
          return
        }
        const match = pathToRegexp('/master/paymentoption/cost/:id').exec(location.pathname)
        if (match
          || location.pathname === '/bank-entry') {
          dispatch({
            type: 'query',
            payload: {
              type: 'all'
            }
          })
        }
      })
    }
  },

  effects: {
    * query ({ payload }, { call, put }) {
      const data = yield call(query, payload)
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            listBank: data.data
          }
        })
      } else {
        throw data
      }
    },
    * add ({ payload }, { call, put }) {
      const data = yield call(add, { data: payload })
      if (data.success) {
        success()
        yield put({
          type: 'updateState',
          payload: {
          }
        })
      } else {
        yield put({
          type: 'updateState',
          payload: {
            currentItem: payload.data
          }
        })
        throw data
      }
    },
    * edit ({ payload }, { select, call, put }) {
      const id = yield select(({ bank }) => bank.currentItem.id)
      const newCounter = { ...payload, id }
      const data = yield call(edit, newCounter)
      if (data.success) {
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
    * delete ({ payload }, { call, put }) {
      const data = yield call(remove, payload)
      if (data.success) {
        yield put({ type: 'query' })
      } else {
        throw data
      }
    }
  },

  reducers: {
    querySuccessCounter (state, action) {
      const { listAccountCode, pagination } = action.payload
      return {
        ...state,
        listAccountCode,
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
