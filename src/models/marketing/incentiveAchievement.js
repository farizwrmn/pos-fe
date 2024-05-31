import modelExtend from 'dva-model-extend'
import { lstorage } from 'utils'
import { query } from 'services/marketing/incentiveAchievement'
import { pageModel } from 'models/common'

export default modelExtend(pageModel, {
  namespace: 'incentiveAchievement',

  state: {
    currentItem: {},
    modalType: 'add',
    activeKey: '0',
    modalMemberTierVisible: false,
    modalMemberTierItem: {},
    modalMemberTierType: 'add',
    list: [],
    pagination: {
      current: 1
    }
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        const { pathname } = location
        if (pathname === '/transaction/pos') {
          dispatch({
            type: 'query'
          })
        }
      })
    }
  },

  effects: {
    * query ({ payload = {} }, { call, put }) {
      payload.storeId = lstorage.getCurrentUserStore()
      const response = yield call(query, payload)
      if (response.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            list: response.data,
            pagination: {
              current: Number(response.page) || 1,
              pageSize: Number(response.pageSize) || 10,
              total: response.total
            }
          }
        })
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
