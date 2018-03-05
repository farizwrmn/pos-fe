import { routerRedux } from 'dva/router'
import { parse } from 'qs'
import config from 'config'
import moment from 'moment'
import { lstorage, messageInfo } from 'utils'
import { EnumRoleType } from 'enums'
import { query, logout, changePw } from '../services/app'
import { query as querySetting } from '../services/setting'
import { totp, edit } from '../services/users'
import * as menusService from '../services/menus'
import { queryMode as miscQuery } from '../services/misc'
import { query as queryAllPeriod, queryLastActive } from '../services/period'
import {
  queryTotalBirthdayInAMonth,
  queryTotalBirthdayPerDate,
  queryShowCustomerBirthdayPerDate,
  queryShowCustomerBirthdayPerMonth
} from '../services/customerBirthday'
import { queryProductsBelowMinimum } from '../services/master/productstock'

const { prefix } = config

export default {
  namespace: 'app',
  state: {
    user: {},
    storeInfo: {},
    setting: {},
    permissions: { visit: [] },
    totpChecked: false,
    totp: { key: '', url: '', isTotp: false },
    menu: [
      {
        id: 1,
        icon: 'laptop',
        name: 'Dashboard',
        router: '/dashboard'
      }
    ],
    menuPopoverVisible: false,
    visibleItem: { shortcutKey: false, changePw: false, changeTotp: false, displayBirthdate: false },
    visiblePw: false,
    siderFold: localStorage.getItem(`${prefix}siderFold`) === 'true',
    darkTheme: localStorage.getItem(`${prefix}darkTheme`) === 'true',
    isNavbar: document.body.clientWidth < 769,
    navOpenKeys: JSON.parse(localStorage.getItem(`${prefix}navOpenKeys`)) || [],
    ipAddr: '',
    selectedDate: moment().format('MMMM, Do YYYY'),
    calendarMode: 'month',
    selectedMonth: moment().format('MM'),
    totalBirthdayInAMonth: 0,
    listTotalBirthdayPerDate: [],
    listTotalBirthdayPerMonth: [],
    listCustomerBirthday: [],
    listNotification: []
  },
  subscriptions: {

    setup ({ dispatch }) {
      dispatch({ type: 'query' })
      dispatch({ type: 'queryTotalBirthdayInAMonthOfAYear' })
      dispatch({ type: 'queryTotalBirthdayInAMonth', payload: { month: moment().format('MM') } })
      dispatch({ type: 'queryTotalBirthdayPerDate', payload: { month: moment().format('MM') } })
      dispatch({ type: 'queryPeriod' })
      let tid
      window.onresize = () => {
        clearTimeout(tid)
        tid = setTimeout(() => {
          dispatch({ type: 'changeNavbar' })
        }, 300)
      }
    }

  },
  effects: {
    * query ({ payload }, { call, put }) {
      const { success, user } = yield call(query, payload)
      if (success && user) {
        const { data } = yield call(menusService.query)
        const { permissions } = user

        let menu = data
        if ([EnumRoleType.LVL0, EnumRoleType.IT].includes(permissions.role)) {
          permissions.visit = data.map(item => item.menuId)
        } else {
          menu = data.filter((item) => {
            const cases = [
              permissions.visit.includes(item.menuId),
              item.mpid ? permissions.visit.includes(item.mpid) || item.mpid === '-1' : true,
              item.bpid ? permissions.visit.includes(item.bpid) : true
            ]
            return cases.every(_ => _)
          })
        }

        const period = yield call(queryLastActive)
        let startPeriod
        let endPeriod
        if (period.data[0]) {
          startPeriod = moment(period.data[0].startPeriod).format('YYYY-MM-DD')
          endPeriod = moment(moment(moment(period.data[0].startPeriod).format('YYYY-MM-DD')).endOf('month')).format('YYYY-MM-DD')
        }

        const storeInfoData = lstorage.getCurrentUserStoreDetail()
        const misc = yield call(miscQuery, { code: 'company' })
        // let company = (({ miscDesc, miscName, miscVariable }) => ({ miscDesc, miscName, miscVariable })) (misc.data[0])
        const { miscName: name, miscDesc: address01, miscVariable: address02 } = (misc.data[0])
        const storeInfo = { name, address01, address02, startPeriod, endPeriod }

        storeInfo.stackHeader01 = [
          { text: (name || '') },
          { text: (storeInfoData.address01 || '') },
          { text: `${storeInfoData.mobileNumber || ''}/${storeInfoData.address02 || ''}` }
        ]
        storeInfo.stackHeader02 = storeInfo.stackHeader01
        for (let index of storeInfo.stackHeader01) {
          index.fontSize = 11
          index.alignment = 'right'
        }
        storeInfo.stackHeader02.push({ text: ' ' })
        storeInfo.stackHeader02 = storeInfo.stackHeader01
        for (let index of storeInfo.stackHeader01) {
          index.fontSize = 11
          index.alignment = 'left'
        }

        if (storeInfo !== []) {
          localStorage.setItem(`${prefix}store`, JSON.stringify(storeInfo))
        } else {
          console.log('unexpected error misc')
        }
        let setting = {}
        try { setting = yield call(querySetting) } catch (e) { alert(`warning: ${e}`) }
        let json = setting.data
        let arrayProd = []
        let settingdata = json.map(x => x.settingCode)
        let settingvalue = setting.data.map(x => x.settingValue)
        for (let n = 0; n < settingdata.length; n += 1) {
          arrayProd[settingdata[n]] = settingvalue[n]
        }
        yield put({
          type: 'updateState',
          payload: {
            user,
            storeInfo,
            permissions,
            menu,
            setting: arrayProd
          }
        })
        if (location.pathname === '/login') {
          yield put(routerRedux.push('/dashboard'))
        }
      } else if (config.openPages && config.openPages.indexOf(location.pathname) < 0) {
        let from = location.pathname
        window.location = `${location.origin}/login?from=${from}`
      }
    },

    * logout ({
      payload
    }, { call, put }) {
      const data = yield call(logout, parse(payload))
      lstorage.removeItemKey()

      if (data.success) {
        messageInfo(data.profile.sessionid)
        messageInfo(`${data.message} at ${moment(data.profile.userlogoutime).format('DD-MMM-YYYY hh:mm:ss')}`, 'success')
        yield put({ type: 'query' })
      } else {
        throw (data)
      }
    },

    * changePw ({
      payload
    }, { call, put }) {
      const data = yield call(changePw, parse(payload))

      if (data.success) {
        // yield put({ type: 'query' })
        yield put({ type: 'changePwHide' })
      } else {
        throw (data)
      }
    },

    * changeNavbar ({ payload = {} }, { put, select }) {
      const { app } = yield (select(_ => _))
      const isNavbar = document.body.clientWidth < 769
      if (isNavbar !== app.isNavbar) {
        yield put({ type: 'handleNavbar', payload: { isNavbar, ...payload } })
      }
    },

    * totp ({ payload = {} }, { call, put }) {
      // ...clone from models/user
      const mode = payload.mode
      if (mode === 'edit') {
        const data = yield call(edit, payload)
        if (data.success) {
          // yield put({ type: 'query' })
          yield put({ type: 'changeTotpHide' })
          yield put({ type: 'query' })
        } else {
          throw (data)
        }
      } else {
        const data = yield call(totp, payload)
        if (data.success) {
          yield put({
            type: 'querySuccessTotp',
            payload: {
              mode,
              totp: {
                key: data.key,
                url: data.otpURL,
                isTotp: data.isTOTP
              }
            }
          })
        }
      }
    },

    * changeTotp ({ payload = {} }, { put }) {
      yield put({
        type: 'querySuccessTotp',
        payload
      })
    },

    * queryTotalBirthdayInAMonthOfAYear (payload, { call, put }) {
      const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
      let data
      let listTotalBirthdayPerMonth = []
      for (let i = 0; i < months.length; i += 1) {
        const month = months[i]
        data = yield call(queryTotalBirthdayInAMonth, payload = { month })
        listTotalBirthdayPerMonth.push(Object.assign({}, data.data, { month }))
      }
      if (data.success) {
        yield put({ type: 'updateState', payload: { listTotalBirthdayPerMonth, ...payload } })
      }
    },

    * queryTotalBirthdayInAMonth ({ payload = {} }, { call, put }) {
      const data = yield call(queryTotalBirthdayInAMonth, payload)
      if (data.success) {
        yield put({ type: 'updateState', payload: { totalBirthdayInAMonth: data.data.counter } })
      }
    },

    * queryTotalBirthdayPerDate ({ payload = {} }, { call, put }) {
      const data = yield call(queryTotalBirthdayPerDate, payload)
      if (data.success) {
        yield put({ type: 'updateState', payload: { listTotalBirthdayPerDate: data.data } })
      }
    },

    * queryShowCustomerBirthdayPerDate ({ payload = {} }, { call, put }) {
      const data = yield call(queryShowCustomerBirthdayPerDate, payload)
      if (data.success) {
        yield put({ type: 'updateState', payload: { listCustomerBirthday: data.data } })
      }
    },

    * queryShowCustomerBirthdayPerMonth ({ payload = {} }, { call, put }) {
      const data = yield call(queryShowCustomerBirthdayPerMonth, payload)
      if (data.success) {
        yield put({ type: 'updateState', payload: { listCustomerBirthday: data.data } })
      }
    },

    * queryPeriod (payload, { call, put }) {
      const data = yield call(queryAllPeriod)
      if (data.success) {
        const start = data.data[0].startPeriod
        yield put({
          type: 'queryNotifications',
          payload: {
            start,
            end: moment().format('YYYY-MM-DD')
          }
        })
      }
    },

    * queryNotifications ({ payload = {} }, { call, put }) {
      let allNotifications = []
      const dataStocks = yield call(queryProductsBelowMinimum, payload)
      if (dataStocks.success) {
        allNotifications.push({ title: 'Quantity Alerts', route: '/report/product/stock/quantity-alerts', counter: Object.keys(dataStocks.data).length })
      }

      if (allNotifications.length > 0) {
        yield put({ type: 'updateState', payload: { listNotification: allNotifications } })
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

    showTotalBirthdayInCurrentMonth (state, { payload }) {
      return {
        ...state,
        ...payload
      }
    },

    foldSider (state) {
      localStorage.setItem(`${prefix}siderFold`, true)
      return {
        ...state,
        siderFold: true
      }
    },
    saveIPClient (state, { payload }) {
      return {
        ...state,
        ...payload,
        ipAddr: payload.ipAddr
      }
    },
    switchSider (state) {
      localStorage.setItem(`${prefix}siderFold`, !state.siderFold)
      return {
        ...state,
        siderFold: !state.siderFold
      }
    },
    shortcutKeyShow (state, { payload }) {
      return { ...state, ...payload, visibleItem: { shortcutKey: true } }
    },
    shortcutKeyHide (state) {
      return { ...state, visibleItem: { shortcutKey: false } }
    },
    changePwShow (state, { payload }) {
      return { ...state, ...payload, visibleItem: { changePw: true } }
    },
    changePwHide (state) {
      return { ...state, visibleItem: { changePw: false } }
    },
    togglePw (state) {
      return { ...state, visiblePw: !state.visiblePw }
    },
    changeTotpShow (state, { payload }) {
      return { ...state, ...payload, visibleItem: { changeTotp: true } }
    },
    changeTotpHide (state) {
      return { ...state, visibleItem: { changeTotp: false } }
    },
    switchTheme (state) {
      localStorage.setItem(`${prefix}darkTheme`, !state.darkTheme)
      return {
        ...state,
        darkTheme: !state.darkTheme
      }
    },

    switchMenuPopver (state) {
      return {
        ...state,
        menuPopoverVisible: !state.menuPopoverVisible
      }
    },

    handleNavbar (state, { payload }) {
      return {
        ...state,
        isNavbar: payload.isNavbar
      }
    },

    handleNavOpenKeys (state, { payload: navOpenKeys }) {
      return {
        ...state,
        ...navOpenKeys
      }
    },

    querySuccessTotp (state, action) {
      const { totp, mode, isTotp } = action.payload
      if (mode === 'load') state.totpChecked = totp.isTotp
      if (mode === 'edit') state.totpChecked = isTotp
      return {
        ...state,
        totp
      }
    }
  }
}
