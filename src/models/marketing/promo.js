import modelExtend from 'dva-model-extend'
import { lstorage } from 'utils'
import { queryActive } from '../../services/marketing/promo'
import { pageModel } from './../common'

export default modelExtend(pageModel, {
  namespace: 'promo',

  state: {
    currentItem: {},
    modalType: 'add',
    activeKey: '0',
    searchText: null,
    typeModal: null,
    list: [],
    modalPromoVibible: false,
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
          dispatch({ type: 'query', payload: { storeId: lstorage.getCurrentUserStore() } })
        }
      })
    }
  },

  effects: {

    * query ({ payload = {} }, { call, put }) {
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
