import { routerRedux } from 'dva/router'
import { queryURL, config, crypt, lstorage } from 'utils'
import { login, prelogin, getUserRole, getUserStore, verifyTOTP } from '../services/login'

const { prefix } = config

export default {
  namespace: 'login',
  state: {
    loginLoading: false,
    listUserRole: [],
    listUserStore: [],
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
          localStorage.setItem(`${prefix}iKen`, data.id_token)
          console.log('logtime',data.profile.userlogintime)
          lstorage.putStorageKey('udi',[data.profile.userid, data.profile.role, data.profile.store, data.profile.usercompany, data.profile.userlogintime])
        } else {
          localStorage.removeItem(`${prefix}iKen`)
          localStorage.removeItem(`${prefix}udi`)
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
          if (data.profile.role) {
            const from = queryURL('from')
            localStorage.setItem(`${prefix}iKen`, data.id_token)
            console.log('logtime',data.profile.userlogintime)
            lstorage.putStorageKey('udi',[data.profile.userid, data.profile.role, data.profile.store, data.profile.usercompany, data.profile.userlogintime])
            yield put({ type: 'app/query', payload: data.profile })
            if (from) {
              yield put(routerRedux.push(from))
            } else {
              yield put(routerRedux.push('/dashboard'))
            }
          } else {
            yield put({
              type: 'queryStateTotp',
              payload: {
                visibleItem: { userRole: true},
              },
            })
            yield put({ type: 'getRole', payload: {userId: data.profile.userid} })
            yield put({ type: 'getStore', payload: {userId: data.profile.userid} })
          }

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
          localStorage.setItem(`${prefix}iKen`, data.pre_token)
          yield put({
            type: 'queryStateTotp',
            payload: {
              visibleItem: {
                userRole: data.profile.role ? false : data.profile.istotp ? false : true,
                verificationCode: data.profile.istotp,
              },
            },
          })

          if (!data.profile.istotp) {
            yield put({ type: 'getRole', payload: {userId: data.profile.userid} })
            yield put({ type: 'getStore', payload: {userId: data.profile.userid} })
          }
        } else if (data.success && data.id_token) {
          const from = queryURL('from')
          localStorage.setItem(`${prefix}iKen`, data.id_token)
          yield put({ type: 'getRole', payload: {userId: data.profile.userid} })
          yield put({ type: 'getStore', payload: {userId: data.profile.userid} })
          console.log('logtime',data.profile.userlogintime)
          lstorage.putStorageKey('udi',[data.profile.userid, data.profile.role, data.profile.store, data.profile.usercompany, data.profile.userlogintime])
          yield put({ type: 'app/query', payload: data.profile })
          if (from) {
            yield put(routerRedux.push(from))
          } else {
            yield put(routerRedux.push('/dashboard'))
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
