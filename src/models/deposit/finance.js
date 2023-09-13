import modelExtend from 'dva-model-extend'
import { routerRedux } from 'dva/router'
import { message } from 'antd'
import { lstorage } from 'utils'
import { query } from 'services/balancePayment/balanceDepositService'
import { queryLedger, queryApproveLedger } from 'services/balancePayment/balanceDepositDetailService'
import { pageModel } from '../common'

const {
  getCurrentUserStore,
  getCurrentUserRole
} = lstorage

export default modelExtend(pageModel, {
  namespace: 'depositFinance',

  state: {
    list: [],
    pagination: {
      current: 1,
      showSizeChanger: true
    },

    listLedger: [],
    listSelectedLedger: []
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        const { pathname, query } = location
        const {
          transId,
          page,
          pageSize,
          all,
          startDate,
          endDate
        } = query
        if (pathname === '/setoran/finance') {
          dispatch({
            type: 'query',
            payload: {
              all,
              page,
              pageSize,
              startDate,
              endDate
            }
          })
          if (transId) {
            dispatch({
              type: 'queryLedger',
              payload: {
                transId
              }
            })
          }
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
              showSizeChanger: true
            }
          }
        })
      }
    },
    * queryLedger ({ payload = {} }, { call, put }) {
      const response = yield call(queryLedger, payload)
      if (response && response.success && response.data) {
        yield put({
          type: 'updateState',
          payload: {
            listLedger: response.data,
            listSelectedLedger: []
          }
        })
      } else {
        message.error(response.message)
      }
    },
    * queryApproveLedger ({ payload = {} }, { call, put }) {
      const { location, ...other } = payload
      const response = yield call(queryApproveLedger, other)
      if (response && response.success && response.data) {
        const { pathname, query } = location
        yield put(routerRedux.push({
          pathname,
          query
        }))
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
