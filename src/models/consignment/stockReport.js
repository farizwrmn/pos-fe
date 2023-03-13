import modelExtend from 'dva-model-extend'
import { getConsignmentId } from 'utils/lstorage'
import {
  query
} from 'services/consignment/stocks'
import { pageModel } from '../common'


export default modelExtend(pageModel, {
  namespace: 'consignmentStockReport',

  state: {
    activeKey: '0',
    list: [],
    selectedVendor: {},

    consignmentId: getConsignmentId(),

    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      current: 1
    }
  },

  subscriptions: {
    setup ({ history, dispatch }) {
      history.listen((location) => {
        if (location.pathname === '/integration/consignment/stock-report') {
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
          dispatch({
            type: 'query',
            payload: location.query
          })
        }
      })
    }
  },

  effects: {
    * query ({ payload = {} }, { call, put }) {
      const consignmentId = getConsignmentId()
      if (consignmentId) {
        const params = {
          q: payload.q,
          outletId: consignmentId,
          vendorId: payload.vendorId
        }
        const response = yield call(query, params)
        yield put({
          type: 'querySuccess',
          payload: {
            ...payload,
            list: response.data,
            pagination: {
              current: Number(payload.page) || 1,
              pageSize: Number(payload.pageSize) || 10,
              total: response && response.meta ? response.meta.total : false
            }
          }
        })
      } else {
        yield put({
          type: 'querySuccess',
          payload: {
            list: []
          }
        })
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
