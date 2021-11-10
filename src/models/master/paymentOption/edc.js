import modelExtend from 'dva-model-extend'
import { routerRedux } from 'dva/router'
import { message } from 'antd'
import { query, add, edit, remove } from 'services/master/paymentOption/paymentMachineService'
import { pageModel } from 'common'
import pathToRegexp from 'path-to-regexp'

const success = () => {
  message.success('Payment method has been saved')
}

export default modelExtend(pageModel, {
  namespace: 'paymentEdc',

  state: {
    currentItem: {},
    modalType: 'add',
    activeKey: '0',
    listPayment: [],
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      current: 1
    }
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        const { activeKey, ...other } = location.query
        const { pathname } = location
        const match = pathToRegexp('/master/paymentoption/edc/:id').exec(pathname)
          || pathToRegexp('/accounts/payment/:id').exec(pathname)
          || pathToRegexp('/accounts/payable/:id').exec(pathname)
        if (match) {
          dispatch({
            type: 'updateState',
            payload: {
              activeKey: activeKey || '0'
            }
          })
          if (activeKey === '1') {
            dispatch({
              type: 'query',
              payload: {
                ...other,
                paymentOption: match[1]
              }
            })
          }
        }
      })
    }
  },

  effects: {

    * query ({ payload = {} }, { select, call, put }) {
      const { storeId, ...other } = payload
      const data = yield call(query, other)
      if (data.success) {
        let listPayment = data.data
        if (storeId) {
          listPayment = listPayment.filter((filtered) => {
            if (filtered.storeHide) {
              const hideFrom = filtered.storeHide.split(',')
              let exists = true
              for (let key in hideFrom) {
                const item = hideFrom[key]
                if (parseFloat(item) === parseFloat(storeId)) {
                  exists = false
                  break
                }
              }
              return exists
            }
            return true
          })
        }
        const selectedPaymentShortcut = yield select(({ pos }) => (pos ? pos.selectedPaymentShortcut : {}))
        if (selectedPaymentShortcut && selectedPaymentShortcut.typeCode) {
          if (listPayment && listPayment.length === 1) {
            yield put({
              type: 'paymentCost/updateState',
              payload: {
                listPayment: []
              }
            })
            yield put({
              type: 'paymentCost/query',
              payload: {
                machineId: listPayment[0].id,
                relationship: 1
              }
            })
          } else {
            yield put({
              type: 'paymentCost/updateState',
              payload: {
                listPayment: []
              }
            })
            yield put({
              type: 'paymentCost/query',
              payload: {
                machineId: selectedPaymentShortcut.machine,
                relationship: 1
              }
            })
          }
        }
        yield put({
          type: 'querySuccessCounter',
          payload: {
            listPayment,
            pagination: {
              current: Number(data.page) || 1,
              pageSize: Number(data.pageSize) || 10,
              total: data.total
            }
          }
        })
      } else {
        throw data
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
      const data = yield call(add, payload)
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
      const id = yield select(({ paymentEdc }) => paymentEdc.currentItem.id)
      const newCounter = { ...payload, id }
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
    querySuccessCounter (state, action) {
      const { listPayment, pagination } = action.payload
      return {
        ...state,
        listPayment,
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
