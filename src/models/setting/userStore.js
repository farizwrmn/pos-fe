import modelExtend from 'dva-model-extend'
import { messageInfo } from 'utils'
import { getAllStores, getListStores, getUserStores, saveUserDefaultStore, saveUserStore }
  from '../../services/setting/userStores'
import { pageModel } from '../common'

export default modelExtend(pageModel, {
  namespace: 'userStore',

  state: {
    storeItem: {},
    listAllStores: [],
    listUserStores: [],
    listCheckedStores: []
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/setting/user') {
          dispatch({
            type: 'query',
            payload: location.query
          })
        }
        if (location.pathname === '/master/account') {
          dispatch({ type: 'userStore/getAllStores', payload: {} })
        }
        if (location.pathname === '/marketing/promo'
          || location.pathname === '/report/accounting/profit-loss'
          || (location.pathname === '/master/paymentoption' && location.query.activeKey === '2')
          || location.pathname === '/report/accounting/tax-report'
          || location.pathname === '/report/accounting/balance-sheet'
          || location.pathname === '/report/accounts/payable'
          || location.pathname === '/report/purchase/summary'
          || location.pathname === '/report/accounts/payment'
          || location.pathname === '/balance/finance/history'
          || location.pathname === '/marketing/incentive-item'
          || location.pathname === '/balance/finance/petty-expense'
          || location.pathname === '/balance/finance/petty-cash'
          || location.pathname === '/accounts/payable-form'
          || location.pathname === '/report/accounting/consolidation/trial-balance'
          || location.pathname === '/report/accounting/consolidation/general-ledger'
          || location.pathname === '/inventory/transfer/invoice'
          || location.pathname === '/master/store-price'
          || location.pathname === '/stock'
          || location.pathname === '/integration/grabmart-campaign'
          || location.pathname === '/stock-planogram'
          || location.pathname === '/master/store-price-upload') {
          dispatch({
            type: 'getAllListStores'
            // payload: location.query
          })
        }
      })
    }
  },

  effects: {

    * query ({ payload = {} }, { call, put }) {
      const userStore = yield call(getAllStores, payload)
      if (userStore.success) {
        yield put({
          type: 'successAllStore',
          payload: {
            listUserStore: userStore.data.map(a => a.key),
            pagination: {
              total: userStore.data.length
            }
          }
        })
      } else {
        console.log('error')
      }
    },
    * getAllStores ({ payload = {} }, { call, put }) {
      const stores = yield call(getAllStores, payload)
      if (stores.success) {
        // yield put({ type: 'getUserStores', payload })
        yield put({
          type: 'successAllStore',
          payload: { listAllStores: stores.data }
        })
      } else {
        console.log('error')
      }
    },
    * getAllListStores ({ payload = {} }, { call, put }) {
      const stores = yield call(getListStores, payload)
      if (stores.success) {
        // yield put({ type: 'getUserStores', payload })
        yield put({
          type: 'successAllStore',
          payload: { listAllStores: stores.data }
        })
      } else {
        console.log('error')
      }
    },
    * getUserStores ({ payload = {} }, { call, put }) {
      const stores = yield call(getUserStores, payload)
      // if (stores.success) {
      yield put({
        type: 'successUserStore',
        payload: {
          listUserStores: stores.success ? stores.userStore : '',
          defaultStore: stores.success ? stores.defaultStore : ''
        }
      })
      // } else {
      //   console.log('error')
      // }
    },
    * saveDefaultStore ({ payload }, { call, put }) {
      // const customer = yield select(({ customer }) => customer.currentItem.memberCode)
      // const newUser = { ...payload, customer }
      const data = yield call(saveUserDefaultStore, payload)
      if (data.success) {
        messageInfo(data.message, 'info', 3)
        yield put({
          type: 'updateState',
          payload: payload.defaultStore
        })
      } else {
        throw data
      }
    },
    * saveCheckedStore ({ payload }, { call, put }) {
      const data = yield call(saveUserStore, payload)
      if (data.success) {
        messageInfo(data.message, 'info', 3)
        yield put({
          type: 'updateState',
          payload: payload.defaultStore
        })
      } else {
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
    successAllStore (state, action) {
      return {
        ...state,
        listAllStores: action.payload.listAllStores
      }
    },
    successUserStore (state, action) {
      return {
        ...state,
        listUserStores: action.payload.listUserStores.split(','),
        storeItem: { default: action.payload.defaultStore }
      }
    },
    updateState (state, action) {
      return {
        ...state,
        ...action,
        storeItem: { default: action.payload }
      }
    },
    updateCheckedStores (state, action) {
      return {
        ...state,
        ...action,
        listCheckedStores: action.payload.data.store
      }
    }
  }
})
