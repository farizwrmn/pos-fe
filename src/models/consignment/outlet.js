import modelExtend from 'dva-model-extend'
import { getConsignmentId } from 'utils/lstorage'
import { query, queryEdit, queryAdd, queryDestroy } from 'services/consignment/outlets'
import { message } from 'antd'
import { pageModel } from '../common'


export default modelExtend(pageModel, {
  namespace: 'consignmentOutlet',

  state: {
    formType: 'add',
    activeKey: '0',
    detailActiveKey: '0',
    list: [],
    selectedOutlet: {},
    currentOutlet: {},
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
        if (location.pathname === '/integration/consignment/outlet' ||
          location.pathname === '/integration/consignment/dashboard' ||
          location.pathname === '/integration/consignment/stock-adjustment' ||
          location.pathname === '/integration/consignment/return-report' ||
          location.pathname === '/integration/consignment/sales-return' ||
          location.pathname === '/integration/consignment/cut-off-report' ||
          location.pathname === '/integration/consignment/journal-report' ||
          location.pathname === '/integration/consignment/rent-report' ||
          location.pathname === '/integration/consignment/profit-report' ||
          location.pathname === '/integration/consignment/stock-flow' ||
          location.pathname === '/integration/consignment/payments' ||
          location.pathname === '/integration/consignment/users') {
          dispatch({
            type: 'query',
            payload: {
              current: 1,
              pageSize: 10
            }
          })
        }
      })
    }
  },

  effects: {
    * query ({ payload = {} }, { call, put }) {
      const consignmentId = getConsignmentId()
      const { q, current, pageSize } = payload
      const params = {
        q,
        page: current,
        pageSize
      }
      if (consignmentId) {
        const data = yield call(query, params)
        const outlets = data.data.list
        const selectedOutlet = outlets.filter(filtered => filtered.id === parseInt(consignmentId, 10))[0]
        if (data.success) {
          yield put({
            type: 'querySuccess',
            payload: {
              ...payload,
              list: outlets,
              selectedOutlet,
              pagination: {
                showSizeChanger: true,
                showQuickJumper: true,
                current: Number(data.data.page || 1),
                pageSize: Number(data.data.pageSize || 10),
                total: data.data.count
              }
            }
          })
        }
      } else {
        const data = yield call(query, params)
        const outlets = data.data.list
        yield put({
          type: 'querySuccess',
          payload: {
            list: outlets,
            pagination: {
              showSizeChanger: true,
              showQuickJumper: true,
              current: Number(data.data.page || 1),
              pageSize: Number(data.data.pageSize || 10),
              total: data.data.count
            }
          }
        })
      }
    },
    * queryAdd ({ payload = {} }, { call, put }) {
      const response = yield call(queryAdd, payload)
      if (response && response.meta && response.meta.success) {
        message.success('Berhasil')
        payload.resetFields()
        yield put({
          type: 'query',
          payload: {
            activeKey: '0',
            current: 1,
            pageSize: 10
          }
        })
      } else {
        message.error(`Gagal : ${response.success}`)
      }
    },
    * queryEdit ({ payload = {} }, { call, put }) {
      const response = yield call(queryEdit, payload)
      if (response && response.meta && response.meta.success) {
        message.success('Berhasil')
        payload.resetFields()
        yield put({
          type: 'query',
          payload: {
            currentOutlet: {},
            formType: 'add',
            activeKey: '0',
            current: 1,
            pageSize: 10
          }
        })
      } else {
        message.error(`Gagal : ${response.success}`)
      }
    },
    * queryDestroy ({ payload = {} }, { call, put }) {
      const response = yield call(queryDestroy, payload)
      if (response && response.meta && response.meta.success) {
        message.success('Berhasil')
        yield put({
          type: 'query',
          payload: {
            currentOutlet: {},
            formType: 'add',
            activeKey: '0',
            current: 1,
            pageSize: 10
          }
        })
      } else {
        message.error(`Gagal : ${response.success}`)
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
