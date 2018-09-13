import modelExtend from 'dva-model-extend'
import { message } from 'antd'
import { lstorage } from 'utils'
import { getAllStores, addStore, showStore, updateStore } from '../../services/setting/store'
import { pageModel } from './../common'

const success = (id) => {
  message.success(`Store ${id} has been saved`)
}

export default modelExtend(pageModel, {
  namespace: 'store',

  state: {
    currentItem: {},
    listStore: [],
    setting: { cashRegisterPeriods: { active: true, autoClose: false }, selectedShift: [], selectedCounter: [], memberCode: true },
    modalType: 'add',
    modalEdit: { visible: false, item: {} }
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/setting/store') {
          dispatch({ type: 'getAllStores' })
          dispatch({ type: 'refreshSetting' })
        } else if (location.pathname === '/transaction/work-order' || location.pathname === '/master/customer' || location.pathname === '/transaction/pos') {
          // } else if (location.pathname === '/master/customer' || location.pathname === '/transaction/pos') {
          dispatch({ type: 'showStore', payload: { id: lstorage.getCurrentUserStore() } })
        }
      })
    }
  },

  effects: {
    * getAllStores ({ payload = {} }, { call, put }) {
      const data = yield call(getAllStores, payload)
      if (data.success) {
        if (payload && payload.mode === 'cashier') {
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

    * add ({ payload = {} }, { call, put }) {
      const data = yield call(addStore, payload.data)
      if (data.success) {
        success(payload.data.name)
        yield put({ type: 'refreshSetting' })
        yield put({ type: 'getAllStores' })
      } else {
        yield put({
          type: 'updateState',
          payload: {
            currentItem: payload.data
          }
        })
        throw data
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
            setting: {
              cashRegisterPeriods: data.settingValue ? {
                active: data.settingValue.cashRegisterPeriods.active,
                autoClose: data.settingValue.cashRegisterPeriods.autoClose
              } : {},
              selectedShift: data.settingValue ? data.settingValue.shift : [],
              selectedCounter: data.settingValue ? data.settingValue.counter : [],
              memberCode: data.settingValue ? data.settingValue.memberCode.bySystem : false
            }
          }
        })
      }
    },

    * edit ({ payload }, { call, put }) {
      const data = yield call(updateStore, payload)
      if (data.success) {
        success(payload.data.name)
        yield put({ type: 'refreshSetting' })
        yield put({ type: 'getAllStores' })
      } else {
        throw data
      }
    }
  },

  reducers: {
    addShift (state, { payload }) {
      const { shift } = payload
      state.setting.selectedShift.push(shift)
      return { ...state }
    },

    deleteShift (state, { payload }) {
      const { shift } = payload
      state.setting.selectedShift = state.setting.selectedShift.filter(x => x !== shift)
      return { ...state }
    },

    addCounter (state, { payload }) {
      const { counter } = payload
      state.setting.selectedCounter.push(counter)
      return { ...state }
    },

    deleteCounter (state, { payload }) {
      const { counter } = payload
      state.setting.selectedCounter = state.setting.selectedCounter.filter(x => x !== counter)
      return { ...state }
    },

    setMemberCodeBySystem (state, { payload }) {
      const { value } = payload
      state.setting.memberCode = value
      return { ...state }
    },

    setCashRegisterPeriods (state, { payload }) {
      const { checked, value } = payload
      if (value === 'active') {
        state.setting.cashRegisterPeriods.active = checked
      } else if (value === 'autoClose') {
        state.setting.cashRegisterPeriods.autoClose = checked
      }
      return { ...state }
    },

    refreshSetting (state) {
      return {
        ...state,
        modalType: 'add',
        currentItem: {},
        setting: { cashRegisterPeriods: { active: false, autoClose: false }, selectedShift: [], selectedCounter: [], memberCode: false }
      }
    }
  }
})
