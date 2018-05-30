import modelExtend from 'dva-model-extend'
import { message } from 'antd'
import { routerRedux } from 'dva/router'
import { query, queryCode, add, edit, remove } from '../../services/master/productcategory'
import { pageModel } from './../common'

const success = () => {
  message.success('Category Product has been saved')
}

export default modelExtend(pageModel, {
  namespace: 'productcategory',

  state: {
    currentItem: {},
    modalType: 'add',
    display: 'none',
    isChecked: false,
    selectedRowKeys: [],
    activeKey: '0',
    disable: '',
    listCategory: [],
    listCategoryCurrent: [],
    show: 1
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        const { activeKey } = location.query
        const { pathname } = location
        if (pathname === '/master/product/category') {
          // if (!activeKey) {
          //   dispatch(routerRedux.push({
          //     pathname,
          //     query: {
          //       activeKey: '0'
          //     }
          //   }))
          // }
          dispatch({ type: 'queryLov' })
          dispatch({
            type: 'updateState',
            payload: {
              activeKey: activeKey || '0'
            }
          })
          if (activeKey === '1') dispatch({ type: 'query' })
        }
      })
    }
  },

  effects: {

    * query ({ payload = {} }, { call, put }) {
      let data = yield call(query, payload)
      if (data.success) {
        yield put({
          type: 'querySuccessCategory',
          payload: {
            listCategory: data.data,
            pagination: {
              current: Number(payload.page) || 1,
              pageSize: Number(payload.pageSize) || 10,
              total: data.total
            }
          }
        })
      } else {
        throw data
      }
    },
    * queryLov ({ payload = {} }, { call, put }) {
      let dataCurrent = []
      if (!(Object.assign(payload || {}).length > 0)) {
        dataCurrent = yield call(query)
        yield put({
          type: 'updateState',
          payload: {
            listCategoryCurrent: dataCurrent.data
          }
        })
      }
    },

    * delete ({ payload }, { call, put, select }) {
      const data = yield call(remove, { id: payload })
      const { selectedRowKeys } = yield select(_ => _.productcategory)
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
        yield put({ type: 'queryLov' })
        yield put({ type: 'query' })
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
      const id = yield select(({ productcategory }) => productcategory.currentItem.categoryCode)
      const newProductCategory = { ...payload, id }
      const data = yield call(edit, newProductCategory)
      if (data.success) {
        yield put({ type: 'queryLov' })
        yield put({ type: 'query' })
        success()
        yield put({
          type: 'updateState',
          payload: {
            modalType: 'add',
            currentItem: {}
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
    },

    * queryEditItem ({ payload = {} }, { call, put }) {
      const dataLov = yield call(query, { type: 'lov', id: payload.id })
      const data = yield call(queryCode, payload)
      if (data.success && dataLov.success) {
        yield put({
          type: 'updateState',
          payload: {
            currentItem: data.data,
            listCategory: dataLov.data,
            disable: 'disabled',
            modalType: 'edit',
            activeKey: '0'
          }
        })
      } else {
        throw data
      }
    }
  },

  reducers: {

    switchIsChecked (state, { payload }) {
      return { ...state, isChecked: !state.isChecked, display: payload }
    },

    updateState (state, { payload }) {
      return { ...state, ...payload }
    },

    changeTab (state, { payload }) {
      return { ...state, ...payload }
    },

    resetItem (state, { payload }) {
      return { ...state, ...payload }
    },

    resetProductCategoryList (state) {
      return { ...state, listCategory: [], pagination: { total: 0 } }
    },

    querySuccessCategory (state, action) {
      const { listCategory, pagination } = action.payload
      return {
        ...state,
        listCategory,
        pagination: {
          ...state.pagination,
          ...pagination
        }
      }
    }

  }
})
