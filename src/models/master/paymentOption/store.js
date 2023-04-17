import modelExtend from 'dva-model-extend'
import { query } from 'services/master/paymentOption/paymentMachineStoreService'
import { pageModel } from 'common'
import { message } from 'antd'

export default modelExtend(pageModel, {
  namespace: 'paymentMachineStore',

  state: {
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
