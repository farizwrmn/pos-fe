import modelExtend from 'dva-model-extend'
import { save, getUserStore } from '../../services/setting/userStore'
import { pageModel } from '../common'

export default modelExtend(pageModel, {
  namespace: 'userStore',

  state: {
    list: [],
    listUserStore: [],
    listUserStoreTarget: [],
    listUserStoreChange: { in: [], out: [] },
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname === '/setting/user') {
          dispatch({
            type: 'query',
            payload: location.query,
          })
        }
      })
    },
  },

  effects: {

    *query ({ payload = {} }, { call, put }) {
      const userStore = yield call(getUserStore, { as: 'key,title', userId: payload.userId })
      if (userStore.success) {
        yield put({
          type: 'querySuccessStore',
          payload: {
            listUserStore: userStore.data.map(a=>a.key),
            pagination: {
              total: userStore.data.length,
            },
          },
        })
      } else {
        console.log('error')
      }
    },

    *save ({ payload }, { call, put }) {
      const data = yield call(save, payload)
      if (data.success) {
        yield put({ type: 'modalHide' })
        yield put({ type: 'query' })
        yield put({ type: 'user/modalHide'})
      } else {
        throw data
      }
    },

  },

  reducers: {

    querySuccess (state, action) {
      const { list, pagination } = action.payload
      return { ...state,
        list,
        pagination: {
          ...state.pagination,
          ...pagination,
        } }
    },
    querySuccessStore (state, action) {
      const { listUserStore } = action.payload
      return { ...state,
        listUserStore,
        listUserStoreTarget: listUserStore
      }
    },
    updateState (state, { payload }) {
      console.log('updateState',payload)
      return {
        ...state,
        ...payload,
      }
    },
  },
})
