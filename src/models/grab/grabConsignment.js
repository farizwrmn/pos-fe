import modelExtend from 'dva-model-extend'
import { message } from 'antd'
import { query, add, edit, remove, updateCategory, updateValidate } from 'services/grab/grabConsignment'
import { pageModel } from '../common'

const success = () => {
  message.success('Grab consignment has been saved')
}

export default modelExtend(pageModel, {
  namespace: 'grabConsignment',

  state: {
    currentItem: {},
    currentItemCategory: {},
    modalCategoryVisible: false,
    modalType: 'add',
    list: [],
    activeKey: '0',
    selectedRowKeys: [],
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
        if (pathname === '/integration/grabmart-compliance') {
          dispatch({ type: 'query', payload: other })
        }
      })
    }
  },

  effects: {

    * query ({ payload = {} }, { call, put }) {
      const data = yield call(query, {
        ...payload,
        valid: 0
      })
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
      }
    },

    * updateCategory ({ payload }, { call, put }) {
      const response = yield call(updateCategory, payload.data)
      if (response.success) {
        yield put({
          type: 'query'
        })
        success()
        if (payload.reset) {
          payload.reset()
        }
        yield put({
          type: 'updateState',
          payload: {
            modalCategoryVisible: false,
            currentItemCategory: {}
          }
        })
      } else {
        throw response
      }
    },

    * updateValidate ({ payload }, { call, put }) {
      const response = yield call(updateValidate, payload.data)
      if (response.success) {
        yield put({
          type: 'query'
        })
        success()
        yield put({
          type: 'updateState',
          payload: {
            selectedRowKeys: []
          }
        })
      } else {
        throw response
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
      const data = yield call(add, payload.data)
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
        throw data
      }
    },

    * edit ({ payload }, { select, call, put }) {
      const id = yield select(({ grabConsignment }) => grabConsignment.currentItem.id)
      const newCounter = { ...payload.data, id }
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
        throw data
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
        currentItem: item
      }
    }
  }
})
