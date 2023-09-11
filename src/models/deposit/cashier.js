import moment from 'moment'
import modelExtend from 'dva-model-extend'
import pathToRegexp from 'path-to-regexp'
import { message } from 'antd'
import { lstorage } from 'utils'
import { routerRedux } from 'dva/router'
import {
  queryInvoice as queryBalanceSummary
} from 'services/balancePayment/balanceSummaryService'
import {
  query,
  queryBalance as queryBalanceList,
  queryAdd
} from 'services/balancePayment/balanceDepositService'
import {
  queryDetail as queryBalanceDepositDetail
} from 'services/balancePayment/balanceDepositDetailService'
import {
  queryResolveOption
} from 'services/balancePayment/balanceResolveService'
import { pageModel } from '../common'

const {
  getCurrentUserRole,
  getCurrentUserStore,
  getBalanceListCreateJournal,
  removeBalanceListCreateJournal
} = lstorage

export default modelExtend(pageModel, {
  namespace: 'depositCashier',

  state: {
    list: [],
    pagination: {
      current: 1,
      showSizeChanger: true,
      showQuickJumper: true
    },

    summaryDetail: {},
    listDetail: [],
    paginationDetail: {
      current: 1,
      showSizeChanger: true,
      showQuickJumper: true
    },

    selectedResolve: {},
    listResolveOption: [],

    visibleModalJournal: false,

    listCreateJournal: [],

    depositBalanceDetailInfo: {},
    listDepositBalanceDetailSummary: [],

    balanceDepositInfo: {},
    listDepositBalance: [],
    listDepositJournal: []
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        const { pathname, query } = location
        const { page, pageSize, startDate, endDate, all } = query
        const matchCashierDetail = pathToRegexp('/setoran/cashier/detail/:id').exec(pathname)
        const matchCashierBalanceDetail = pathToRegexp('/setoran/cashier/balance/:id').exec(pathname)
        if (matchCashierDetail) {
          dispatch({
            type: 'queryBalanceDepositDetail',
            payload: {
              transId: matchCashierDetail[1]
            }
          })
        }
        if (matchCashierBalanceDetail) {
          dispatch({
            type: 'queryDepositBalanceDetail',
            payload: {
              balanceId: decodeURIComponent(matchCashierBalanceDetail[1])
            }
          })
        }
        if (pathname === '/setoran/cashier/add') {
          dispatch({
            type: 'queryResolveOption'
          })
          if (startDate && endDate) {
            dispatch({
              type: 'queryBalanceList',
              payload: {
                page,
                pageSize,
                startDate,
                endDate
              }
            })
            dispatch({
              type: 'loadListCreateJournal'
            })
          } else {
            const currentDate = moment().format('YYYY-MM-DD')
            dispatch({
              type: 'queryBalanceList',
              payload: {
                page,
                pageSize,
                startDate: currentDate,
                endDate: currentDate
              }
            })
            dispatch({
              type: 'removeListCreateJournal'
            })
          }
        }
        if (pathname === '/setoran/cashier') {
          dispatch({
            type: 'query',
            payload: {
              page,
              pageSize,
              startDate,
              endDate,
              all
            }
          })
        }
      })
    }
  },

  effects: {
    * query ({ payload = {} }, { call, put }) {
      const { all = false, ...other } = payload
      const allStore = JSON.parse(all)
      const userRole = getCurrentUserRole()
      const currentStore = getCurrentUserStore()
      if (userRole !== 'OWN' || !allStore) {
        other.storeId = currentStore
      }
      const response = yield call(query, other)
      if (response && response.success && response.data) {
        yield put({
          type: 'updateState',
          payload: {
            list: response.data,
            pagination: {
              current: Number(response.page || 1),
              pageSize: Number(response.pageSize || 10),
              total: Number(response.total || 0),
              showSizeChanger: true,
              showQuickJumper: true
            }
          }
        })
      } else {
        message.error(response.message)
      }
    },
    * queryBalanceDepositDetail ({ payload = {} }, { call, put }) {
      const response = yield call(queryBalanceDepositDetail, payload)
      if (response && response.success && response.data) {
        yield put({
          type: 'updateState',
          payload: {
            balanceDepositInfo: response.data.balanceDeposit,
            listDepositBalance: response.data.balanceData,
            listDepositJournal: response.data.journalData
          }
        })
      } else {
        message.error(response.message)
      }
    },
    * queryResolveOption ({ payload = {} }, { call, put }) {
      const response = yield call(queryResolveOption, payload)
      if (response && response.success && response.data) {
        yield put({
          type: 'updateState',
          payload: {
            listResolveOption: response.data
          }
        })
      } else {
        message.error(response.message)
      }
    },
    * queryDepositBalanceDetail ({ payload = {} }, { call, put }) {
      payload.storeId = getCurrentUserStore()
      const responseSummary = yield call(queryBalanceSummary, payload)
      if (responseSummary && responseSummary.success && responseSummary.data && responseSummary.data.detail) {
        yield put({
          type: 'updateState',
          payload: {
            listDepositBalanceDetailSummary: responseSummary.data.detail,
            depositBalanceDetailInfo: responseSummary.data
          }
        })
      } else {
        message.error(responseSummary.message)
      }
    },
    * queryBalanceList ({ payload = {} }, { call, put }) {
      payload.storeId = getCurrentUserStore()
      const response = yield call(queryBalanceList, payload)
      if (response && response.success && response.data) {
        yield put({
          type: 'updateState',
          payload: {
            listDetail: response.data,
            summaryDetail: {
              ...response.summary,
              balanceCount: Number(response.total || 0)
            },
            paginationDetail: {
              current: Number(response.page || 1),
              pageSize: Number(response.pageSize || 10),
              total: Number(response.total || 0),
              showSizeChanger: true,
              showQuickJumper: true
            }
          }
        })
      } else {
        message.error(response.message)
      }
    },
    * queryAdd ({ payload = {} }, { call, put }) {
      payload.storeId = getCurrentUserStore()
      const response = yield call(queryAdd, payload)
      if (response && response.success && response.data) {
        removeBalanceListCreateJournal()
        yield put(routerRedux.push(`/setoran/cashier/detail/${response.data.id}`))
      } else {
        message.error(response.message)
      }
    }
  },

  reducers: {
    updateState (state, { payload }) {
      return { ...state, ...payload }
    },
    loadListCreateJournal (state) {
      const list = getBalanceListCreateJournal()

      const listCreateJournal = JSON.parse(list)

      return {
        ...state,
        listCreateJournal: listCreateJournal || []
      }
    },
    removeListCreateJournal (state) {
      removeBalanceListCreateJournal()
      return {
        ...state,
        listCreateJournal: []
      }
    }
  }
})
