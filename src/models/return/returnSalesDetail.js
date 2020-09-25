import modelExtend from 'dva-model-extend'
import moment from 'moment'
import { query, queryById } from 'services/return/returnSalesDetail'
import { pageModel } from '../common'

export default modelExtend(pageModel, {
  namespace: 'returnSalesDetail',

  state: {
    currentItem: {},
    modalType: 'add',
    display: 'none',
    isChecked: false,
    currentDate: moment(),
    selectedRowKeys: [],
    modalApproveVisible: false,
    modalDetailVisible: false,
    list: [],
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
        if (pathname === '/report/pos/payment') {
          dispatch({
            type: 'updateState',
            payload: {
              list: []
            }
          })
          dispatch({
            type: 'query'
          })
        }
      })
    }
  },

  effects: {
    * query ({ payload = {} }, { call, put }) {
      const data = yield call(query, {
        ...payload
      })
      if (data) {
        yield put({
          type: 'querySuccess',
          payload: {
            list: data.data,
            pagination: {
              current: Number(payload.page) || 1,
              pageSize: Number(payload.pageSize) || 10,
              total: data.total
            }
          }
        })
      }
    },

    * queryById ({ payload = {} }, { call, put }) {
      const response = yield call(queryById, payload.id)
      if (response && response.success) {
        yield put({
          type: 'updateState',
          payload: {
            currentItem: response.data,
            relationship: 1
          }
        })
        yield put({
          type: 'query',
          payload: {
            balanceId: payload.id,
            type: 'all',
            relationship: 1
          }
        })
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
    }
  }
})
