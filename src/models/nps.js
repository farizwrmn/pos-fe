import { Modal, message } from 'antd'
import { configMain, configCompany, lstorage, messageInfo } from 'utils'
import { getNPS, postNPS, getTempToken } from '../services/nps'
import { queryByCode } from '../services/master/customer'
import { getUserCompany } from '../services/login'

const { apiCompanyHost, apiCompanyPort } = configCompany.rest
const { prefix } = configMain

export default {
  namespace: 'nps',
  state: {
    npsData: {}
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname.slice(0,-3) === '/nps') {
          dispatch({ type: 'getCompany', payload: { cid:location.pathname.slice(-2) } })
        }
      })
    }
  },

  effects: {
    * getCompany ({ payload }, { put, call }) {
      const userCompany = yield call(getUserCompany, payload)
      // const userCompany = { success: true, message: 'Ok', data: { domainName: apiCompanyHost, domainPort: apiCompanyPort } }
      if (userCompany.success) {
        yield put({ type: 'getCompanySuccess', payload: { cid: configCompany.idCompany, data: Object.values(userCompany.data) } })
      } else {
        yield put({ type: 'getCompanyFailure' })
      }
    },

    * getMember ({ payload = {} }, { call, put }) {
      const data = yield call(getTempToken, payload)
      const token = data.id_token
      if (token) {
        localStorage.setItem(`${prefix}iKen`, token)
        const data = yield call(queryByCode, { memberCode: payload.memberId })
        if (data.success && data.data) {
          yield put({
            type: 'updateState',
            payload: {
              npsData: { member: data.data }
            }
          })
        } else {
          yield put({
            type: 'updateState',
            payload: {
              npsData: {}
            }
          })
          message.warning('Member is not available')
        }
      }
    },

    * getNPS ({ payload = {} }, { call, put }) {
      const data = yield call(getNPS, payload)
      if (data.success) {

      }
    },

    * postNPS ({ payload = {} }, { call, put }) {
      const data = yield call(postNPS, { id: payload.id, data: payload.data })
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            npsData: {}
          }
        })
        const modal = Modal.success({
          title: 'Thank you for your feedback',
          content: (
            <div>
              <p>{data.message}</p>
            </div>
          )
        })
        setTimeout(() => modal.destroy(), 5000)
      } else {
        throw data
      }
    }
  },
  reducers: {
    updateState (state, { payload }) {
      return {
        ...state,
        ...payload
      }
    },

    getCompanySuccess (state, { payload }) {
      let cdi = payload.data
      cdi.push(payload.cid)
      lstorage.putStorageKey('cdi', cdi)
      return {
        ...state, ...payload
      }
    },

    getCompanyFailure (state) {
      lstorage.removeItemKey('cdi')
      return {
        ...state
      }
    }
  }
}
