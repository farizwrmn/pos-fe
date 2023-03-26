import modelExtend from 'dva-model-extend'
import moment from 'moment'
import { getConsignmentId } from 'utils/lstorage'
import { queryLovBalance } from 'services/balance/balance'
import { querySummary } from 'services/consignment/journal'
import { pageModel } from '../common'


export default modelExtend(pageModel, {
  namespace: 'consignmentJournalReport',

  state: {
    activeKey: '0',
    detailActiveKey: '0',

    dateRange: [],

    list: [],
    summary: [],
    paymentMethod: [],

    consignmentId: getConsignmentId(),

    balanceList: [],
    selectedBalance: {},

    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      current: 1
    }
  },

  subscriptions: {
    setup ({ history, dispatch }) {
      history.listen((location) => {
        if (location.pathname === '/integration/consignment/journal-report') {
          if (location.query && location.query.activeKey) {
            dispatch({
              type: 'updateState',
              payload: {
                activeKey: location.query.activeKey
              }
            })
          } else {
            dispatch({
              type: 'updateState',
              payload: {
                activeKey: '0'
              }
            })
          }
        }
      })
    }
  },

  effects: {
    * query ({ payload = {} }, { put }) {
      yield put({ type: 'querySuccess', payload: { data: [], ...payload } })
    },
    * querySummary ({ payload = {} }, { call, put }) {
      const consignmentId = getConsignmentId()
      if (consignmentId) {
        const params = {
          ...payload,
          outletId: consignmentId
        }
        const response = yield call(querySummary, params)
        const data = response.data.data
        const paymentMethod = response.data.paymentData
        const list = response.data.list
        yield put({
          type: 'querySuccess',
          payload: {
            summary: data,
            paymentMethod,
            list,
            ...payload
          }
        })
      } else {
        yield put({
          type: 'querySuccess',
          payload: {
            summary: [],
            paymentMethod: [],
            list: []
          }
        })
      }
    },
    * queryLovBalance ({ payload = {} }, { call, put }) {
      const storeId = getConsignmentId()
      if (storeId) {
        const from = moment(payload.dateRange[0]).format('YYYY-MM-DD')
        const to = moment(payload.dateRange[1]).format('YYYY-MM-DD')
        const params = {
          from,
          to,
          storeId: Number(storeId)
        }
        const response = yield call(queryLovBalance, params)
        const list = response.data
        yield put({ type: 'querySuccess', payload: { balanceList: list.filter(filtered => filtered.closed), ...payload } })
      } else {
        yield put({ type: 'querySuccess', payload: { balanceList: [], ...payload } })
      }
    }
  },

  reducers: {
    querySuccess (state, action) {
      return {
        ...state,
        ...action.payload
      }
    },
    updateState (state, action) {
      return {
        ...state,
        ...action.payload
      }
    }
  }
})
