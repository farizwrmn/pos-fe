import modelExtend from 'dva-model-extend'
import { message, Modal } from 'antd'
import {
  query,
  add,
  opnameStock,
  edit,
  remove
} from 'services/master/importstock'
import { bulkInsert } from 'services/master/productstock'
import { queryLastActive } from 'services/period'
import { getDateTime } from 'services/setting/time'
import { pageModel } from 'common'
import { lstorage } from 'utils'
import moment from 'moment'

const success = () => {
  message.success('Stock has been saved')
}

export default modelExtend(pageModel, {
  namespace: 'importstock',

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
        const { ...other } = location.query
        const { pathname } = location
        if (pathname === '/master/product/stock/import') {
          dispatch({ type: 'query', payload: other })
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

    * delete ({ payload }, { call, put }) {
      const data = yield call(remove, payload)
      if (data.success) {
        yield put({ type: 'query' })
      } else {
        throw data
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

    * execute (payload, { call, put, select }) {
      let list = yield select(({ importstock }) => importstock.list)
      const importstock = yield call(query, { type: 'all' })
      if (importstock && importstock.success && importstock.data) {
        list = importstock.data
      }
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
        const detail = list.map(item => ({
          storeId: item.storeId,
          productId: item.productId,
          productCode: item.product.productCode,
          productName: item.product.productName,
          qty: item.qty,
          sellingPrice: item.price
        }))

        const response = yield call(opnameStock, {
          stock,
          detail
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

    * bulkInsert ({ payload }, { call, put }) {
      const data = yield call(bulkInsert, payload)
      if (data.success) {
        success()
        yield put({ type: 'query' })
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

    * edit ({ payload }, { select, call, put }) {
      const id = yield select(({ importstock }) => importstock.currentItem.id)
      const newCounter = { ...payload, id }
      const data = yield call(edit, newCounter)
      if (data.success) {
        success()
        yield put({
          type: 'updateState',
          payload: {
            modalType: 'add',
            currentItem: {}
          }
        })
        yield put({ type: 'query' })
      } else {
        yield put({
          type: 'updateState',
          payload: {
            currentItem: payload
          }
        })
        throw data
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
