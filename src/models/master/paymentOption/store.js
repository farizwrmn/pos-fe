import modelExtend from 'dva-model-extend'
import { query, queryAdd } from 'services/master/paymentOption/paymentMachineStoreService'
import { pageModel } from 'common'
import { message } from 'antd'
import { routerRedux } from 'dva/router'

export default modelExtend(pageModel, {
  namespace: 'paymentMachineStore',

  state: {
    currentMachineStore: [],
    currentMachine: {},
    modalVisible: false,
    activeKey: '0',
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
        if (pathname === '/master/paymentoption') {
          if (activeKey === '2') {
            const { page, pageSize, q } = query
            dispatch({
              type: 'query',
              payload: {
                q,
                page: page || 1,
                pageSize: pageSize || 10
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
