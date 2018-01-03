import modelExtend from 'dva-model-extend'
import { query, add, edit, remove } from '../../services/master/productbrand'
import { pageModel } from './../common'
import { message } from 'antd'

const success = () => {
  message.success('Brand Product has been saved')
}

export default modelExtend(pageModel, {
  namespace: 'productbrand',

  state: {
    currentItem: {},
    modalType: 'add',
    display: 'none',
    isChecked: false,
    selectedRowKeys: [],
    activeKey: '0',
    disable: '',
    listBrand: [],
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/master/product/brand') {
        //   const payload = location.query
        }
      })
    },
  },

  effects: {

    * query ({ payload = {} }, { call, put }) {
      const data = yield call(query, payload)
      if (data) {
        yield put({
          type: 'querySuccessBrand',
          payload: {
            listBrand: data.data,
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
      const { selectedRowKeys } = yield select(_ => _.productbrand)
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
      } else {
        throw data
      }
    },

    * edit ({ payload }, { select, call, put }) {
      const id = yield select(({ productbrand }) => productbrand.currentItem.brandCode)
      const newProductBrand = { ...payload, id }
      const data = yield call(edit, newProductBrand)
      if (data.success) {
        yield put({ type: 'query' })
        success()
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

    querySuccessBrand (state, action) {
      const { listBrand, pagination } = action.payload
      return { ...state,
        listBrand,
        pagination: {
          ...state.pagination,
          ...pagination,
        } }
    },

  },
})
