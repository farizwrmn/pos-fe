import modelExtend from 'dva-model-extend'
import { query, queryAdd, queryUnrelated } from 'services/master/paymentOption/paymentMachineStoreService'
import { pageModel } from 'common'
import { message } from 'antd'
import { routerRedux } from 'dva/router'
import { lstorage } from 'utils'

export default modelExtend(pageModel, {
  namespace: 'paymentMachineStore',

  state: {
    modalVisible: false,
    listUnrelated: [],
    unrelatedPagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      current: 1
    },

    list: [],
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      current: 1
    }
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        const { activeKey } = location.query
        const { pathname, query } = location
        const storeId = lstorage.getCurrentUserStore()
        if (pathname === '/master/paymentoption') {
          if (activeKey === '2') {
            const { page, pageSize, q } = query
            dispatch({
              type: 'query',
              payload: {
                q,
                page: page || 1,
                pageSize: pageSize || 10,
                storeId
              }
            })
          }
        }
      })
    }
  },

  effects: {

    * query ({ payload = {} }, { call, put }) {
      const response = yield call(query, payload)
      if (response && response.success && response.meta) {
        yield put({
          type: 'querySuccess',
          payload: {
            ...payload,
            list: response.data,
            pagination: {
              showSizeChanger: true,
              showQuickJumper: true,
              current: Number(payload.page || 1),
              pageSize: Number(payload.pageSize || 10),
              total: Number(response.meta.count || 1)
            }
          }
        })
      } else {
        message.error(`${response.message} - Failed to get data`)
      }
    },
    * queryUnrelated ({ payload = {} }, { call, put }) {
      payload.storeId = lstorage.getCurrentUserStore()
      const response = yield call(queryUnrelated, payload)
      if (response && response.success && response.meta) {
        yield put({
          type: 'querySuccess',
          payload: {
            ...payload,
            listUnrelated: response.data,
            unrelatedPagination: {
              showSizeChanger: true,
              showQuickJumper: true,
              current: Number(payload.page),
              pageSize: Number(payload.pageSize),
              total: response.meta.total
            }
          }
        })
      } else {
        message.error(`${response.message} - Failed to get data`)
      }
    },
    * queryAdd ({ payload = {} }, { call, put }) {
      const response = yield call(queryAdd, payload)
      if (response && response.success) {
        yield put({
          type: 'updateState',
          payload: {
            modalVisible: false
          }
        })
        const { pathname, query } = payload.location
        yield put(routerRedux.push({
          pathname,
          query
        }))
      } else {
        message.error(response.message)
      }
    }
  },

  reducers: {
    querySuccess (state, action) {
      return {
        ...state,
        ...action.payload
      }
    }
  }
})
