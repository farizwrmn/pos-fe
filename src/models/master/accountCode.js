import modelExtend from 'dva-model-extend'
import { message } from 'antd'
import { queryCode, query, add, edit, remove } from '../../services/master/accountCode'
import { pageModel } from './../common'

const success = () => {
  message.success('Account Code has been saved')
}

export default modelExtend(pageModel, {
  namespace: 'accountCode',

  state: {
    currentItem: {},
    modalType: 'add',
    activeKey: '0',
    listAccountCode: [],
    listAccountCodeLov: [],
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
        if (pathname === '/master/account') {
          dispatch({
            type: 'updateState',
            payload: {
              activeKey: activeKey || '0'
            }
          })
          if (activeKey === '1') {
            dispatch({
              type: 'query',
              payload: {
                ...other
              }
            })
          } else {
            dispatch({
              type: 'queryLov',
              payload: {
                type: 'all',
                field: 'id,accountCode,accountName,accountParentId'
              }
            })
          }
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
            listAccountCode: data.data,
            pagination: {
              current: Number(payload.page) || 1,
              pageSize: Number(payload.pageSize) || 10,
              total: data.total
            }
          }
        })
      }
    },

    * queryLov ({ payload = {} }, { call, put }) {
      const data = yield call(query, payload)
      if (data.success) {
        yield put({
          type: 'querySuccessCounterLov',
          payload: {
            listAccountCode: data.data,
            listAccountCodeLov: data.data,
            pagination: {
              current: Number(payload.page) || 1,
              pageSize: Number(payload.pageSize) || 10,
              total: data.total
            }
          }
        })
      }
    },

    * queryEditItem ({ payload = {} }, { call, put }) {
      const data = yield call(queryCode, payload)
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            currentItem: data.data,
            disable: 'disabled',
            modalType: 'edit',
            activeKey: '0'
          }
        })
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
      console.log('data', data)
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
            field: 'id,accountCode,accountName,accountParentId'
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
      const id = yield select(({ accountCode }) => accountCode.currentItem.id)
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
        yield put({
          type: 'query',
          payload: {
            type: 'all'
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

    querySuccessCounterLov (state, action) {
      const { listAccountCode, listAccountCodeLov, pagination } = action.payload
      return {
        ...state,
        listAccountCode,
        listAccountCodeLov,
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
