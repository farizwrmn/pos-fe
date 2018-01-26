import modelExtend from 'dva-model-extend'
import { query, add, edit, remove } from '../../services/master/productcategory'
import { pageModel } from './../common'
import { message } from 'antd'

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
    show: 1,
    newItem: false,
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/master/product/category') {
          dispatch({
            type: 'updateState',
            payload: {
              newItem: false,
              activeKey: '0',
            },
          })
        }
      })
    },
  },

  effects: {

    * query ({ payload = {} }, { call, put }) {
      const data = yield call(query, payload)
      if (data) {
        yield put({
          type: 'querySuccessCategory',
          payload: {
            listCategory: data.data,
            pagination: {
              current: Number(payload.page) || 1,
              pageSize: Number(payload.pageSize) || 10,
              total: data.total,
            },
          },
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
        yield put({ type: 'query' })
        success()
        yield put({ type: 'updateState', payload: { newItem: true } })
      } else {
        throw data
      }
    },

    * edit ({ payload }, { select, call, put }) {
      const id = yield select(({ productcategory }) => productcategory.currentItem.categoryCode)
      const newProductCategory = { ...payload, id }
      const data = yield call(edit, newProductCategory)
      if (data.success) {
        yield put({ type: 'query' })
        success()
        yield put({ type: 'updateState', payload: { newItem: true } })
      } else {
        throw data
      }
    },
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

    resetProductCategoryList (state) {
      return { ...state, listCategory: [], pagination: { total: 0 } }
    },

    querySuccessCategory (state, action) {
      const { listCategory, pagination } = action.payload
      return { ...state,
        listCategory,
        pagination: {
          ...state.pagination,
          ...pagination,
        } }
    },

  },
})
