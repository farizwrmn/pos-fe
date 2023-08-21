import modelExtend from 'dva-model-extend'
import { message } from 'antd'
import { routerRedux } from 'dva/router'
import { query, add, edit, remove } from 'services/product/bookmark'
import { pageModel } from '../common'

const success = () => {
  message.success('Bookmark has been saved')
}

export default modelExtend(pageModel, {
  namespace: 'productBookmark',

  state: {
    currentItem: {},
    filter: {},
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
          if (activeKey === '1') {
            dispatch({
              type: 'query',
              payload: { pageSize: 14 }
            })
          }
        }
      })
    }
  },

  effects: {

    * query ({ payload = {} }, { call, put }) {
      const data = yield call(query, {
        pageSize: 14,
        ...payload
      })
      if (data && data.data) {
        yield put({
          type: 'querySuccess',
          payload: {
            list: Array.isArray(data.data) && data.data.filter(filtered => filtered.product !== null || filtered.bundle !== null)
              .map((item) => {
                if (item.product != null) {
                  if (data && data.storePrice && data.storePrice.length > 0) {
                    const filteredProduct = data.storePrice.filter(filtered => filtered.productId === item.productId)
                    if (filteredProduct && filteredProduct.length > 0) {
                      item.product.storePrice = filteredProduct
                    }
                  }
                }
                return item
              }),
            pagination: {
              current: Number(payload.page) || 1,
              pageSize: Number(payload.pageSize) || 14,
              total: data.total
            }
          }
        })
        yield put({
          type: 'updateState',
          payload: {
            filter: payload
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
        yield put({
          type: 'productBookmarkDetail/query',
          payload: {
            id: payload.groupId,
            relationship: 1
          }
        })
      } else {
        throw data
      }
    },

    * add ({ payload }, { call, put }) {
      const data = yield call(add, { data: payload.data })
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
        yield put({
          type: 'productBookmarkDetail/query',
          payload: {
            id: payload.data.groupId,
            relationship: 1
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
      const id = yield select(({ productBookmark }) => productBookmark.currentItem)
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
