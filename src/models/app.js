import { routerRedux } from 'dva/router'
import { parse } from 'qs'
import config from 'config'
import moment from 'moment'
import { EnumRoleType } from 'enums'
import { query, logout, changePw } from '../services/app'
import * as menusService from '../services/menus'
import { queryMode as miscQuery } from '../services/misc'
import { queryLastActive } from '../services/period'

const { prefix, apiHost } = config

export default {
  namespace: 'app',
  state: {
    user: {},
    storeInfo: {},
    permissions: {
      visit: [],
    },
    menu: [
      {
        id: 1,
        icon: 'laptop',
        name: 'Dashboard',
        router: '/dashboard',
      },
    ],
    menuPopoverVisible: false,
    visibleItem: {shortcutKey: false, changePw: false },
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
        const { list } = yield call(menusService.query)
        const { permissions } = user

        let menu = list
        if ([EnumRoleType.LVL0, EnumRoleType.IT].includes(permissions.role)
        ) {
          permissions.visit = list.map(item => item.id)
        } else {
          menu = list.filter((item) => {
            const cases = [
              permissions.visit.includes(item.id),
              item.mpid ? permissions.visit.includes(item.mpid) || item.mpid === '-1' : true,
              item.bpid ? permissions.visit.includes(item.bpid) : true,
            ]
            return cases.every(_ => _)
          })
        }

        const period = yield call(queryLastActive)

        // // Opera 8.0+
        // let isOpera = (!!window.opr && !!opr.addons) || window.opera || navigator.userAgent.indexOf(' OPR/') >= 0
        //
        // // Firefox 1.0+
        // let isFirefox = typeof InstallTrigger !== 'undefined'
        //
        // // Chrome 1+
        // let isChrome = !!window.chrome && !!window.chrome.webstore
        //
        // // Blink engine detection
        // let isBlink = (isChrome || isOpera) && !!window.CSS
        //
        // const findIP = (onNewIP) => { //  onNewIp - your listener function for new IPs
        //   let MyPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection //compatibility for firefox and chrome
        //   const pc = new MyPeerConnection({ iceServers: [] }),
        //     noop = function () {},
        //     localIPs = {},
        //     ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g
        //   function ipIterate (ip) {
        //     if (!localIPs[ip]) onNewIP(ip)
        //     localIPs[ip] = true
        //   }
        //   pc.createDataChannel('') // create a bogus data channel
        //   pc.createOffer((sdp) => {
        //     sdp.sdp.split('\n').forEach((line) => {
        //       if (line.indexOf('candidate') < 0) return
        //       line.match(ipRegex).forEach(ipIterate)
        //     })
        //     pc.setLocalDescription(sdp, noop, noop)
        //   }, noop) // create offer and set local description
        //   pc.onicecandidate = (ice) => { // listen for candidate events
        //     if (!ice || !ice.candidate || !ice.candidate.candidate || !ice.candidate.candidate.match(ipRegex)) return
        //     ice.candidate.candidate.match(ipRegex).forEach(ipIterate)
        //   }
        // }
        // let ipAddress = apiHost
        // const addIP = (ip) => {
        //   console.log(ip)
        // }
        // if (isChrome || isFirefox || isBlink) {
        //   findIP(addIP)
        // } else {
        //   alert('Browser cannot find IP address')
        // }
        const startPeriod = moment(period.data[0].startPeriod).format('YYYY-MM-DD')
        const endPeriod = moment(moment(moment(period.data[0].startPeriod).format('YYYY-MM-DD')).endOf('month')).format('YYYY-MM-DD')
        const misc = yield call(miscQuery, { code: 'company' })
        const { miscName: name, miscDesc: address01, miscVariable: address02 } = (misc.data[0])
        const storeInfo = { name, address01, address02, startPeriod, endPeriod }
        storeInfo.stackHeader01 = [
          {
            text: name,
            fontSize: 11,
            alignment: 'left',
          },
          {
            text: address01,
            fontSize: 11,
            alignment: 'left',
          },
          {
            text: address02,
            fontSize: 11,
            alignment: 'left',
          },
        ]

        if (storeInfo !== []) {
          localStorage.setItem(`${prefix}store`, JSON.stringify(storeInfo))
        } else {
          console.log('unexpected error misc')
        }

        yield put({
          type: 'updateState',
          payload: {
            user,
            storeInfo,
            permissions,
            menu,
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
      localStorage.removeItem(`${prefix}idToken`)
      localStorage.removeItem(`${prefix}uid`)

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
  },
}
