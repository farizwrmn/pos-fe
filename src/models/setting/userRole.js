import modelExtend from 'dva-model-extend'
import { save } from '../../services/setting/userRoles'
import { getUserRole } from '../../services/login'
import { pageModel } from '../common'

export default modelExtend(pageModel, {
  namespace: 'userRole',

  state: {
    list: [],
    listUserRole: [],
    listUserRoleTarget: [],
    listUserRoleChange: { in: [], out: [] },
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
      const userRole = yield call(getUserRole, { as: 'key,title', userId: payload.userId })
      if (userRole.success) {
        yield put({
          type: 'querySuccessRole',
          payload: {
            listUserRole: userRole.data.map(a=>a.key),
            pagination: {
              total: userRole.data.length,
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
    querySuccessRole (state, action) {
      const { listUserRole } = action.payload
      return { ...state,
        listUserRole,
        listUserRoleTarget: listUserRole
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
