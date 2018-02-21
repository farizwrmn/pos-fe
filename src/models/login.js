import { routerRedux } from 'dva/router'
import { queryURL, config, crypt, lstorage, messageInfo } from 'utils'
import { login, prelogin, getUserRole, getUserStore, verifyTOTP } from '../services/login'
import moment from 'moment'

const { prefix } = config

export default {
  namespace: 'login',
  state: {
    loginLoading: false,
    listUserRole: [],
    listUserStore: [],
    requiredRole: false,
    visibleItem: { verificationCode: false},
    ipAddress: ''
  },

  effects: {
    *login ({ payload}, { put, call }) {
      yield put({ type: 'showLoginLoading' })
      const data = yield call(login, payload)
      yield put({ type: 'hideLoginLoading' })
      if (data.success) {
        if (data.profile.role) {
          yield put({ type: 'loginSuccess', payload: {data} })
        } else {
          throw data
        }
      } else {
        if (data.hasOwnProperty('profile')) {
          if (data.profile.istotp) {
            if (payload.verification) {
              if (data.profile.verified) {
                yield put({
                  type: 'queryStateTotp',
                  payload: { visibleItem: { verificationCode: true, userRole: true } },
                })
                if (data.tempken) {
                  localStorage.setItem(`${prefix}iKen`, data.tempken)
                  yield put({ type: 'getRole', payload: {userId: data.profile.userid} })
                  throw data
                } else {
                  throw data
                }
              } else {
                throw data
              }
            } else {
              yield put({
                type: 'queryStateTotp',
                payload: { visibleItem: { verificationCode: true } },
              })
              throw data
            }
          } else {
            yield put({
              type: 'queryStateTotp',
              payload: { visibleItem: { userRole: true } },
            })
            if (data.tempken) {
              localStorage.setItem(`${prefix}iKen`, data.tempken)
              yield put({ type: 'getRole', payload: {userId: data.profile.userid} })
              throw data
            } else {
              throw data
            }
          }
        } else {
          throw data
        }
      }
    },
    *getRole ({ payload }, { put, call }) {
      const userRole = yield call(getUserRole, { as: 'value,label', userId: payload.userId })
      if (userRole) {
        lstorage.putStorageKey('uelor', [JSON.stringify(userRole.data.mapped)])
      }
      const roleLov = userRole ? userRole.data.mapped : []
      yield put({
        type: 'queryStateRole',
        payload: {
          listUserRole: roleLov,
        },
      })
    },
    *getStore ({ payload }, { put, call }) {
      const userStore = yield call(getUserStore, { userId: payload.userId, mode: 'lov' })
      if (userStore) {
        lstorage.putStorageKey('utores', [JSON.stringify(userStore.data)])
      }
      const storeLov = userStore ? userStore.data : []
      yield put({
        type: 'queryStateStore',
        payload: {
          listUserStore: storeLov,
        },
      })
    },
    *loginSuccess ({ payload }, { put, }) {
      const { data } = payload
      const from = queryURL('from')
      localStorage.setItem(`${prefix}iKen`, data.id_token)
      yield put({ type: 'getRole', payload: {userId: data.profile.userid} })
      yield put({ type: 'getStore', payload: {userId: data.profile.userid} })
      lstorage.putStorageKey('udi',[data.profile.userid, data.profile.role, data.profile.store, data.profile.usercompany, data.profile.userlogintime, data.profile.sessionid])
      yield put({ type: 'app/query', payload: data.profile })
      if (from) {
        yield put(routerRedux.push(from))
      } else {
        yield put(routerRedux.push('/dashboard'))
      }
      messageInfo(data.profile.sessionid)
      messageInfo(data.message + ' at ' + moment(data.profile.userlogintime).format('DD-MMM-YYYY hh:mm:ss') + ' from ' + data.profile.useripaddr1, 'success')
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
      const { listUserRole } = action.payload
      return { ...state,
        listUserRole,
      }
    },
    queryStateStore (state, action) {
      const { listUserStore } = action.payload
      return { ...state,
        listUserStore,
      }
    },
    queryStateTotp (state, action) {
      const { visibleItem } = action.payload
      return { ...state,
        visibleItem,
      }
    },
  },
}
