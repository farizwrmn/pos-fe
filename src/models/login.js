import moment from 'moment'
import { routerRedux } from 'dva/router'
import { configCompany, queryURL, lstorage, messageInfo } from 'utils'
import { APPNAME } from 'utils/config.company'
import { prefix } from 'utils/config.main'
import { queryTimeLimit as queryInvoiceTimeLimit } from 'services/master/invoice'
import { queryCustomerViewTimeLimit as queryCustomerViewTransactionTimeLimit, queryTimeLimit as queryQrisPaymentTimeLimit } from 'services/payment/paymentTransactionService'
import { login, getUserRole, getUserStore } from '../services/login'

const {
  setInvoiceTimeLimit,
  setCustomerViewLastTransactionTimeLimit,
  setQrisPaymentTimeLimit
} = lstorage
const { apiCompanyProtocol, apiCompanyHost, apiCompanyHostAlt, apiCompanyPort } = configCompany.rest


export default {
  namespace: 'login',
  state: {
    loginLoading: false,
    listUserRole: [],
    listUserStore: [],
    supervisorUser: {},
    modalLoginData: {},
    requiredRole: false,
    modalFingerprintVisible: false,
    visibleItem: { verificationCode: false },
    logo: `/logo-${APPNAME}.png`
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
      const userCompany = { success: true, message: 'Ok', data: { domainName: apiCompanyHost, domainPort: apiCompanyPort, domainProtocol: apiCompanyProtocol, altDomainName: apiCompanyHostAlt } }
      if (userCompany.success) {
        yield put({ type: 'getCompanySuccess', payload: { cid: payload.cid || configCompany.idCompany, data: Object.values(userCompany.data) } })
      } else {
        yield put({ type: 'getCompanyFailure' })
      }
    },

    * verify ({ payload }, { put, call }) {
      const data = yield call(login, payload)
      if (data.success
        && data.profile) {
        yield put({
          type: 'successVerify',
          payload: {
            data
          }
        })
      } else {
        throw data
      }
    },

    * successVerify ({ payload }, { put, select }) {
      const modalLoginType = yield select(({ pos }) => pos.modalLoginType)
      const modalLoginData = yield select(({ login }) => login.modalLoginData)
      const setting = yield select(({ app }) => app.setting)
      const { data } = payload
      if (data.profile.role === 'OWN'
        || data.profile.role === 'ITS'
        || data.profile.role === 'SPR'
        || data.profile.role === 'HFC'
        || data.profile.role === 'SFC'
        || data.profile.role === 'PCS'
        || data.profile.role === 'HPC'
        || data.profile.role === 'HKS'
        || data.profile.role === 'SPC') {
        yield put({
          type: 'updateState',
          payload: {
            supervisorUser: data.profile
          }
        })

        console.log('modalLoginType', modalLoginType)
        if (modalLoginType === 'payment') {
          console.log('payment', modalLoginData)
          yield put({ type: 'pos/paymentDelete', payload: modalLoginData })
        }
        if (modalLoginType === 'service') {
          console.log('service', modalLoginData)
          yield put({ type: 'pos/serviceDelete', payload: modalLoginData })
        }
        if (modalLoginType === 'consignment') {
          console.log('consignment', modalLoginData)
          yield put({ type: 'pos/consignmentDelete', payload: modalLoginData })
        }
        if (modalLoginType === 'bundle') {
          console.log('bundle', modalLoginData)
          yield put({ type: 'pos/bundleDelete', payload: modalLoginData })
        }
        if (modalLoginType === 'cancelHistory') {
          yield put({ type: 'pos/cancelInvoice', payload: modalLoginData })
        }
        if (modalLoginType === 'resetPaymentPaylabsQRIS') {
          const qrisPaymentCurrentTransNo = yield select(({ pos }) => pos.qrisPaymentCurrentTransNo)
          yield put({
            type: 'payment/cancelDynamicQrisPayment',
            payload: {
              paymentTransactionId: modalLoginData.transNo,
              pos: {
                transNo: qrisPaymentCurrentTransNo,
                memo: 'Canceled Dynamic Qris Payment - Canceled By Cashier'
              }
            }
          })
        }
        if (modalLoginType === 'resetAllPosInput') {
          yield put({
            type: 'pos/removeTrans'
          })
          yield put({ type: 'pos/setDefaultMember' })
          yield put({ type: 'pos/setDefaultEmployee' })

          yield put({ type: 'pos/setDefaultPaymentShortcut' })
        }
        if (modalLoginType === 'editPayment') {
          if (modalLoginData && modalLoginData.typeCode === 'P') {
            yield put({
              type: 'pos/checkQuantityEditProduct',
              payload: {
                data: modalLoginData,
                setting
              }
            })
          }
          if (modalLoginData && modalLoginData.typeCode === 'S') {
            yield put({ type: 'pos/serviceEdit', payload: modalLoginData })
            yield put({ type: 'pos/hideServiceListModal' })
          }
        } else {
          yield put({ type: 'updateState', payload: { modalLoginData: {} } })
        }
        yield put({ type: 'updateState', payload: { modalFingerprintVisible: false } })
        yield put({ type: 'pos/updateState', payload: { modalLoginType: null, modalLoginVisible: false } })
      } else {
        throw new Error('Cashier cannot delete')
      }
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
      console.log('userRole', userRole)
      if (userRole && userRole.data && userRole.data.length > 0) {
        lstorage.putStorageKey('uelor', [JSON.stringify(userRole.data.mapped)])
      }
      const roleLov = userRole && userRole.data ? userRole.data.mapped : []
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
      yield put({ type: 'invoiceTimeLimit' })
      yield put({ type: 'qrisPaymentTimeLimit' })
      yield put({ type: 'customerViewTransactionTimeLimit' })
      const dataUdi = [
        data.profile.userid,
        data.profile.role,
        data.profile.store,
        data.profile.usercompany,
        data.profile.userlogintime,
        data.profile.sessionid,
        data.profile.consignmentId ? data.profile.consignmentId.toString() : null,
        `${data.profile.id}`
      ]
      lstorage.putStorageKey('udi', dataUdi)
      yield put({ type: 'app/query', payload: data.profile })
      if (data.profile.role && (data.profile.role === 'CSH' || data.profile.role === 'HKS')) {
        yield put(routerRedux.push('/transaction/pos'))
      } else if (from) {
        yield put(routerRedux.push(from))
      } else {
        yield put(routerRedux.push('/dashboard'))
      }
      messageInfo(data.profile.sessionid)
      messageInfo(`${data.message} at ${moment(data.profile.userlogintime).format('DD-MMM-YYYY HH:mm:ss')} from ${data.profile.useripaddr1}`, 'success')
    },
    * invoiceTimeLimit ({ payload = {} }, { call }) {
      const response = yield call(queryInvoiceTimeLimit, payload)
      if (response && response.success && response.data) {
        const invoiceTimeLimit = response.data.paramValue || 15
        setInvoiceTimeLimit(invoiceTimeLimit)
      } else {
        setInvoiceTimeLimit(15)
      }
    },
    * qrisPaymentTimeLimit ({ payload = {} }, { call }) {
      const response = yield call(queryQrisPaymentTimeLimit, payload)
      if (response && response.success && response.data) {
        const invoiceTimeLimit = response.data.paramValue || 15
        setQrisPaymentTimeLimit(invoiceTimeLimit)
      } else {
        setQrisPaymentTimeLimit(15)
      }
    },
    * customerViewTransactionTimeLimit ({ payload = {} }, { call }) {
      const response = yield call(queryCustomerViewTransactionTimeLimit, payload)
      if (response && response.success && response.data) {
        const invoiceTimeLimit = response.data.paramValue || 15
        setCustomerViewLastTransactionTimeLimit(invoiceTimeLimit)
      } else {
        setCustomerViewLastTransactionTimeLimit(15)
      }
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
        logo: `logo-${APPNAME}.png`
      }
    },
    getCompanyFailure (state) {
      lstorage.removeItemKey('cdi')
      return {
        ...state,
        logo: `logo-${APPNAME}.png`
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
