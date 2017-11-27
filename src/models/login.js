import { login, prelogin, getUserRole, verifyTOTP } from '../services/login'
import { routerRedux } from 'dva/router'
import { queryURL, config, crypt } from 'utils'

const { prefix } = config

export default {
  namespace: 'login',
  state: {
    loginLoading: false,
    listUserRole: [],
    requiredRole: false,
    visibleItem: { verificationCode: false}
  },

  effects: {
    *login ({
      payload,
    }, { put, call }) {
      yield put({ type: 'showLoginLoading' })
      const data = yield call(login, payload)
      yield put({ type: 'hideLoginLoading' })
      if (data.success) {
        const from = queryURL('from')
        if ( data.id_token ) {
          localStorage.setItem(`${prefix}idToken`, data.id_token)
          const rdmText = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 8)
          const rdmTextcryp = crypt.encrypt(rdmText)
          const truecrypt = crypt.encrypt(data.profile.userid, rdmTextcryp)
          localStorage.setItem(`${prefix}uid`, rdmText + '#' + truecrypt + '#' + data.profile.role)
        } else {
          localStorage.removeItem(`${prefix}idToken`)
          localStorage.removeItem(`${prefix}uid`)
        }
        yield put({ type: 'app/query', payload: data.profile })
        if (from) {
          yield put(routerRedux.push(from))
        } else {
          yield put(routerRedux.push('/dashboard'))
        }
      } else {
        throw data
      }
    },
    *totp ({ payload}, { put, call }) {
      if (payload.verification) {
        const data = yield call(verifyTOTP, payload)
        if (data.success) {
          yield put({ type: 'getRole', payload })
        } else {
          yield put({
            type: 'queryStateTotp',
            payload: {
              visibleItem: { verificationCode: false},
            },
          })
        }
      } else {
        const data = yield call(prelogin, payload)
        if (data.success && data.pre_token) {
          localStorage.setItem(`${prefix}idToken`, data.pre_token)
          yield put({
            type: 'queryStateTotp',
            payload: {
              visibleItem: { verificationCode: data.profile.istotp},
            },
          })

          if (!data.profile.istotp) {
            yield put({ type: 'getRole', payload })
          }
        } else {
          yield put({
            type: 'queryStateTotp',
            payload: {
              visibleItem: { verificationCode: false},
            },
          })
          throw data
        }
      }

    },
    *getRole ({ payload }, { put, call }) {
      const userRole = yield call(getUserRole, { as: 'value,label', userId: payload.userid })
      const dataLov = userRole ? userRole.data : []
      yield put({
        type: 'queryStateRole',
        payload: {
          listUserRole: dataLov,
          pagination: userRole ? { total: userRole.data.length } : {},
        },
      })      
    },
  },
  reducers: {
    showLoginLoading (state) {
      return {
        ...state,
        loginLoading: true,
      }
    },
    hideLoginLoading (state) {
      return {
        ...state,
        loginLoading: false,
      }
    },
    queryStateRole (state, action) {
      const { listUserRole, pagination } = action.payload
      return { ...state,
        listUserRole,
        pagination: {
          ...state.pagination,
          ...pagination,
        } }
    },
    queryStateTotp (state, action) {
      const { visibleItem } = action.payload
      return { ...state,
        visibleItem,
      }
    },
  },
}
