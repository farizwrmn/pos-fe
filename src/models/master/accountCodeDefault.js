import modelExtend from 'dva-model-extend'
import { message } from 'antd'
import { queryCode, query, edit, remove } from '../../services/master/accountCodeDefault'
import { pageModel } from './../common'

const success = () => {
  message.success('Account Code has been saved')
}

export default modelExtend(pageModel, {
  namespace: 'accountCodeDefault',

  state: {
    currentItem: {},
    modalType: 'add',
    activeKey: '0',
    listAccountCode: [],
    listAccountCodeDefaultLov: [],
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      current: 1
    }
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        const { activeKey } = location.query
        const { pathname } = location
        if (pathname === '/master/account') {
          if (activeKey === '2') {
            dispatch({
              type: 'queryLov',
              payload: {
                type: 'all',
                order: 'accountCategory'
              }
            })
          }
        }
      })
    }
  },

  effects: {
    * queryLov ({ payload = {} }, { call, put }) {
      const data = yield call(query, payload)
      if (data.success) {
        yield put({
          type: 'querySuccessCounterLov',
          payload: {
            listAccountCode: data.data,
            listAccountCodeDefaultLov: data.data,
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

    * edit ({ payload }, { call, put }) {
      const data = yield call(edit, payload)
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
          type: 'queryLov',
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
      const { listAccountCode, listAccountCodeDefaultLov, pagination } = action.payload
      return {
        ...state,
        listAccountCode,
        listAccountCodeDefaultLov,
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
