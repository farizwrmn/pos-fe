import { Modal, message } from 'antd'
import { prefix } from 'utils/config.main'
import { configCompany, lstorage } from 'utils'
import { getNPS, postNPS, getTempToken } from '../services/nps'
import { queryByCode, querySearchByPlat } from '../services/master/customer'
// import { getUserCompany } from '../services/login'

const { apiCompanyHost, apiCompanyPort } = configCompany.rest

export default {
  namespace: 'nps',
  state: {
    npsData: {},
    searchBy: { value: 'id', label: 'Member ID' },
    membersOfPlat: []
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname.slice(0, -3) === '/nps') {
          dispatch({ type: 'getCompany', payload: { cid: location.pathname.slice(-2) } })
        }
      })
    }
  },

  effects: {
    * getCompany (payload, { put }) {
      // const userCompany = yield call(getUserCompany, payload)
      const userCompany = { success: true, message: 'Ok', data: { domainName: apiCompanyHost, domainPort: apiCompanyPort, companyName: configCompany.companyName } }
      if (userCompany.success) {
        yield put({ type: 'updateState', payload: { npsData: { cname: userCompany.data.companyName || configCompany.companyName } } })
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
        let data
        if (payload.searchBy.value === 'id') {
          data = yield call(queryByCode, { memberCode: payload.memberId })
          if (data.success && data.data) {
            yield put({
              type: 'successGetData',
              payload: {
                npsData: { member: data.data }
              }
            })
          } else {
            message.warning('Member is not available')
          }
        } else if (payload.searchBy.value === 'pn') {
          data = yield call(querySearchByPlat, { license: payload.memberId })
          if (data.success && data.data.length) {
            yield put({
              type: 'successGetData',
              payload: {
                npsData: { member: data.data[0] }
              }
            })
            yield put({
              type: 'updateState',
              payload: {
                membersOfPlat: data.data
              }
            })
          } else {
            yield put({
              type: 'updateState',
              payload: {
                membersOfPlat: []
              }
            })
            message.warning('Member is not available')
          }
        }
      }
    },

    * getNPS ({ payload = {} }, { call }) {
      const data = yield call(getNPS, payload)
      if (data.success) {
        console.log('do nothing')
      }
    },

    * postNPS ({ payload = {} }, { call, put }) {
      const data = yield call(postNPS, { id: payload.id, data: payload.data })
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            membersOfPlat: {},
            searchBy: { value: 'id', label: 'Member ID' }
          }
        })
        yield put({
          type: 'successPost'
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
        yield put({
          type: 'updateState',
          payload: {
            membersOfPlat: {},
            searchBy: { value: 'id', label: 'Member ID' }
          }
        })
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
    successPost (state) {
      const data = {
        cname: state.npsData.cname
      }
      return {
        ...state,
        npsData: data
      }
    },
    successGetData (state, { payload }) {
      const { npsData } = payload
      const data = {
        ...state.npsData,
        ...npsData
      }
      return {
        ...state,
        npsData: data
      }
    },

    getCompanySuccess (state, { payload }) {
      let cdi = [payload.cid]
      cdi.push(...payload.data)
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
