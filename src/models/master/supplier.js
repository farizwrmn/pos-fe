import modelExtend from 'dva-model-extend'
import { query, add, edit, remove } from '../../services/master/supplier'
import { pageModel } from './../common'
import { message } from 'antd'

const success = () => {
  message.success('Supplier has been saved')
}

export default modelExtend(pageModel, {
  namespace: 'supplier',

  state: {
    currentItem: {},
    modalType: 'add',
    display: 'none',
    isChecked: false,
    selectedRowKeys: [],
    activeKey: '0',
    disable: '',
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/master/supplier') {
        //   const payload = location.query
        }
      })
    },
  },

  effects: {

    * query ({ payload = {} }, { call, put }) {
      const data = yield call(query, { userName: payload.supplierName })
      if (data) {
        yield put({
          type: 'querySuccess',
          payload: {
            list: data.data,
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
      const { selectedRowKeys } = yield select(_ => _.supplier)
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
      const id = yield select(({ supplier }) => supplier.currentItem.supplierCode)
      const newSupplier = { ...payload, id }
      const data = yield call(edit, newSupplier)
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

  },
})
