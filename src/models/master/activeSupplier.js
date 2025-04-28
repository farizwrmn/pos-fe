import modelExtend from 'dva-model-extend'
import { message } from 'antd'
import { routerRedux } from 'dva/router'
import { saveSupplierInfo } from 'services/master/activeSupplier'
import { query, edit, remove } from '../../services/master/activeSupplier'
import { pageModel } from './../common'

const success = () => {
  message.success('Active Supplier has been saved')
}

export default modelExtend(pageModel, {
  namespace: 'activeSupplier',

  state: {
    currentItem: {},
    modalType: 'add',
    display: 'none',
    isChecked: false,
    selectedRowKeys: [],
    listActiveSupplier: [],
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
        if (pathname === '/accounts/payable-form') {
          dispatch({
            type: 'query',
            payload: {
              pageSize: 5
            }
          })
        }
        if (location.pathname === '/tools/transaction/purchase') {
          dispatch({
            type: 'query',
            payload: {
              type: 'all'
            }
          })
        }
        if (pathname === '/master/active-supplier') {
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
      })
    }
  },

  effects: {
    * submitActiveSupplier ({ payload }, { call, put }) {
      try {
        const response = yield call(saveSupplierInfo, payload)

        if (response && response.success) {
          message.success(response.message || 'Submission successful!')
          yield put({ type: 'saveSubmitResult', payload: response })
        } else {
          message.error(response.message || 'Submission failed.')
        }

        return response
      } catch (error) {
        console.error('API error:', error)
        message.error('An error occurred while submitting the form.')
        return { success: false, message: 'Internal error' }
      }
    },
    * query ({ payload = {} }, { call, put }) {
      const data = yield call(query, payload)
      if (data) {
        yield put({
          type: 'querySuccess',
          payload: {
            listActiveSupplier: data.data,
            pagination: {
              current: Number(payload.page) || 1,
              pageSize: Number(payload.pageSize) || 10,
              total: data.total
            }
          }
        })
      }
    },

    * delete ({ payload }, { call, put, select }) {
      const data = yield call(remove, { id: payload })
      const { selectedRowKeys } = yield select(models => models.activeSupplier)
      if (data.success) {
        yield put({ type: 'updateState', payload: { selectedRowKeys: selectedRowKeys.filter(_ => _ !== payload) } })
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },

    * add ({ payload }, { call, put }) {
      const data = yield call(saveSupplierInfo, payload.data)
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

    * edit ({ payload }, { call, put }) {
      const newSupplier = { ...payload }
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
      const { listActiveSupplier, pagination } = action.payload
      return {
        ...state,
        list: listActiveSupplier,
        listActiveSupplier,
        pagination: {
          ...state.pagination,
          ...pagination
        }
      }
    },

    updateState (state, { payload }) {
      return {
        ...state,
        ...payload
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
      return { ...state, list: [], listActiveSupplier: [], pagination: { total: 0 } }
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
