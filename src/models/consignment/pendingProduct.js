import { message } from 'antd'
import modelExtend from 'dva-model-extend'
import { query, queryApprove, queryReject } from 'services/consignment/productpending'
import { pageModel } from '../common'


export default modelExtend(pageModel, {
  namespace: 'consignmentPendingProduct',

  state: {
    activeKey: '0',
    list: [],
    q: null,
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      current: 1
    }
  },

  subscriptions: {
    setup ({ history, dispatch }) {
      history.listen((location) => {
        if (location.pathname === '/integration/consignment/pending-product') {
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
      const { q, current, pageSize } = payload
      const params = {
        q,
        page: current,
        pageSize,
        order: '-id'
      }
      const response = yield call(query, params)
      yield put({
        type: 'querySuccess',
        payload: {
          ...payload,
          list: response.data.list,
          pagination: {
            showSizeChanger: true,
            showQuickJumper: true,
            current: Number(response.data.page || 1),
            pageSize: Number(response.data.pageSize || 10),
            total: Number(response.data.count)
          }
        }
      })
    },
    * queryApprove ({ payload = {} }, { call, put }) {
      const params = {
        id: payload.id,
        note: payload.note
      }
      const response = yield call(queryApprove, params)
      if (response && response.meta && response.meta.success) {
        message.success('Berhasil')
        yield put({
          type: 'query',
          payload: {
            current: 1,
            pageSize: 10
          }
        })
      } else {
        message.error(`Gagal : ${response.message}`)
      }
    },
    * queryReject ({ payload = {} }, { call, put }) {
      const params = {
        id: payload.id,
        note: payload.note
      }
      const response = yield call(queryReject, params)
      if (response && response.meta && response.meta.success) {
        message.success('Berhasil')
        yield put({
          type: 'query',
          payload: {
            current: 1,
            pageSize: 10
          }
        })
      } else {
        message.error(`Gagal : ${response.message}`)
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
