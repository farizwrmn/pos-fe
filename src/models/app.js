import { routerRedux } from 'dva/router'
import { parse } from 'qs'
import moment from 'moment'
import { Modal } from 'antd'
import { lstorage, messageInfo } from 'utils'
import { EnumRoleType } from 'enums'
import { VERSION, getVersionInfo, prefix, openPages } from 'utils/config.main'
import { APPNAME } from 'utils/config.company'
import { query as queryCustomerType } from '../services/master/customertype'
import { query as queryPaymentShortcut } from '../services/payment/paymentShortcut'
import { query, logout, changePw } from '../services/app'
import { query as querySetting } from '../services/setting'
import { totp, edit } from '../services/users'
import { query as queryMenu } from '../services/menus'
import { queryMode as miscQuery } from '../services/misc'
import { queryLastActive } from '../services/period'
import { query as queryPermission } from '../services/permission'
import { getNotifications, getListNotifications, refreshNotifications } from '../services/dashboard'
import {
  queryTotalBirthdayPerDate,
  queryShowCustomerBirthdayPerDate,
  queryShowCustomerBirthdayPerMonth
} from '../services/customerBirthday'

export default {
  namespace: 'app',
  state: {
    user: {},
    storeInfo: {},
    setting: {},
    permission: {},
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
    visibleItem: { shortcutKey: false, changePw: false, changeTotp: false, showPopOverCalendar: false, showPopOverNotification: false },
    visiblePw: false,
    siderFold: localStorage.getItem(`${prefix}siderFold`) === 'true',
    darkTheme: localStorage.getItem(`${prefix}darkTheme`) === 'true',
    isNavbar: document.body.clientWidth < 769,
    navOpenKeys: JSON.parse(localStorage.getItem(`${prefix}navOpenKeys`)) || [],
    ipAddr: '',
    selectedDate: moment().format('MMMM, Do YYYY'),
    calendarMode: 'month',
    selectedMonth: moment().format('MM'),
    listTotalBirthdayPerDate: [],
    listTotalBirthdayPerMonth: [],
    listCustomerBirthday: [],
    listNotification: [],
    listNotificationDetail: [],
    ignore: true,
    title: '',
    options: {},
    defaultSidebarColor: localStorage.getItem('sidebarColor') || '#55a756'
  },
  subscriptions: {

    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/user_profile') {
          dispatch({ type: 'checkTotpStatus' })
        }
      })
      dispatch({ type: 'query' })

      document.querySelector("link[rel='shortcut icon']").href = `favicon-${APPNAME}.ico`

      document.querySelector("link[rel*='icon']").href = `favicon-${APPNAME}.ico`
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
      const isInit = localStorage.getItem('isInit')
      const { success, user } = yield call(query, payload)
      if (success && user) {
        yield put({ type: 'app/queryRefreshNotifications' })
        const notifications = yield call(getNotifications, payload)
        getVersionInfo(VERSION)
        const { permissions } = user

        let menu
        if (!Number(isInit)) {
          const { data } = yield call(queryMenu, { field: 'menuId,icon,name,bpid,mpid,route' })
          menu = data
          localStorage.setItem('routeList', JSON.stringify(menu))
        } else {
          const list = localStorage.getItem('routeList')
          const routeList = list ? JSON.parse(list) : []
          menu = routeList
        }

        if ([EnumRoleType.LVL0, EnumRoleType.IT].includes(permissions.role)) {
          permissions.visit = menu.map(item => item.menuId)
        } else {
          menu = menu && menu.filter((item) => {
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

        const listPrice = yield call(queryCustomerType, {})
        if (listPrice && listPrice.success) {
          lstorage.setPriceName(listPrice.data)
        }

        const listPaymentShortcut = yield call(queryPaymentShortcut, { type: 'all' })
        if (listPaymentShortcut && listPaymentShortcut.success) {
          lstorage.setPaymentShortcut(listPaymentShortcut.data)
        }

        const storeInfoData = lstorage.getCurrentUserStoreDetail()
        const misc = yield call(miscQuery, { code: 'company' })
        const { miscName: name, miscDesc: address01, miscVariable: address02 } = (misc.data[0])
        const storeInfo = { name, address01, address02, startPeriod, endPeriod }
        if (storeInfoData && storeInfoData.label) {
          storeInfo.storeName = storeInfoData.label.replace('* ', '')
        }

        storeInfo.stackHeader01 = [
          { text: (name || '') },
          { text: (storeInfoData.address01 || '') },
          { text: `${storeInfoData.mobileNumber || ''}/${storeInfoData.address02 || ''}` }
        ]
        for (let index of storeInfo.stackHeader01) {
          index.fontSize = 11
          index.alignment = 'left'
        }
        storeInfo.stackHeader03 = [
          { text: (storeInfoData && storeInfoData.storeName ? storeInfoData.storeName : '') },
          { text: (storeInfoData.address01 || '').substring(0, 40) },
          { text: (`${storeInfoData.mobileNumber || ''}`).substring(0, 40) }
        ]
        for (let index of storeInfo.stackHeader03) {
          index.fontSize = 11
          index.alignment = 'right'
        }
        storeInfo.stackHeader02 = storeInfo.stackHeader03

        localStorage.setItem(`${prefix}store`, JSON.stringify(storeInfo))

        yield put({
          type: 'setSetting'
        })

        // yield put({
        //   type: 'setPermission',
        //   payload: {
        //     role: permissions.role
        //   }
        // })

        yield put({
          type: 'updateState',
          payload: {
            user,
            storeInfo,
            permissions,
            menu
          }
        })
        localStorage.setItem('isInit', Number(process.env.NODE_ENV === 'production'))
        if (location.pathname === '/login') {
          yield put(routerRedux.push('/dashboard'))
        }
        if (notifications.success) yield put({ type: 'updateState', payload: { listNotification: notifications.data } })
        yield put({ type: 'queryListNotifications' })
      } else if (openPages && openPages.indexOf(location.pathname) < 0) {
        let from = location.pathname
        window.location = `${location.origin}/login?from=${from}`
      }
    },

    * setSetting (payload, { call, put }) {
      let setting = {}
      try { setting = yield call(querySetting) } catch (e) { alert(`warning: ${e}`) }
      let arrayProd = []
      setting.data.map((x) => {
        arrayProd[x.settingCode] = x.settingValue
        return x.settingValue
      })
      lstorage.setItem('setting', JSON.stringify(Object.assign({}, arrayProd)))
      yield put({
        type: 'updateState',
        payload: {
          setting: arrayProd
        }
      })
    },

    * setPermission ({ payload = {} }, { call, put }) {
      const { role } = payload
      let roleIdData = yield call(queryPermission, { name: role })
      if (roleIdData.success && roleIdData.data.length > 0) {
        roleIdData = roleIdData.data[0]
      }
      if (roleIdData.roleId) {
        const permission = yield call(queryPermission, { roleId: roleIdData.roleId })

        let arrayProd = []
        permission.data.map((x) => {
          arrayProd[x['Permission.permissionCode']] = Boolean(parseInt(x.allow, 10))
          return x['Permission.permissionCode']
        })
        lstorage.setItem('permission', JSON.stringify(Object.assign({}, arrayProd)))
        yield put({
          type: 'updateState',
          payload: {
            permission: arrayProd
          }
        })
      } else {
        lstorage.setItem('permission', JSON.stringify(Object.assign({}, [])))
        yield put({
          type: 'updateState',
          payload: {
            permission: []
          }
        })
      }
    },

    * logout ({
      payload
    }, { call, put }) {
      const listPos = lstorage.getCashierTrans()
      if (listPos && listPos.length > 0) {
        const modalMember = () => {
          return new Promise((resolve, reject) => {
            Modal.confirm({
              title: 'Unfinished transaction',
              content: 'You have transaction in POS Menu',
              onOk () {
                resolve()
              },
              onCancel () {
                reject()
              }
            })
          })
        }
        yield modalMember()
        yield put(routerRedux.push('/transaction/pos'))
        return
      }
      const data = yield call(logout, parse(payload))
      lstorage.removeItemKeys()

      if (data.success) {
        messageInfo(data.profile.sessionid)
        messageInfo(`${data.message} at ${moment(data.profile.userlogoutime).format('DD-MMM-YYYY HH:mm:ss')}`, 'success')
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
        messageInfo('Your Password has been successfully updated!')
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

    * queryListNotifications ({ payload = {} }, { call, put }) {
      const data = yield call(getListNotifications, payload)
      if (data.success) {
        let listNotificationDetail = data.data
        for (let key in listNotificationDetail) {
          switch (listNotificationDetail[key].notificationCode) {
            case 'SML':
              Object.assign(listNotificationDetail[key], { route: '/report/product/stock/quantity-alerts' })
              break
            case 'SPC':
              Object.assign(listNotificationDetail[key], { route: '/dashboard' })
              break
            case 'SDR':
              Object.assign(listNotificationDetail[key], { route: '/sales-discount' })
              break
            case 'RSR':
              Object.assign(listNotificationDetail[key], { route: '/return-request' })
              break
            default:
          }
        }
        yield put({ type: 'updateState', payload: { listNotificationDetail } })
      }
    },

    * queryRefreshNotifications ({ payload = {} }, { call, put }) {
      const data = yield call(refreshNotifications, payload)
      if (data.success) {
        yield put({ type: 'queryListNotifications' })
      }
    },

    * checkTotpStatus ({ payload }, { call, put }) {
      const { user } = yield call(query, payload)
      if (user) {
        yield put({ type: 'updateState', payload: { totpChecked: user.totp } })
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

    permissionDenied (state) {
      return { ...state, ignore: true }
    },

    permissionGranted (state) {
      return { ...state, ignore: false }
    },

    sendNotification (state) {
      localStorage.setItem(`${prefix}subscribe`, state.notification)
      return { ...state, notification: { subscribe: true, sendNotification: true } }
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
