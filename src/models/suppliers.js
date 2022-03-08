import modelExtend from 'dva-model-extend'
import { disableMultiSelect } from 'utils/config.main'
import { query, add, edit, remove } from '../services/suppliers'
import { pageModel } from './common'

export default modelExtend(pageModel, {
  namespace: 'suppliers',

  state: {
    listSuppliers: [],
    currentItem: {},
    addItem: {},
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
      total: null
    }
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/master/supplier') {
          dispatch({
            type: 'query',
            payload: location.query
          })
        }
      })
    }
  },

  effects: {

    * query ({ payload = {} }, { call, put }) {
      const data = yield call(query, payload)
      if (data) {
        yield put({
          type: 'querySuccess',
          payload: {
            listSuppliers: data.data,
            pagination: {
              current: Number(payload.page) || 1,
              pageSize: Number(payload.pageSize) || 5,
              total: data.total
            }
          }
        })
      }
    },

    * delete ({ payload }, { call, put, select }) {
      const data = yield call(remove, { id: payload })
      const { selectedRowKeys } = yield select(_ => _.suppliers)
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

    * edit ({ payload }, { select, call, put }) {
      const supplierCode = yield select(({ suppliers }) => suppliers.currentItem.supplierCode)
      const newSupplier = { ...payload, supplierCode }
      const data = yield call(edit, newSupplier)
      if (data.success) {
        yield put({ type: 'modalHide' })
        yield put({ type: 'query' })
      } else {
        throw data
      }
    }

  },

  reducers: {

    querySuccess (state, action) {
      const { listSuppliers, pagination } = action.payload
      return {
        ...state,
        listSuppliers,
        pagination: {
          ...state.pagination,
          ...pagination
        }
      }
    },
    updateState (state, { payload }) {
      return {
        ...state,
        ...payload
      }
    },
    modalShow (state, { payload }) {
      return { ...state, ...payload, modalVisible: true, disabledItem: { userId: false } }
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
    chooseCity (state, action) {
      return { ...state, ...action.payload, visiblePopoverCity: false }
    },
    modalPopoverVisibleCity (state, action) {
      return { ...state, ...action.payload, visiblePopoverCity: true }
    },
    modalPopoverClose (state) {
      return { ...state, visiblePopoverCity: false }
    },
    searchShow (state) {
      return { ...state, searchVisible: true }
    },
    searchHide (state) {
      return { ...state, searchVisible: false }
    },
    modalIsEmployeeChange (state, action) {
      return {
        ...state,
        ...action.payload,
        disabledItem: {
          userId: (state.modalType !== 'add' ? !state.disabledItem.userId : state.disabledItem.userId),
          getEmployee: !state.disabledItem.getEmployee
        }
      }
    }
  }
})
