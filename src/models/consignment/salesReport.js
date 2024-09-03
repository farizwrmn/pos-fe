import modelExtend from 'dva-model-extend'
import { getConsignmentId } from 'utils/lstorage'
import {
  query
} from 'services/consignment/salesOrderProducts'
import {
  query as queryVendor
} from 'services/consignment/vendors'
import { pageModel } from '../common'

export default modelExtend(pageModel, {
  namespace: 'consignmentSalesReport',

  state: {
    activeKey: '0',
    vendorActiveKey: '0',
    list: [],
    summary: {},

    vendorList: [],
    selectedVendor: {},

    consignmentId: getConsignmentId(),

    dateRange: [],
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      current: 1
    }
  },

  subscriptions: {
    setup ({ history, dispatch }) {
      history.listen((location) => {
        if (location.pathname === '/integration/consignment/sales-report' ||
          location.pathname === '/integration/consignment/dashboard') {
          dispatch({
            type: 'queryVendor',
            payload: {}
          })
          if (location.pathname === '/integration/consignment/sales-report') {
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
        }
      })
    }
  },

  effects: {
    * query ({ payload = {} }, { call, put }) {
      const consignmentId = getConsignmentId()
      if (consignmentId) {
        const params = {
          vendorId: payload.vendorId,
          outletId: consignmentId,
          from: payload.from,
          to: payload.to
        }
        const response = yield call(query, params)
        console.log('response', response)
        if (response.success) {
          yield put({
            type: 'querySuccess',
            payload: {
              list: response.data.data,
              summary: response.data.summary
            }
          })
        } else {
          throw response
        }
      } else {
        yield put({
          type: 'querySuccess',
          payload: {
            list: []
          }
        })
      }
    },
    * queryVendor ({ payload = {} }, { call, put }) {
      const { q } = payload
      const params = {
        q,
        pagination: { current: 1, pageSize: 10 }
      }
      const response = yield call(queryVendor, params)
      const vendors = response.data.list
      yield put({ type: 'querySuccess', payload: { vendorList: vendors, ...payload } })
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
