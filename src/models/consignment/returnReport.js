import modelExtend from 'dva-model-extend'
import { getConsignmentId } from 'utils/lstorage'
import { query } from 'services/consignment/returnOrderProducts'
import { pageModel } from '../common'

const getReturnTotal = (list) => {
  let total = 0
  list.map((record) => {
    total += record.total
    return record
  })

  return total
}

export default modelExtend(pageModel, {
  namespace: 'consignmentReturnReport',

  state: {
    activeKey: '0',
    list: [],

    consignmentId: getConsignmentId(),

    range: null,
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      current: 1
    }
  },

  subscriptions: {
    setup ({ history }) {
      history.listen((location) => {
        if (location.pathname === '/integration/consignment/return-report') {
          return true
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
          vendorId: payload.vendorId,
          from: payload.from,
          to: payload.to
        }
        const response = yield call(query, params)
        let list = response.data
        let total = getReturnTotal(list)
        list.push({ total })
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
