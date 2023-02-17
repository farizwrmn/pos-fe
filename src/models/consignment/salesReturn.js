import modelExtend from 'dva-model-extend'
import { query, queryById } from 'services/consignment/return'
import { getConsignmentId } from 'utils/lstorage'
import { pageModel } from '../common'

export default modelExtend(pageModel, {
  namespace: 'consignmentSalesReturn',

  state: {
    loading: false,
    typeText: '',
    activeKey: '0',
    List: [],

    // Outlet
    consignmentId: getConsignmentId(),
    // Outlet

    // List
    returnDetail: {},
    // List

    filter: [],
    q: '',
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      current: 1,
      pageSize: 10,
      total: 0
    }
  },

  subscriptions: {
    setup ({ history, dispatch }) {
      history.listen((location) => {
        if (location.pathname === '/integration/consignment/sales-return') {
          dispatch({
            // initilize form product list
            type: 'updateState',
            payload: {
              productList: [
                {
                  salesOrderProductId: null,
                  productName: null,
                  qty: 1,
                  price: null,
                  return_count: null,
                  stock_id: null
                }
              ]
            }
          })
          dispatch({
            type: 'query',
            payload: {
              current: 1,
              pageSize: 10
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
      const consignmentId = getConsignmentId()
      const { current, pageSize } = payload
      if (consignmentId) {
        const params = {
          outletId: consignmentId,
          q: payload.q || '',
          filter: payload.filter || '',
          page: current,
          pageSize
        }
        const response = yield call(query, params)
        yield put({
          type: 'querySuccess',
          payload: {
            list: response.data.list,
            pagination: {
              showSizeChanger: true,
              showQuickJumper: true,
              current: Number(response.data.page || 1),
              pageSize: Number(response.data.pageSize || 10),
              total: response.data.count
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
    },
    * queryById ({ payload = {} }, { call, put }) {
      const data = yield call(queryById, payload.returnId)
      const salesNumber = payload.salesNumber
      yield put({ type: 'querySuccess', payload: { returnDetail: { ...data.data, salesNumber }, ...payload } })
    }
  },

  reducers: {
    querySuccess (state, action) {
      return {
        ...state,
        ...action.payload,
        loading: false
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
