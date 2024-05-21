import modelExtend from 'dva-model-extend'
import moment from 'moment'
import { lstorage } from 'utils'
import { queryActive, queryHighlight } from '../../services/marketing/promo'
import { query as queryReward } from '../../services/marketing/bundlingReward'
import { pageModel } from './../common'
import { getDateTime } from '../../services/setting/time'

export default modelExtend(pageModel, {
  namespace: 'promo',

  state: {
    currentItem: {},
    modalType: 'add',
    activeKey: '0',
    searchText: null,
    typeModal: null,
    list: [],
    listHighlight: [],
    listMinimumPayment: [],
    modalPromoVisible: false,
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
        if (pathname === '/transaction/pos') {
          dispatch({ type: 'queryMinimumPayment', payload: { storeId: lstorage.getCurrentUserStore() } })
          dispatch({
            type: 'promo/queryHighlight',
            payload: {
              storeId: lstorage.getCurrentUserStore()
            }
          })
        }
      })
    }
  },

  effects: {
    * queryHighlight ({ payload = {} }, { call, put }) {
      const date = yield call(getDateTime, {
        id: 'date'
      })
      if (!date.success) {
        throw date
      }
      payload.day = moment(date.data, 'YYYY-MM-DD').isoWeekday()
      const response = yield call(queryHighlight, payload)
      if (response.success) {
        yield put({
          type: 'updateState',
          payload: {
            listHighlight: response.data
          }
        })
      } else {
        throw response
      }
    },
    * query ({ payload = {} }, { call, put }) {
      const date = yield call(getDateTime, {
        id: 'date'
      })
      if (!date.success) {
        throw date
      }
      payload.day = moment(date.data, 'YYYY-MM-DD').isoWeekday()
      const data = yield call(queryActive, payload)
      if (data.success) {
        yield put({
          type: 'querySuccessCounter',
          payload: {
            list: data.data,
            pagination: {
              current: Number(payload.page) || 1,
              pageSize: Number(payload.pageSize) || 10,
              total: data.total
            }
          }
        })
      } else {
        throw data
      }
    },
    * queryMinimumPayment ({ payload = {} }, { call, put }) {
      const date = yield call(getDateTime, {
        id: 'date'
      })
      if (!date.success) {
        throw date
      }
      payload.day = moment(date.data, 'YYYY-MM-DD').isoWeekday()
      payload.type = 'all'
      payload.minimumPayment = '1'
      const data = yield call(queryActive, payload)
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            listMinimumPayment: data.data
          }
        })
      } else {
        throw data
      }
    },
    * queryReward ({ payload = {} }, { call, put }) {
      const data = yield call(queryReward, payload)
      if (!data.success) {
        throw data
      }
      yield put({
        type: 'querySuccessCounter',
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

  reducers: {
    querySuccessCounter (state, action) {
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
    },

    changeTab (state, { payload }) {
      const { key } = payload
      return {
        ...state,
        activeKey: key,
        modalType: 'add',
        currentItem: {}
      }
    }
  }
})
