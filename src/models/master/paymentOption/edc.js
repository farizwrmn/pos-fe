import modelExtend from 'dva-model-extend'
import { routerRedux } from 'dva/router'
import { message } from 'antd'
import { query, add, edit, remove, queryLov } from 'services/master/paymentOption/paymentMachineService'
import { pageModel } from 'common'
import { lstorage } from 'utils'
import pathToRegexp from 'path-to-regexp'

const success = () => {
  message.success('Payment method has been saved')
}

const { setQrisImage } = lstorage

export default modelExtend(pageModel, {
  namespace: 'paymentEdc',

  state: {
    currentItem: {},
    modalType: 'add',
    activeKey: '0',
    listPayment: [],
    paymentLov: [],
    paymentLovFiltered: [],
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
        if (pathname === '/transaction/pos'
          || pathToRegexp('/accounts/payment/:id').exec(pathname)) {
          dispatch({
            type: 'queryLov',
            payload: {}
          })
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
        const selectedPaymentShortcut = yield select(({ pos }) => (pos ? pos.selectedPaymentShortcut : {}))
        const currentBundlePayment = yield select(({ pos }) => (pos ? pos.currentBundlePayment : {}))
        if (selectedPaymentShortcut && selectedPaymentShortcut.typeCode) {
          if (listPayment && listPayment.length === 1) {
            yield put({
              type: 'paymentCost/updateState',
              payload: {
                listPayment: []
              }
            })
            if (currentBundlePayment && currentBundlePayment.paymentBankId) {
              yield put({
                type: 'paymentCost/query',
                payload: {
                  bankId: currentBundlePayment.paymentBankId,
                  machineId: listPayment[0].id,
                  relationship: 1
                }
              })
              if (listPayment && listPayment[0] && listPayment[0].qrisImage) {
                setQrisImage(listPayment[0].qrisImage)
                message.info('Send Qris Image to Customer View')
              }
            } else {
              yield put({
                type: 'paymentCost/query',
                payload: {
                  machineId: listPayment[0].id,
                  relationship: 1
                }
              })
              if (listPayment && listPayment[0] && listPayment[0].qrisImage) {
                setQrisImage(listPayment[0].qrisImage)
                message.info('Send Qris Image to Customer View')
              }
            }
          } else {
            yield put({
              type: 'paymentCost/updateState',
              payload: {
                listPayment: []
              }
            })
            if (currentBundlePayment && currentBundlePayment.paymentBankId) {
              yield put({
                type: 'paymentCost/query',
                payload: {
                  bankId: currentBundlePayment.paymentBankId,
                  machineId: listPayment[0].id,
                  relationship: 1
                }
              })
              if (listPayment && listPayment[0] && listPayment[0].qrisImage) {
                setQrisImage(listPayment[0].qrisImage)
                message.info('Send Qris Image to Customer View')
              }
            } else {
              yield put({
                type: 'paymentCost/query',
                payload: {
                  machineId: selectedPaymentShortcut.machine,
                  relationship: 1
                }
              })
            }
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


    * queryLov ({ payload = {} }, { call, put }) {
      const storeId = lstorage.getCurrentUserStore()
      const cachedEdc = lstorage.getEdc()
      if (cachedEdc && cachedEdc[0] && cachedEdc[0].storeId === storeId) {
        let paymentLov = cachedEdc
        yield put({
          type: 'querySuccessLov',
          payload: {
            paymentLov
          }
        })
      } else {
        const data = yield call(queryLov, { ...payload, storeId })
        if (data.success) {
          let paymentLov = data.data
          lstorage.setEdc(paymentLov)
          yield put({
            type: 'querySuccessLov',
            payload: {
              paymentLov
            }
          })
        } else {
          throw data
        }
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

    querySuccessLov (state, action) {
      return {
        ...state,
        paymentLov: action.payload.paymentLov
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
