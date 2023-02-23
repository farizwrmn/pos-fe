import modelExtend from 'dva-model-extend'
import { getConsignmentId } from 'utils/lstorage'
import { query } from 'services/consignment/profit'
import { pageModel } from '../common'


export default modelExtend(pageModel, {
  namespace: 'consignmentProfitReport',

  state: {
    activeKey: '0',
    dateRange: [],

    consignmentId: getConsignmentId(),

    summary: [],
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      current: 1
    }
  },

  subscriptions: {
    setup ({ history, dispatch }) {
      history.listen((location) => {
        if (location.pathname === '/integration/consignment/sales-return') {
          dispatch({
            type: 'query',
            payload: {
            }
          })
        }
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
      const { from, to, vendorId } = payload
      const consignmentId = getConsignmentId()
      if (consignmentId) {
        const params = {
          outletId: consignmentId,
          from,
          to,
          vendorId
        }
        const response = yield call(query, params)
        yield put({ type: 'querySuccess', payload: { summary: response.data, ...payload } })
      } else {
        yield put({ type: 'querySuccess', payload: { summary: [], ...payload } })
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
