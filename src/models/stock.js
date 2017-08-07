import modelExtend from 'dva-model-extend'
import { query, add, edit, remove } from '../services/stock'
import { pageModel } from './common'
import { config } from 'utils'

const { disableMultiSelect } = config

export default modelExtend(pageModel, {
  namespace: 'stock',

  state: {
    listStock: [],
    currentItem: {},
    addItem: {},
    disableItem: {},
    modalVisible: false,
    searchVisible: false,
    modalType: 'add',
    selectedRowKeys: [],
    disableMultiSelect,
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => `Total ${total} Records`,
      current: 1,
      total: null,
    },
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname === '/master/product/stock') {
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
            listStock: data.data,
            pagination: {
              current: Number(payload.page) || 1,
              pageSize: Number(payload.pageSize) || 5,
              total: data.total,
            },
          },
        })
      }
    },

    * delete ({ payload }, { call, put, select }) {
      const data = yield call(remove, { id: payload.id })
      const { selectedRowKeys } = yield select(_ => _.customer)
      if (data.success) {
        yield put({ type: 'updateState', payload: { selectedRowKeys: selectedRowKeys.filter(_ => _ !== payload) } })
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },

    * deleteBatch ({ payload }, { call, put }) {
      const data = yield call(remove, payload)
      if (data.success) {
        yield put({ type: 'updateState', payload: { selectedRowKeys: [] } })
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },

    * add ({ payload }, { call, put }) {
      const data = yield call(add, payload)
      if (data.success) {
        yield put({ type: 'modalHide' })
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },

    *edit ({ payload }, { select, call, put }) {
      const stockCode = yield select(({ stock }) => stock.currentItem.productCode)
      const newStock = { ...payload, stockCode }
      const data = yield call(edit, newStock)
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
      const { listStock, pagination } = action.payload
      return { ...state,
        listStock,
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
    chooseEmployee (state, action) {
      return { ...state, ...action.payload, visiblePopover: false, visiblePopoverBrand: false }
    },
    modalPopoverVisible (state, action) {
      return { ...state, ...action.payload, visiblePopover: true}
    },
    modalPopoverVisibleBrand (state, action) {
      return { ...state, ...action.payload, visiblePopoverBrand: true}
    },
    modalPopoverClose (state) {
      return { ...state, visiblePopover: false, visiblePopoverBrand: false }
    },
    modalHide (state) {
      return { ...state, modalVisible: false }
    },
    searchShow (state) {
      return { ...state, searchVisible: true }
    },
    searchHide (state) {
      return { ...state, searchVisible: false }
    },
  },
})
