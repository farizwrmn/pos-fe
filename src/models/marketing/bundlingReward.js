import modelExtend from 'dva-model-extend'
import { query } from '../../services/marketing/bundlingReward'
import { pageModel } from './../common'

export default modelExtend(pageModel, {
  namespace: 'bundlingReward',

  state: {
    currentItem: {},
    modalType: 'add',
    activeKey: '0',
    searchText: null,
    typeModal: null,
    listReward: [],
    modalPromoVisible: false,
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      current: 1
    }
  },

  subscriptions: {
    // setup ({ dispatch, history }) {
    //   history.listen((location) => {
    //     const { pathname } = location
    //     if (pathname === '/transaction/pos') {
    //       dispatch({ type: 'query', payload: { storeId: lstorage.getCurrentUserStore() } })
    //     }
    //   })
    // }
  },

  effects: {
    * query ({ payload = {} }, { call, put }) {
      const data = yield call(query, payload)
      if (data.success) {
        yield put({
          type: 'querySuccessReward',
          payload: {
            listReward: data.data,
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
    }
  },

  reducers: {
    querySuccessReward (state, action) {
      const { listReward, pagination } = action.payload
      return {
        ...state,
        listReward,
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
