import { routerRedux } from 'dva/router'
import moment from 'moment'
import { configMain, configCompany, queryURL, lstorage, messageInfo } from 'utils'
import { login, getUserRole, getUserStore } from '../services/login'

const { prefix } = configMain
const { apiCompanyProtocol, apiCompanyHost, apiCompanyPort } = configCompany.rest


export default {
  namespace: 'login',
  state: {
    loginLoading: false,
    listUserRole: [],
    listUserStore: [],
    supervisorUser: {},
    requiredRole: false,
    modalFingerprintVisible: false,
    visibleItem: { verificationCode: false },
    logo: '/logo.png'
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        const { pathname } = location
        if (pathname === '/login') {
          dispatch({ type: 'login/getCompany', payload: { cid: 'MBI' } })
        }
      })
    }
  },

  effects: {
    * getCompany ({ payload }, { put }) {
      // const userCompany = yield call(getUserCompany, payload)
      // use below if network error
      const userCompany = { success: true, message: 'Ok', data: { domainName: apiCompanyHost, domainPort: apiCompanyPort, domainProtocol: apiCompanyProtocol } }
      if (userCompany.success) {
        yield put({ type: 'getCompanySuccess', payload: { cid: payload.cid || configCompany.idCompany, data: Object.values(userCompany.data) } })
      } else {
        yield put({ type: 'getCompanyFailure' })
      }
    },

    * verify ({ payload }, { put, call }) {
      const data = yield call(login, payload)
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            supervisorUser: data.profile
          }
        })
        return data
      }
      throw data
    },

    * login ({ payload }, { put, call }) {
      yield put({ type: 'showLoginLoading' })
      const data = yield call(login, payload)
      yield put({ type: 'hideLoginLoading' })
      if (data.success) {
        if (data.profile.role) {
          yield put({ type: 'loginSuccess', payload: { data } })
        } else {
          throw data
        }
      } else if (data.hasOwnProperty('profile')) {
        if (data.profile.istotp) {
          if (payload.verification) {
            if (data.profile.verified) {
              yield put({
                type: 'queryStateTotp',
                payload: { visibleItem: { verificationCode: true, userRole: true } }
              })
              if (data.tempken) {
                localStorage.setItem(`${prefix}iKen`, data.tempken)
                yield put({ type: 'getRole', payload: { userId: data.profile.userid } })
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
              payload: { visibleItem: { verificationCode: true } }
            })
            throw data
          }
        } else {
          yield put({
            type: 'queryStateTotp',
            payload: { visibleItem: { userRole: true } }
          })
          if (data.tempken) {
            localStorage.setItem(`${prefix}iKen`, data.tempken)
            yield put({ type: 'getRole', payload: { userId: data.profile.userid } })
            throw data
          } else {
            throw data
          }
        }
      } else {
        throw data
      }
    },
    * getRole ({ payload }, { put, call }) {
      const userRole = yield call(getUserRole, { as: 'value,label', userId: payload.userId })
      if (userRole) {
        lstorage.putStorageKey('uelor', [JSON.stringify(userRole.data.mapped)])
      }
      const roleLov = userRole ? userRole.data.mapped : []
      yield put({
        type: 'queryStateRole',
        payload: {
          listUserRole: roleLov
        }
      })
    },
    * getStore ({ payload }, { put, call }) {
      const userStore = yield call(getUserStore, { userId: payload.userId, mode: 'lov' })
      if (userStore) {
        lstorage.putStorageKey('utores', [JSON.stringify(userStore.data)])
      }
      const storeLov = userStore ? userStore.data : []
      yield put({
        type: 'queryStateStore',
        payload: {
          listUserStore: storeLov
        }
      })
    },
    * loginSuccess ({ payload }, { put }) {
      const { data } = payload
      const from = queryURL('from')
      localStorage.setItem('sidebarColor', '#55a756')
      localStorage.setItem(`${prefix}iKen`, data.id_token)
      yield put({ type: 'getRole', payload: { userId: data.profile.userid } })
      yield put({ type: 'getStore', payload: { userId: data.profile.userid } })
      const dataUdi = [
        data.profile.userid,
        data.profile.role,
        data.profile.store,
        data.profile.usercompany,
        data.profile.userlogintime,
        data.profile.sessionid,
        data.profile.consignmentId ? data.profile.consignmentId.toString() : null
      ]
      lstorage.putStorageKey('udi', dataUdi)
      yield put({ type: 'app/query', payload: data.profile })
      if (from) {
        yield put(routerRedux.push(from))
      } else {
        yield put(routerRedux.push('/dashboard'))
      }
      messageInfo(data.profile.sessionid)
      messageInfo(`${data.message} at ${moment(data.profile.userlogintime).format('DD-MMM-YYYY HH:mm:ss')} from ${data.profile.useripaddr1}`, 'success')
    }
  },
  reducers: {
    updateState (state, { payload }) {
      return { ...state, ...payload }
    },
    getCompanySuccess (state, action) {
      let cdi = [action.payload.cid]
      cdi.push(...action.payload.data)
      lstorage.removeItemKeys() // remove items in local storage
      lstorage.putStorageKey('cdi', cdi)
      return {
        ...state,
        logo: `logo${action.payload.cid}.png`
      }
    },
    getCompanyFailure (state) {
      lstorage.removeItemKey('cdi')
      return {
        ...state,
        logo: 'logo.png'
      }
    },
    showLoginLoading (state) {
      return {
        ...state,
        loginLoading: true
      }
    },
    hideLoginLoading (state) {
      return {
        ...state,
        loginLoading: false
      }
    },
    queryStateRole (state, action) {
      const { listUserRole } = action.payload
      return {
        ...state,
        listUserRole
      }
    },
    queryStateStore (state, action) {
      const { listUserStore } = action.payload
      return {
        ...state,
        listUserStore
      }
    },
    queryStateTotp (state, action) {
      const { visibleItem } = action.payload
      return {
        ...state,
        visibleItem
      }
    }
  }
}
