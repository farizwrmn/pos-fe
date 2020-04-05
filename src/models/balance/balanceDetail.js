import modelExtend from 'dva-model-extend'
import pathToRegexp from 'path-to-regexp'
import { message } from 'antd'
import { routerRedux } from 'dva/router'
import { queryById } from '../../services/balance/balance'
import { query, add, edit, remove } from '../../services/balance/balanceDetail'
import { pageModel } from '../common'

const success = () => {
  message.success('Balance has been saved')
}

export default modelExtend(pageModel, {
  namespace: 'balanceDetail',

  state: {
    currentItem: {},
    modalType: 'add',
    display: 'none',
    isChecked: false,
    selectedRowKeys: [],
    listBalanceDetail: [],
    activeKey: '0',
    disable: '',
    show: 1,
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
        if (pathname === '/balanceDetail/current') {
          if (activeKey === '1') {
            dispatch({
              type: 'query',
              payload: other
            })
          }
          if (!activeKey) dispatch({ type: 'refreshView' })
          dispatch({
            type: 'updateState',
            payload: {
              activeKey: activeKey || '0'
            }
          })
        }
        const match = pathToRegexp('/balance/invoice/:id').exec(location.pathname)
        if (match) {
          dispatch({ type: 'queryById', payload: { id: match[1] } })
        }
      })
    }
  },

  effects: {

    * query ({ payload = {} }, { call, put }) {
      const data = yield call(query, payload)
      if (data) {
        yield put({
          type: 'querySuccess',
          payload: {
            listBalanceDetail: data.data,
            pagination: {
              current: Number(payload.page) || 1,
              pageSize: Number(payload.pageSize) || 10,
              total: data.total
            }
          }
        })
      }
    },

    * queryById ({ payload = {} }, { call, put }) {
      const response = yield call(queryById, payload.id)
      if (response && response.success) {
        yield put({
          type: 'updateState',
          payload: {
            currentItem: response.data,
            relationship: 1
          }
        })
        yield put({
          type: 'query',
          payload: {
            balanceId: payload.id,
            type: 'all',
            relationship: 1
          }
        })
      } else {
        throw response
      }
    },

    * delete ({ payload }, { call, put, select }) {
      const data = yield call(remove, { id: payload })
      const { selectedRowKeys } = yield select(_ => _.balanceDetail)
      if (data.success) {
        yield put({ type: 'updateState', payload: { selectedRowKeys: selectedRowKeys.filter(_ => _ !== payload) } })
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },

    * add ({ payload }, { call, put }) {
      const data = yield call(add, { id: payload.id, data: payload.data })
      if (data.success) {
        // yield put({ type: 'query' })
        success()
        yield put({
          type: 'updateState',
          payload: {
            modalType: 'add',
            currentItem: {}
          }
        })
      } else {
        let current = Object.assign({}, payload.id, payload.data)
        yield put({
          type: 'updateState',
          payload: {
            currentItem: current
          }
        })
        throw data
      }
    },

    * edit ({ payload }, { select, call, put }) {
      const id = yield select(({ balanceDetail }) => balanceDetail.currentItem.id)
      const newData = { ...payload, id }
      const data = yield call(edit, newData)
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
        let current = Object.assign({}, payload.id, payload.data)
        yield put({
          type: 'updateState',
          payload: {
            currentItem: current
          }
        })
        throw data
      }
    }
  },

  reducers: {
    querySuccess (state, action) {
      const { listBalanceDetail, pagination } = action.payload
      return {
        ...state,
        list: listBalanceDetail,
        listBalanceDetail,
        pagination: {
          ...state.pagination,
          ...pagination
        }
      }
    },

    switchIsChecked (state, { payload }) {
      return { ...state, isChecked: !state.isChecked, display: payload }
    },

    changeTab (state, { payload }) {
      return { ...state, ...payload }
    },

    resetItem (state, { payload }) {
      return { ...state, ...payload }
    },

    resetSupplierList (state) {
      return { ...state, list: [], listBalanceDetail: [], pagination: { total: 0 } }
    },

    refreshView (state) {
      return {
        ...state,
        modalType: 'add',
        currentItem: {}
      }
    }
  }
})
