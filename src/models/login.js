import { login } from '../services/login'
import { routerRedux } from 'dva/router'
import { queryURL, config, crypt } from 'utils'

const { prefix } = config

export default {
  namespace: 'login',
  state: {
    loginLoading: false,
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
          localStorage.setItem(`${prefix}uid`, rdmText + '#' + truecrypt)
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
  },
}
