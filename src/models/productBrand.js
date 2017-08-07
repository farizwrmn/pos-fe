import modelExtend from 'dva-model-extend'
import { query, add, edit, remove } from '../services/productBrand'
import { pageModel } from './common'

export default modelExtend(pageModel, {
  namespace: 'productBrand',

  state: {
    listBrand: [],
    currentItem: {},
    addItem: {},
    modalVisible: false,
    searchVisible: false,
    modalType: 'add',
    disableItem: {},
    selectedRowKeys: [],
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname === '/master/product/brand') {
          dispatch({
            type: 'query',
            payload: location.query,
          })
        }
      })
    },
  },

  effects: {

    *query ({ payload = {} }, { call, put }) {
      const data = yield call(query, payload)
      if (data) {
        yield put({
          type: 'querySuccess',
          payload: {
            listBrand: data.data,
            pagination: {
              current: Number(payload.page) || 1,
              pageSize: Number(payload.pageSize) || 5,
              total: data.total,
            },
          },
        })
      }
    },

    *'delete' ({ payload }, { call, put, select }) {
      const data = yield call(remove, payload)
      const { selectedRowKeys } = yield select(_ => _.productBrand)
      if (data.success) {
        yield put({ type: 'updateState', payload: { selectedRowKeys: selectedRowKeys.filter(_ => _ !== payload) } })
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },

    *'deleteBatch' ({ payload }, { call, put }) {
      const data = yield call(remove, payload)
      if (data.success) {
        yield put({ type: 'updateState', payload: { selectedRowKeys: [] } })
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },

    *add ({ payload }, { call, put }) {
      const data = yield call(add, { id: payload.id, data: payload.data })
      if (data.success) {
        yield put({ type: 'modalHide' })
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },

    *edit ({ payload }, { select, call, put }) {
      const brandCode = yield select(({ productBrand }) => productBrand.currentItem.brandCode)
      const newBrand = { ...payload, brandCode }
      const data = yield call(edit, newBrand)
      if (data.success) {
        yield put({ type: 'modalHide' })
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },

  },

  reducers: {

    querySuccess (state, action) {
      const { listBrand, pagination } = action.payload
      return { ...state,
        listBrand,
        pagination: {
          ...state.pagination,
          ...pagination,
        } }
    },
    updateState (state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },
    modalShow (state, { payload }) {
      return { ...state, ...payload, modalVisible: true,
        disableItem: { code: payload.modalType === 'add' ? false : true}
      }
    },
    modalHide (state) {
      return { ...state, modalVisible: false }
    },
    chooseEmployee (state, action) {
      return { ...state, ...action.payload, visiblePopover: false }
    },
    modalPopoverVisible (state, action) {
      return { ...state, ...action.payload, visiblePopover: true }
    },
    modalPopoverClose (state) {
      return { ...state, visiblePopover: false }
    },
    searchShow (state) {
      return { ...state, searchVisible: true }
    },
    searchHide (state) {
      return { ...state, searchVisible: false }
    },
  },
})
