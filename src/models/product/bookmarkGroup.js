import modelExtend from 'dva-model-extend'
import moment from 'moment'
import { lstorage } from 'utils'
import { message } from 'antd'
import { routerRedux } from 'dva/router'
import { query, add, edit, remove } from '../../services/product/bookmarkGroup'
import { pageModel } from './../common'

const success = () => {
  message.success('Bookmark Group has been saved')
}

export default modelExtend(pageModel, {
  namespace: 'productBookmarkGroup',

  state: {
    currentItem: {},
    modalType: 'add',
    display: 'none',
    isChecked: false,
    selectedRowKeys: [],
    activeKey: '0',
    disable: '',
    list: [],
    show: 1
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        const { activeKey } = location.query
        const { pathname } = location
        if (pathname === '/master/product/bookmark') {
          if (!activeKey) dispatch({ type: 'refreshView' })
          dispatch({
            type: 'updateState',
            payload: {
              activeKey: activeKey || '0'
            }
          })
          if (activeKey === '1') dispatch({ type: 'query' })
        }
        if (pathname === '/transaction/pos') {
          dispatch({ type: 'query', payload: { pageSize: 5, pathname } })
        }
      })
    }
  },

  effects: {

    * query ({ payload = {} }, { call, put }) {
      const { pathname, ...other } = payload
      const data = yield call(query, {
        ...other,
        type: 'all'
      })
      if (data) {
        yield put({
          type: 'querySuccess',
          payload: {
            list: data.data,
            pagination: {
              current: Number(payload.page) || 1,
              pageSize: Number(payload.pageSize) || 10,
              total: data.total
            }
          }
        })
        if (pathname === '/transaction/pos' && data && data.data && data.data.length > 0) {
          yield put({
            type: 'productBookmark/query',
            payload: {
              groupId: data.data[0].id,
              relationship: 1,
              day: moment().isoWeekday(),
              storeId: lstorage.getCurrentUserStore()
            }
          })
        }
      }
    },

    * delete ({ payload }, { call, put }) {
      const data = yield call(remove, { id: payload })
      if (data.success) {
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
        if (payload.reset) {
          payload.reset()
        }
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
      const id = yield select(({ productBookmarkGroup }) => productBookmarkGroup.currentItem.id)
      const newProductBrand = { ...payload, id }
      const data = yield call(edit, newProductBrand)
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
        if (payload.reset) {
          payload.reset()
        }
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

    switchIsChecked (state, { payload }) {
      return { ...state, isChecked: !state.isChecked, display: payload }
    },

    changeTab (state, { payload }) {
      return { ...state, ...payload }
    },

    resetItem (state, { payload }) {
      return { ...state, ...payload }
    },

    resetProductBrandList (state) {
      return { ...state, list: [], pagination: { total: 0 || '' } }
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
