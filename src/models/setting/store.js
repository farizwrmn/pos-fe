import modelExtend from 'dva-model-extend'
import { message } from 'antd'
import { getAllStores, showStore, updateStore } from '../../services/setting/store'
import { pageModel } from './../common'

const success = (id) => {
  message.success(`Store ${id} has been saved`)
}

export default modelExtend(pageModel, {
  namespace: 'store',

  state: {
    currentItem: {},
    listStore: [],
    selectedShift: [],
    modalType: 'add',
    modalEdit: { visible: false, item: {} }
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/setting/store') {
          dispatch({ type: 'getAllStores' })
        }
      })
    }
  },

  effects: {
    * getAllStores ({ payload = {} }, { call, put }) {
      const data = yield call(getAllStores, payload)
      if (data.success) {
        if (payload && payload.mode==='cashier') {
          yield put({
            type: 'updateState',
            payload: {
              listCashierStore: data.data
            }
          })
        } else {
          yield put({
            type: 'updateState',
            payload: {
              listStore: data.data
            }
          })
        }
      }
    },

    * showStore ({ payload = {} }, { call, put }) {
      let data = yield call(showStore, payload)
      if (data.success) {
        data = data.data[0]
        yield put({
          type: 'updateState',
          payload: {
            currentItem: data,
            selectedShift: data.cashierShift ? data.cashierShift.split(',').map(x => parseInt(x, 10)) : []
          }
        })
      }
    },

    * edit ({ payload }, { call, put }) {
      const data = yield call(updateStore, payload)
      if (data.success) {
        success(payload.data.name)
        yield put({
          type: 'updateState',
          payload: {
            modalType: 'add',
            currentItem: {},
            selectedShift: []
          }
        })
      } else {
        throw data
      }
    }
  },

  reducers: {
    addShift (state, { payload }) {
      const { shift } = payload
      state.selectedShift.push(shift)
      return { ...state }
    },

    deleteShift (state, { payload }) {
      const { shift } = payload
      state.selectedShift = state.selectedShift.filter(x => x !== shift)
      return { ...state }
    }
  }
})
