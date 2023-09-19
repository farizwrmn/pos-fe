import modelExtend from 'dva-model-extend'
import { message } from 'antd'
import moment from 'moment'
import { query, add, approve } from 'services/notification/salesDiscount'
import { pageModel } from '../common'

const success = () => {
  message.success('Sales discount has been saved')
}

export default modelExtend(pageModel, {
  namespace: 'salesDiscount',

  state: {
    currentItem: {},
    modalType: 'add',
    display: 'none',
    isChecked: false,
    currentDate: moment(),
    selectedRowKeys: [],
    modalApproveVisible: false,
    modalDetailVisible: false,
    listSalesDiscount: [],
    listRequestCancel: [],
    activeKey: '0',
    disable: '',
    show: 1,
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
        if (pathname === '/sales-discount') {
          dispatch({
            type: 'query'
          })
        }
      })
    }
  },

  effects: {
    * query ({ payload = {} }, { call, put }) {
      const data = yield call(query, payload)
      if (data) {
        yield put({
          type: 'querySuccess',
          payload: {
            listSalesDiscount: data.data,
            requestCancel: data && data.requestCancel ? data.requestCancel : [],
            pagination: {
              current: Number(payload.page) || 1,
              pageSize: Number(payload.pageSize) || 10,
              total: data.total
            }
          }
        })
      }
    },

    * add ({ payload }, { call, put }) {
      const data = yield call(add, { data: payload })
      yield put({ type: 'query' })
      if (data.success) {
        success()
      } else {
        throw data
      }
    },

    * approve ({ payload }, { call, put }) {
      const data = yield call(approve, payload)
      if (data.success) {
        success()
        yield put({ type: 'query' })
      } else {
        throw data
      }
    }
  },

  reducers: {
    querySuccess (state, action) {
      const { listSalesDiscount, requestCancel, pagination } = action.payload
      return {
        ...state,
        listRequestCancel: requestCancel,
        list: listSalesDiscount,
        listSalesDiscount,
        pagination: {
          ...state.pagination,
          ...pagination
        }
      }
    }
  }
})
