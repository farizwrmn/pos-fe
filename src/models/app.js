import { query, logout, changePw } from '../services/app'
import * as menusService from '../services/menus'
import { queryMode as miscQuery } from '../services/misc'
import { routerRedux } from 'dva/router'
import { parse } from 'qs'
import config from 'config'
import { EnumRoleType } from 'enums'

const { prefix } = config

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
        console.log('user',user)
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

        const misc = yield call(miscQuery, { code: 'company'})
        let company = (({ miscDesc, miscName, miscVariable }) => ({ miscDesc, miscName, miscVariable })) (misc.data[0])
        const { miscName: name, miscDesc: address01, miscVariable: address02 } = (misc.data[0])
        const storeInfo = { name, address01, address02 }

        if(storeInfo != []) {
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
