import modelExtend from 'dva-model-extend'
import { message } from 'antd'
import { routerRedux } from 'dva/router'
import { query, add, edit, remove } from '../../services/balance/balance'
import {
  getActive,
  open,
  closed
} from '../../services/balance/balanceProcess'
import { pageModel } from '../common'

const success = () => {
  message.success('Balance has been saved')
}

export default modelExtend(pageModel, {
  namespace: 'balance',

  state: {
    currentItem: {},
    modalType: 'add',
    display: 'none',
    isChecked: false,
    selectedRowKeys: [],
    listBalance: [],
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
        const { pathname } = location
        if (pathname === '/balance/current' || pathname === '/balance/dashboard' || pathname === '/balance/closing') {
          dispatch({
            type: 'active'
          })
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
            listBalance: data.data,
            pagination: {
              current: Number(payload.page) || 1,
              pageSize: Number(payload.pageSize) || 10,
              total: data.total
            }
          }
        })
      }
    },

    * active (payload, { call, put }) {
      const response = yield call(getActive)
      if (response && response.success) {
        yield put({
          type: 'updateState',
          payload: {
            currentItem: response.data
          }
        })
      } else {
        throw response
      }
    },

    * open ({ payload }, { call, put }) {
      const response = yield call(open, payload)
      if (response && response.success) {
        yield put({
          type: 'active'
        })
      } else {
        throw response
      }
    },

    * closed ({ payload }, { call, put }) {
      const response = yield call(closed, payload)
      if (response && response.success) {
        yield put({
          type: 'active'
        })
      } else {
        throw response
      }
    },

    * delete ({ payload }, { call, put, select }) {
      const data = yield call(remove, { id: payload })
      const { selectedRowKeys } = yield select(_ => _.balance)
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
      const id = yield select(({ balance }) => balance.currentItem.id)
      const newSupplier = { ...payload, id }
      const data = yield call(edit, newSupplier)
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
      const { listBalance, pagination } = action.payload
      return {
        ...state,
        list: listBalance,
        listBalance,
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
      return { ...state, list: [], listBalance: [], pagination: { total: 0 } }
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
