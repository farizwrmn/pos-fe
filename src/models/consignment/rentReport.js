import modelExtend from 'dva-model-extend'
import { getConsignmentId } from 'utils/lstorage'
import { queryReport } from 'services/consignment/rentRequest'
import { pageModel } from '../common'


export default modelExtend(pageModel, {
  namespace: 'consignmentRentReport',

  state: {
    activeKey: '0',
    dateRange: null,

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
        console.log('location.pathname', location.pathname)
        if (location.pathname === '/integration/consignment/sales-return') {
          dispatch({
            type: 'query',
            payload: {
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
          outletId: consignmentId,
          from: payload.from,
          to: payload.to
        }
        const response = yield call(queryReport, params)
        console.log('response', response)
        yield put({
          type: 'querySuccess',
          payload: {
            list: response.data,
            ...payload
          }
        })
      } else {
        yield put({ type: 'querySuccess', payload: { list: [], ...payload } })
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
