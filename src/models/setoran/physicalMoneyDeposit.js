import modelExtend from 'dva-model-extend'
import { routerRedux } from 'dva/router'
import { message } from 'antd'
import { query, queryById, queryAll, queryByBalanceId, getDataPaymentIdOnlyCash, queryPejabatToko, add, edit, remove } from 'services/setoran/physicalMoneyDeposit'
import pathToRegexp from 'path-to-regexp'
import { pageModel } from '../common'

const success = () => {
  message.success('Data has been saved')
}

export default modelExtend(pageModel, {
  namespace: 'physicalMoneyDeposit',

  state: {
    visible: false,
    itemBalance: null,
    currentItem: {},
    paymentOptionCashItem: {},
    newTransNo: '',
    modalType: 'add',
    activeKey: '0',
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
        const { activeKey, modalType, ...other } = location.query
        const { pathname } = location
        const match = pathToRegexp('/balance/invoice/:id').exec(pathname)
        const balanceId = match && match[1]
        if (match) {
          dispatch({
            type: 'queryByBalanceId',
            payload: {
              id: balanceId
            }
          })
          // dispatch({
          //   type: 'queryAll',
          //   payload: {
          //     balanceId
          //   }
          // })
        }
        if (pathname === '/balance/closing') {
          dispatch({
            type: 'updateState',
            payload: {
              activeKey: activeKey || '0'
            }
          })
          if (activeKey === '1') {
            dispatch({ type: 'query', payload: other })
          }
        }
      })
    }
  },

  effects: {
    * queryAll ({ payload = {} }, { put, call }) {
      const data = yield call(queryAll, payload)
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            list: data.data
          }
        })
      }
    },

    * queryPejabatToko ({ payload = {} }, { put, call }) {
      const data = yield call(queryPejabatToko, payload)
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            currentItem: data.data
          }
        })
      }
    },

    * getDataPaymentIdOnlyCash ({ payload = {} }, { put, call }) {
      payload.update = 0
      const data = yield call(getDataPaymentIdOnlyCash, { typeCode: 'C', typeName: 'Cash' })
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            paymentOptionCashItem: data.data
          }
        })
      }
    },

    * queryByBalanceId ({ payload = {} }, { call, put }) {
      const data = yield call(queryByBalanceId, payload)
      if (data.success) {
        yield put({ type: 'getDataPaymentIdOnlyCash', payload: {} })
        // if (data && data.data && data.data.cashierUserId) {
        //   yield put({ type: 'queryPejabatToko', payload: { userId: data.data.cashierUserId } })
        // }
        yield put({
          type: 'updateState',
          payload: {
            list: data.data.dataPhysicMoneyAll,
            itemBalance: data.data.dataBalance
          }
        })
      }
    },

    * queryById ({ payload = {} }, { call, put }) {
      const data = yield call(queryById, payload)
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            item: data.data
          }
        })
      }
    },

    * query ({ payload = {} }, { call, put }) {
      const data = yield call(query, payload)
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

    * delete ({ payload }, { call, put }) {
      const data = yield call(remove, payload)
      if (data.success) {
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },

    * add ({ payload }, { call, put }) {
      const data = yield call(add, payload.data)
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
          type: 'query'
        })
        if (payload.reset) {
          payload.reset()
        }
        window.open(`/balance/invoice/${payload.data.balanceId}`, '_blank')
        yield put(routerRedux.push('/balance/current'))
      } else {
        yield put({
          type: 'updateState',
          payload: {
            currentItem: payload
          }
        })
        throw data
      }
    },

    * edit ({ payload }, { select, call, put }) {
      const id = yield select(({ marketingVoucher }) => marketingVoucher.currentItem.id)
      const newCounter = { ...payload.data, id }
      const data = yield call(edit, newCounter)
      if (data.success) {
        success()
        yield put({
          type: 'updateState',
          payload: {
            modalType: 'add',
            currentItem: {},
            activeKey: '1'
          }
        })
        const { pathname } = location
        yield put(routerRedux.push({
          pathname,
          query: {
            activeKey: '1'
          }
        }))
        yield put({ type: 'query' })
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
