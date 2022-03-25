import modelExtend from 'dva-model-extend'
import { routerRedux } from 'dva/router'
import { message } from 'antd'
import { query, add, edit, remove } from 'services/storePrice/stockExtraPriceStore'
import { pageModel } from '../common'

const success = () => {
  message.success('Store Price has been saved')
}

export default modelExtend(pageModel, {
  namespace: 'stockExtraPriceStore',

  state: {
    currentItem: {},
    modalType: 'add',
    activeKey: '0',
    list: [],
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
        if (pathname === '/master/store-price') {
          dispatch({
            type: 'updateState',
            payload: {
              activeKey: activeKey || '0'
            }
          })
          if (activeKey === '1') dispatch({ type: 'query', payload: other })
        }
      })
    }
  },

  effects: {

    * query ({ payload = {} }, { call, put }) {
      const data = yield call(query, payload)
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

    * delete ({ payload }, { call, put, select }) {
      const data = yield call(remove, payload)
      const pagination = yield select(({ stockExtraPriceStore }) => stockExtraPriceStore.pagination)
      if (data.success) {
        yield put({
          type: 'query',
          payload: {
            page: pagination.current,
            pageSize: pagination.pageSize
          }
        })
      } else {
        throw data
      }
    },

    * add ({ payload }, { call, put }) {
      const { data, resetFields } = payload
      if (data && data.storeId && data.storeId.length > 0) {
        for (let key in data.storeId) {
          const storeId = data.storeId[key]
          yield call(add, {
            ...data,
            storeId
          })
        }
      }
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
      resetFields()
    },

    * edit ({ payload }, { select, call, put }) {
      const { data, resetFields } = payload
      const id = yield select(({ stockExtraPriceStore }) => stockExtraPriceStore.currentItem.id)
      const newCounter = { ...data, id }
      const response = yield call(edit, newCounter)
      if (response.success) {
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
        resetFields()
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
        activeKey: '0',
        currentItem: item
      }
    }
  }
})
