import modelExtend from 'dva-model-extend'
import pathToRegexp from 'path-to-regexp'
import { message } from 'antd'
import { routerRedux } from 'dva/router'
import { getActive } from 'services/balance/balanceProcess'
import { queryClose, queryOpen } from 'services/setoran/balancePaymentService'
import { queryClosedDetail, queryInvoice } from 'services/setoran/balanceSummaryService'
import { queryAvailablePaymentOption } from 'services/setoran/balanceInputService'
import { pageModel } from './../common'

export default modelExtend(pageModel, {
  namespace: 'setoran',

  state: {
    formType: 'open',

    currentBalance: {},

    closedBalance: [],

    setoranInvoice: {},
    setoranInvoiceSummary: {},

    balanceInputPaymentOption: [],

    activeKey: '0'
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        const { pathname } = location
        const match = pathToRegexp('/setoran/closed/:id').exec(location.pathname)
        const matchInvoice = pathToRegexp('/setoran/invoice/:id').exec(location.pathname)
        if (match) {
          dispatch({
            type: 'closedBalanceDetail',
            payload: {
              balanceId: decodeURIComponent(match[1])
            }
          })
        }
        if (matchInvoice) {
          dispatch({
            type: 'queryInvoice',
            payload: {
              balanceId: decodeURIComponent(matchInvoice[1])
            }
          })
        }
        if (pathname === '/setoran/current') {
          dispatch({
            type: 'active'
          })
          dispatch({
            type: 'queryInputPaymentOption'
          })
        }
      })
    }
  },

  effects: {
    * active (_, { call, put }) {
      const response = yield call(getActive)
      if (response && response.success && response.data) {
        yield put({
          type: 'updateState',
          payload: {
            formType: 'close',
            currentBalance: response.data
          }
        })
      }
    },
    * openBalance ({ payload = {} }, { call, put }) {
      const response = yield call(queryOpen, payload)
      if (response && response.success && response.data) {
        yield put(routerRedux.push('/transaction/pos'))
      } else {
        message.error(response.message)
      }
    },
    * closeBalance ({ payload = {} }, { call, put }) {
      const response = yield call(queryClose, payload)
      if (response && response.success && response.data && response.data.length > 0) {
        yield put(routerRedux.push(`/setoran/closed/${response.data[0].balanceId}`))
      } else {
        message.error(response.message)
      }
    },
    * closedBalanceDetail ({ payload = {} }, { call, put }) {
      const response = yield call(queryClosedDetail, payload)
      if (response && response.success && response.data && response.data.balanceSummary && response.data.balance) {
        yield put({
          type: 'updateState',
          payload: {
            closedBalance: response.data.balanceSummary,
            currentBalance: response.data.balance
          }
        })
      } else {
        message.error(response.message)
      }
    },
    * queryInvoice ({ payload = {} }, { call, put }) {
      const response = yield call(queryInvoice, payload)
      if (response && response.success && response.data) {
        let totalBalanceInput = 0
        let totalBalancePayment = 0
        let totalDiffBalance = 0
        if (response.data.detail && response.data.detail.length > 0) {
          const detail = response.data.detail
          for (let index in detail) {
            const record = detail[index]
            totalBalanceInput += record.totalBalanceInput
            totalBalancePayment += record.totalBalancePayment
            totalDiffBalance += (record.diffBalance || 0)
              ? record.diffBalance < 0
                ? record.diffBalance * -1
                : record.diffBalance
              : 0
          }
        }
        yield put({
          type: 'updateState',
          payload: {
            setoranInvoice: response.data,
            setoranInvoiceSummary: {
              totalBalanceInput,
              totalBalancePayment,
              totalDiffBalance
            }
          }
        })
      } else {
        message.error(response.message)
      }
    },
    * queryInputPaymentOption (_, { call, put }) {
      const response = yield call(queryAvailablePaymentOption)
      if (response && response.success && response.data) {
        yield put({
          type: 'updateState',
          payload: {
            balanceInputPaymentOption: response.data
          }
        })
      } else {
        message.error(response.message)
      }
    }
  },

  reducers: {
    updateState (state, { payload }) {
      return { ...state, ...payload }
    }
  }
})
