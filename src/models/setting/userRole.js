import modelExtend from 'dva-model-extend'
import { save, saveUserDefaultRole } from '../../services/setting/userRoles'
import { getUserRole } from '../../services/login'
import { pageModel } from '../common'
import { message } from 'antd'

const successInfo = (info) => {
  message.success(info)
}

export default modelExtend(pageModel, {
  namespace: 'userRole',

  state: {
    roleItem: {},
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
      if (payload.userId) {
        const userRole = yield call(getUserRole, { as: 'key,title', userId: payload.userId })
        if (userRole.success) {
          console.log('a1', userRole.data.defaultRole)
          yield put({
            type: 'querySuccessRole',
            payload: {
              listUserRole: userRole.data.mapped.map(a=>a.key),
              defaultRole : userRole.data.defaultRole
            },
          })
        } else {
          console.log('error')
        }
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
    *saveDefaultRole ({ payload }, { select, call, put }) {
      // const customer = yield select(({ customer }) => customer.currentItem.memberCode)
      // const newUser = { ...payload, customer }
      const data = yield call(saveUserDefaultRole, payload)
      if (data.success) {
        successInfo(data.message)
        yield put({
          type: 'updateState',
          payload: { roleItem: { default : data.defaultRole } },
        })
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
      const { listUserRole, defaultRole } = action.payload
      return { ...state,
        listUserRole,
        listUserRoleTarget: listUserRole,
        roleItem: { default : defaultRole }
      }
    },
    updateState (state, { payload }) {
      const { roleItem } = payload
      return {
        ...state,
        ...payload,
        roleItem
      }
    },
    successUserRole (state, action) {
      return { ...state,
        listUserStores: action.payload.listUserStores.split(','),
        roleItem: { default : action.payload.defaultRole }
      }
    },
  },
})
