import modelExtend from 'dva-model-extend'
import { message } from 'antd'
import { query, queryById, add, edit, remove } from '../../services/master/specification'
import { pageModel } from './../common'

const success = () => {
  message.success('Specification has been saved')
}

export default modelExtend(pageModel, {
  namespace: 'specification',

  state: {
    currentItem: {},
    modalType: 'add',
    activeKey: '0',
    listSpecification: [],
    pagination: {
      current: 1
    }
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        const { activeKey, ...other } = location.query
        const { pathname } = location
        if (pathname === '/master/product/specification') {
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
      const data = yield call(query, payload)
      if (data.success) {
        yield put({
          type: 'querySuccessCounter',
          payload: {
            listSpecification: data.data,
            pagination: {
              current: Number(data.page) || 1,
              pageSize: Number(data.pageSize) || 10,
              total: data.total
            }
          }
        })
      }
    },

    * queryById ({ payload = {} }, { call, put }) {
      const data = yield call(queryById, payload)
      if (data.success) {
        yield put({
          type: 'editItem',
          payload: {
            item: data.data
          }
        })
        // yield put({
        //   type: 'querySuccessCounter',
        //   payload: {
        //     listSpecification: data.data,
        //     pagination: {
        //       current: Number(data.page) || 1,
        //       pageSize: Number(data.pageSize) || 10,
        //       total: data.total
        //     }
        //   }
        // })
      } else {
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
          type: 'query',
          payload: {
            type: 'all',
            field: 'id,categoryId,categoryCode,categoryName,name,createdBy,createdAt,updatedBy,updatedAt'
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

    * edit ({ payload }, { select, call, put }) {
      const id = yield select(({ specification }) => specification.currentItem.id)
      const newCounter = { ...payload, id }
      const data = yield call(edit, newCounter)
      if (data.success) {
        success()
        yield put({
          type: 'updateState',
          payload: {
            modalType: 'add',
            currentItem: {},
            activeKey: '0'
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
      const { listSpecification, pagination } = action.payload
      return {
        ...state,
        listSpecification,
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
