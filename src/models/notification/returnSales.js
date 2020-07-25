import modelExtend from 'dva-model-extend'
import { message } from 'antd'
import moment from 'moment'
import { approve } from 'services/notification/returnSales'
import { query } from 'services/return/returnSales'
import { pageModel } from '../common'

const success = () => {
  message.success('Sales discount has been saved')
}

export default modelExtend(pageModel, {
  namespace: 'returnSales',

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
        if (pathname === '/return-request') {
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
      const data = yield call(query, payload)
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
