import modelExtend from 'dva-model-extend'
import { query, add, edit, remove } from '../services/customers'
import { pageModel } from './common'
import { config } from 'utils'
import { Modal } from 'antd'

const { disableMultiSelect } = config

export default modelExtend(pageModel, {
  namespace: 'customer',

  state: {
    listCustomer: [],
    currentItem: {},
    addItem: {},
    disableItem: {},
    modalVisible: false,
    searchVisible: false,
    modalType: 'add',
    selectedRowKeys: [],
    disableMultiSelectCustomer: disableMultiSelect,
    visiblePopoverGroup: false,
    visiblePopoverCity: false,
    visiblePopoverType: false,
    paginationCustomer: {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => `Total ${total} Records`,
      current: 1,
      total: null,
    },
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/master/customer') {
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
          type: 'querySuccessCustomer',
          payload: {
            listCustomer: data.data,
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
      const data = yield call(remove, { id: payload.id })
      const { selectedRowKeys } = yield select(_ => _.customer)
      if (data.success) {
        yield put({ type: 'updateStateCustomer', payload: { selectedRowKeys: selectedRowKeys.filter(_ => _ !== payload) } })
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },

    *'deleteBatch' ({ payload }, { call, put }) {
      const data = yield call(remove, payload)
      if (data.success) {
        yield put({ type: 'updateStateCustomer', payload: { selectedRowKeys: [] } })
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },

    *add ({ payload }, { call, put }) {
      const data = yield call(add, payload)
      if (data.success) {
        yield put({ type: 'query' })
        const modal = Modal.info({
          title: 'Information',
          content: 'Customer has been saved...!',
        })
      } else {
        throw data
      }
    },

    *edit ({ payload }, { select, call, put }) {
      const customer = yield select(({ customer }) => customer.currentItem.memberCode)
      const newUser = { ...payload, customer }
      const data = yield call(edit, newUser)
      if (data.success) {
        yield put({ type: 'modalHide' })
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },

  },

  reducers: {

    querySuccessCustomer (state, action) {
      const { listCustomer, pagination } = action.payload
      return { ...state,
        listCustomer,
        pagination: {
          ...state.pagination,
          ...pagination,
        } }
    },
    updateStateCustomer (state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },
    modalShow (state, { payload }) {
      return { ...state, ...payload, modalVisible: true, disableItem: { code: payload.modalType !== 'add' } }
    },
    modalHide (state) {
      return { ...state, modalVisible: false }
    },
    chooseEmployee (state, action) {
      return { ...state, ...action.payload, visiblePopoverGroup: false }
    },
    chooseCity (state, action) {
      return { ...state, ...action.payload, visiblePopoverCity: false }
    },
    chooseType (state, action) {
      return { ...state, ...action.payload, visiblePopoverType: false }
    },
    chooseUnit (state, action) {
      return { ...state, ...action.payload }
    },
    modalPopoverVisible (state, action) {
      return { ...state, ...action.payload, visiblePopoverGroup: true, visiblePopoverType: false, visiblePopoverCity: false }
    },
    modalPopoverVisibleCity (state, action) {
      return { ...state, ...action.payload, visiblePopoverCity: true, visiblePopoverGroup: false, visiblePopoverType: false }
    },
    modalPopoverVisibleType (state, action) {
      return { ...state, ...action.payload, visiblePopoverType: true, visiblePopoverGroup: false, visiblePopoverCity: false }
    },
    modalPopoverClose (state) {
      return { ...state, visiblePopoverGroup: false, visiblePopoverType: false, visiblePopoverCity: false }
    },
    searchShow (state) {
      return { ...state, searchVisible: true }
    },
    searchHide (state) {
      return { ...state, searchVisible: false }
    },
  },
})
