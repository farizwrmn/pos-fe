import modelExtend from 'dva-model-extend'
import {
  query,
  approve,
  reject,
  queryDetail
} from 'services/consignment/stockFlowRequest'
import pathToRegexp from 'path-to-regexp'
import { getConsignmentId } from 'utils/lstorage'
import { message } from 'antd'
import { routerRedux } from 'dva/router'
import { pageModel } from '../common'


export default modelExtend(pageModel, {
  namespace: 'consignmentStockFlow',

  state: {
    activeKey: '0',
    list: [],
    currentItem: {},

    consignmentId: getConsignmentId(),

    q: '',
    typeFilter: null,
    statusFilter: null,
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      current: 1
    }
  },

  subscriptions: {
    setup ({ history, dispatch }) {
      history.listen((location) => {
        const match = pathToRegexp('/integration/consignment/stock-flow/:id').exec(location.pathname)
        if (match) {
          dispatch({
            type: 'queryDetail',
            payload: {
              id: decodeURIComponent(match[1])
            }
          })
        }
        if (location.pathname === '/integration/consignment/stock-flow') {
          dispatch({
            type: 'query',
            payload: {}
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
          q: payload.q,
          typeFilter: payload.typeFilter,
          statusFilter: payload.statusFilter,
          pagination: payload.pagination || { current: 1, pageSize: 10 }
        }
        const response = yield call(query, params)
        yield put({
          type: 'querySuccess',
          payload: {
            list: response.data.list,
            pagination: {
              showSizeChanger: true,
              showQuickJumper: true,
              current: Number(response.data.page) || 1,
              pageSize: Number(response.data.pageSize) || 10,
              total: response.data.count
            },
            statusFilter: params.statusFilter,
            typeFilter: params.typeFilter
          }
        })
      } else {
        message.error('OUTLET TIDAK TERDAFTAR')
        yield put({
          type: 'querySuccess',
          payload: {
            list: []
          }
        })
      }
    },
    * approve ({ payload = {} }, { call, put }) {
      const response = yield call(approve, payload)
      if (response && response.meta && response.meta.success) {
        message.success('Berhasil')
        yield put(routerRedux.push('/integration/consignment/stock-flow'))
        yield put({ type: 'querySuccess', payload: { currentItem: {}, ...payload } })
      } else {
        message.error(`Gagal: ${response.message}`)
      }
    },
    * reject ({ payload = {} }, { call, put }) {
      const response = yield call(reject, payload)
      if (response && response.meta && response.meta.success) {
        message.success('Berhasil')
        yield put({ type: 'querySuccess', payload: { currentItem: {}, ...payload } })
      } else {
        message.error(`Gagal: ${response.message}`)
      }
    },

    * queryDetail ({ payload = {} }, { call, put }) {
      const id = payload.id
      const params = { id }
      const response = yield call(queryDetail, params)
      yield put({ type: 'querySuccess', payload: { currentItem: response.data, ...payload } })
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
