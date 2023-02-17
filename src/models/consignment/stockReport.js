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
        if (location.query && location.query.activeKey) {
          dispatch({
            type: 'updateState',
            payload: {
              activeKey: location.query.activeKey
            }
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
            list: response.data
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
