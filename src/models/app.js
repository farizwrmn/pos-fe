import { routerRedux } from 'dva/router'
import { parse } from 'qs'
import config from 'config'
import moment from 'moment'
import { EnumRoleType } from 'enums'
import { query, logout, changePw, totpapp } from '../services/app'
import { query as querySetting } from '../services/setting'
import { totp, edit } from '../services/users'
import * as menusService from '../services/menus'
import { queryMode as miscQuery } from '../services/misc'
import { query1store as queryStore } from '../services/store'
import { queryLastActive } from '../services/period'
import { lstorage } from 'utils'

const { prefix, apiHost } = config

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
        router: '/dashboard',
      },
    ],
    menuPopoverVisible: false,
    visibleItem: {shortcutKey: false, changePw: false, changeTotp: false },
    visiblePw: false,
    siderFold: localStorage.getItem(`${prefix}siderFold`) === 'true',
    darkTheme: localStorage.getItem(`${prefix}darkTheme`) === 'true',
    isNavbar: document.body.clientWidth < 769,
    navOpenKeys: JSON.parse(localStorage.getItem(`${prefix}navOpenKeys`)) || [],
  },
  subscriptions: {

    setup ({ dispatch }) {
      dispatch({ type: 'query' })
      let tid
      window.onresize = () => {
        clearTimeout(tid)
        tid = setTimeout(() => {
          dispatch({ type: 'changeNavbar' })
        }, 300)
      }
    },

  },
  effects: {

    *query ({
      payload,
    }, { call, put }) {
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
              item.bpid ? permissions.visit.includes(item.bpid) : true,
            ]
            return cases.every(_ => _)
          })
        }

        // Opera 8.0+
        let isOpera = (!!window.opr && !!opr.addons) || window.opera || navigator.userAgent.indexOf(' OPR/') >= 0

        // Firefox 1.0+
        let isFirefox = typeof InstallTrigger !== 'undefined'

        // Chrome 1+
        let isChrome = !!window.chrome && !!window.chrome.webstore

        // Blink engine detection
        let isBlink = (isChrome || isOpera) && !!window.CSS

        const findIP = (onNewIP) => { //  onNewIp - your listener function for new IPs
          let MyPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection //compatibility for firefox and chrome
          const pc = new MyPeerConnection({ iceServers: [] }),
            noop = function () {},
            localIPs = {},
            ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g
          function ipIterate (ip) {
            if (!localIPs[ip]) onNewIP(ip)
            localIPs[ip] = true
          }
          pc.createDataChannel('') // create a bogus data channel
          pc.createOffer((sdp) => {
            sdp.sdp.split('\n').forEach((line) => {
              if (line.indexOf('candidate') < 0) return
              line.match(ipRegex).forEach(ipIterate)
            })
            pc.setLocalDescription(sdp, noop, noop)
          }, noop) // create offer and set local description
          pc.onicecandidate = (ice) => { // listen for candidate events
            if (!ice || !ice.candidate || !ice.candidate.candidate || !ice.candidate.candidate.match(ipRegex)) return
            ice.candidate.candidate.match(ipRegex).forEach(ipIterate)
          }
        }
        let ipAddress = apiHost
        let ipAdd2 = ''
        const addIP = (ip) => {
          console.log(ip)
        }
        try {
          findIP(addIP)
        } catch (e) {
          alert('Browser cannot find IP address')
        }

        const period = yield call(queryLastActive)        
        const startPeriod = moment(period.data[0].startPeriod).format('YYYY-MM-DD')
        const endPeriod = moment(moment(moment(period.data[0].startPeriod).format('YYYY-MM-DD')).endOf('month')).format('YYYY-MM-DD')
        const storeCode = lstorage.getCurrentUserStoreCode()
        const storeInfoData = yield call(queryStore, { code: storeCode })
        const misc = yield call(miscQuery, { code: 'company'})
        let company = (({ miscDesc, miscName, miscVariable }) => ({ miscDesc, miscName, miscVariable })) (misc.data[0])
        const { miscName: name, miscDesc: address01, miscVariable: address02 } = (misc.data[0])
        const storeInfo = { name, address01, address02, startPeriod, endPeriod }
        storeInfo.stackHeader01 = [
          {
            text: (name || ''),
            fontSize: 11,
            alignment: 'left',
          },
          {
            text: (storeInfoData.data[0].address01 || ''),
            fontSize: 11,
            alignment: 'left',
          },
          {
            text: (storeInfoData.data[0].mobileNumber || '') + '/' + (storeInfoData.data[0].address02 || ''),
            fontSize: 11,
            alignment: 'left',
          },
        ]
        storeInfo.stackHeader02 = [
          {
            text: (name || ''),
            style: 'header',
            fontSize: 11,
            alignment: 'left'
          },
          {
            text: (storeInfoData.data[0].address01 || ''),
            style: 'header',
            fontSize: 11,
            alignment: 'left'
          },
          {
            text: (storeInfoData.data[0].mobileNumber || '') + '/' + (storeInfoData.data[0].address02 || ''),
            style: 'header',
            fontSize: 11,
            alignment: 'left'
          },
          {
            text: ' ',
            style: 'header',
            fontSize: 11,
            alignment: 'left'
          },
        ]
        if (storeInfo !== []) {
          localStorage.setItem(`${prefix}store`, JSON.stringify(storeInfo))
        } else {
          console.log('unexpected error misc')
        }
        let setting = {}
        try { setting = yield call(querySetting) }
        catch (e) { alert(`warning: ${e}`) }
        let json = setting.data
        let arrayProd = []
        let settingdata = json.map((x) => x.settingCode)
        let settingvalue = setting.data.map((x) => x.settingValue)
        for (let n in settingdata) {
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
          },
        })
        if (location.pathname === '/login') {
          yield put(routerRedux.push('/dashboard'))
        }
      } else if (config.openPages && config.openPages.indexOf(location.pathname) < 0) {
        let from = location.pathname
        window.location = `${location.origin}/login?from=${from}`
      }
    },

    *logout ({
      payload,
    }, { call, put }) {
      const data = yield call(logout, parse(payload))
      lstorage.removeItemKey()

      if (data.success) {
        yield put({ type: 'query' })
      } else {
        throw (data)
      }
    },

    *changePw({
      payload,
    }, { call, put }) {
      const data = yield call(changePw, parse(payload))

      if (data.success) {
        // yield put({ type: 'query' })
        yield put({ type: 'changePwHide' })
      } else {
        throw (data)
      }
    },

    *changeNavbar ({
      payload,
    }, { put, select }) {
      const { app } = yield(select(_ => _))
      const isNavbar = document.body.clientWidth < 769
      if (isNavbar !== app.isNavbar) {
        yield put({ type: 'handleNavbar', payload: isNavbar })
      }
    },

    *totp ({ payload = {} }, { call, put }) {
      //...clone from models/user
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
              },
            },
          })
        }
      }
    },

    *changeTotp ({ payload = {} }, { call, put }) {
      yield put({
        type: 'querySuccessTotp',
        payload
      })
    }
  },
  reducers: {
    updateState (state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },

    foldSider (state) {
      localStorage.setItem(`${prefix}siderFold`, true)
      return {
        ...state,
        siderFold: true,
      }
    },
    switchSider (state) {
      localStorage.setItem(`${prefix}siderFold`, !state.siderFold)
      return {
        ...state,
        siderFold: !state.siderFold,
      }
    },
    shortcutKeyShow (state, { payload }) {
      return { ...state, ...payload, visibleItem: {shortcutKey: true } }
    },
    shortcutKeyHide (state) {
      return { ...state, visibleItem: {shortcutKey: false } }
    },
    changePwShow (state, { payload }) {
      return { ...state, ...payload, visibleItem: {changePw: true } }
    },
    changePwHide (state) {
      return { ...state, visibleItem: {changePw: false } }
    },
    togglePw (state) {
      return { ...state, visiblePw: !state.visiblePw }
    },
    changeTotpShow (state, { payload }) {
      return { ...state, ...payload, visibleItem: {changeTotp: true } }
    },
    changeTotpHide (state) {
      return { ...state, visibleItem: {changeTotp: false } }
    },
    switchTheme (state) {
      localStorage.setItem(`${prefix}darkTheme`, !state.darkTheme)
      return {
        ...state,
        darkTheme: !state.darkTheme,
      }
    },

    switchMenuPopver (state) {
      return {
        ...state,
        menuPopoverVisible: !state.menuPopoverVisible,
      }
    },

    handleNavbar (state, { payload }) {
      return {
        ...state,
        isNavbar: payload,
      }
    },

    handleNavOpenKeys (state, { payload: navOpenKeys }) {
      return {
        ...state,
        ...navOpenKeys,
      }
    },

    querySuccessTotp (state, action) {
      const { totp, mode, isTotp } = action.payload
      if (mode === 'load') state.totpChecked = totp.isTotp
      if (mode === 'edit') state.totpChecked = isTotp
      return { ...state,
        totp,
      }
    },
  },
}
