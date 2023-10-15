import modelExtend from 'dva-model-extend'
import { message } from 'antd'
import { lstorage } from 'utils'
import { generateExpense, deleteExpenseRequest, queryPurchase, queryActive, editExpense, addCashEntry } from 'services/finance/pettyCash'
import { pageModel } from '../common'

const success = () => {
  message.success('Petty expense has been saved')
}

export default modelExtend(pageModel, {
  namespace: 'pettyExpense',

  state: {
    currentItem: {},
    modalType: 'add',
    activeKey: '0',
    listPurchaseExpense: [],
    modalExpenseVisible: false,
    modalCashRegisterVisible: false,
    modalEditNotesVisible: false,
    modalEditNotesItem: {},
    currentItemExpense: {},
    currentItemCancel: {},
    modalCancelVisible: false,
    list: [],
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      current: 1
    }
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        const { activeKey } = location.query
        const { pathname } = location
        if (pathname === '/balance/finance/petty-expense') {
          dispatch({
            type: 'updateState',
            payload: {
              activeKey: activeKey || '0'
            }
          })
          dispatch({ type: 'queryActive' })
        }
        if (pathname === '/accounts/payable-form') {
          dispatch({
            type: 'queryPurchase',
            payload: {
              storeId: lstorage.getCurrentUserStore()
            }
          })
        }
      })
    }
  },

  effects: {

    * queryActive ({ payload = {} }, { call, put }) {
      const data = yield call(queryActive, payload)
      if (data.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            list: data.data,
            pagination: {
              current: Number(data.page) || 1,
              pageSize: Number(data.pageSize) || 10,
              total: data.total
            }
          }
        })
      }
    },

    * queryPurchase ({ payload = {} }, { call, put }) {
      const data = yield call(queryPurchase, payload)
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            listPurchaseExpense: data.data
          }
        })
      }
    },

    * deleteExpenseRequest ({ payload = {} }, { call, put }) {
      const response = yield call(deleteExpenseRequest, {
        ...payload.item
      })
      if (response.success) {
        yield put({
          type: 'queryActive'
        })
        yield put({
          type: 'updateState',
          payload: {
            modalCancelVisible: false,
            currentItemCancel: {}
          }
        })
        if (payload.reset) {
          payload.reset()
        }
      } else {
        throw response
      }
    },

    * generateExpense ({ payload }, { call, put }) {
      const response = yield call(generateExpense, {
        ...payload.item
      })
      if (response.success) {
        yield put({
          type: 'queryActive'
        })
        yield put({
          type: 'updateState',
          payload: {
            modalExpenseVisible: false,
            currentItemExpense: {}
          }
        })
        if (payload.reset) {
          payload.reset()
        }
      } else {
        throw response
      }
    },

    * editExpense ({ payload }, { call, put }) {
      const response = yield call(editExpense, payload)
      if (response.success) {
        yield put({
          type: 'updateState',
          payload: {
            modalEditNotesVisible: false,
            modalEditNotesItem: {}
          }
        })
        yield put({ type: 'queryActive' })
      } else {
        throw response
      }
    },

    * add ({ payload }, { call, put }) {
      const data = yield call(addCashEntry, payload.data)
      if (data.success) {
        success()
        yield put({
          type: 'updateState',
          payload: {
            modalType: 'add',
            currentItem: {}
          }
        })
        yield put({
          type: 'queryActive'
        })
        if (payload.reset) {
          payload.reset()
        }
      } else {
        yield put({
          type: 'updateState',
          payload: {
            currentItem: payload
          }
        })
        throw data
      }
    }
  },

  reducers: {
    querySuccess (state, action) {
      const { list, pagination } = action.payload
      return {
        ...state,
        list,
        pagination: {
          ...state.pagination,
          ...pagination
        }
      }
    },

    updateState (state, { payload }) {
      return { ...state, ...payload }
    },

    changeTab (state, { payload }) {
      const { key } = payload
      return {
        ...state,
        activeKey: key,
        modalType: 'add',
        currentItem: {}
      }
    },

    editItem (state, { payload }) {
      const { item } = payload
      return {
        ...state,
        modalType: 'edit',
        activeKey: '0',
        currentItem: item
      }
    }
  }
})
