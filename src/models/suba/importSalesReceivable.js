import modelExtend from 'dva-model-extend'
import { message, Modal } from 'antd'
import {
  query,
  add,
  executeList,
  cancelOpname
} from 'services/suba/importSalesReceivable'
import { queryLastActive } from 'services/period'
import { getDateTime } from 'services/setting/time'
import { pageModel } from 'common'
import { lstorage } from 'utils'
import moment from 'moment'

const success = () => {
  message.success('Import Sales Receivable has been saved')
}

export default modelExtend(pageModel, {
  namespace: 'importSalesReceivable',

  state: {
    currentItem: {},
    modalType: 'add',
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
        const { pathname } = location
        if (pathname === '/integration/subagro/sales-receivable/import') {
          dispatch({ type: 'query', payload: {} })
        }
      })
    }
  },

  effects: {

    * query ({ payload = {} }, { call, put }) {
      payload.updated = 0
      const data = yield call(query, payload)
      if (data.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            list: data.data,
            pagination: {
              current: Number(data.page) || 1,
              pageSize: Number(data.pageSize) || 10,
              total: data.total
            }
          }
        })
      }
    },

    * add ({ payload }, { call, put }) {
      payload.header = {
        storeId: lstorage.getCurrentUserStore()
      }
      const data = yield call(add, payload)
      if (data.success) {
        success()
        yield put({
          type: 'updateState',
          payload: {
            modalType: 'add',
            currentItem: {}
          }
        })
        yield put({
          type: 'query'
        })
      } else {
        yield put({
          type: 'updateState',
          payload: {
            currentItem: payload
          }
        })
        throw data
      }
    },

    * execute (payload, { call, put }) {
      const store = lstorage.getCurrentUserStore()
      const period = yield call(queryLastActive)
      let startPeriod
      if (period.data[0]) {
        startPeriod = moment(period.data[0].startPeriod).format('YYYY-MM-DD')
      }
      const time = yield call(getDateTime, {
        id: 'date'
      })
      if (moment(time.data).format('YYYY-MM-DD') >= startPeriod) {
        const stock = {
          date: {
            from: startPeriod,
            to: time.data
          },
          store
        }
        const response = yield call(executeList, {
          stock
        })
        if (response && response.success) {
          yield put({
            type: 'query'
          })
        } else {
          throw response
        }
      } else {
        Modal.warning({
          title: 'Period Has been closed',
          content: 'can`t insert new transaction'
        })
      }
    },

    * cancel (payload, { call, put }) {
      const response = yield call(cancelOpname, {
        storeId: lstorage.getCurrentUserStore()
      })
      if (response && response.success) {
        yield put({
          type: 'query'
        })
        message.success('Success cancel opname')
      } else {
        throw response
      }
    }
  },

  reducers: {
    querySuccess (state, action) {
      const { list, pagination } = action.payload
      return {
        ...state,
        list,
        pagination: {
          ...state.pagination,
          ...pagination
        }
      }
    },

    updateState (state, { payload }) {
      return { ...state, ...payload }
    }
  }
})
