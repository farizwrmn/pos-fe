import React from 'react'
import PropTypes from 'prop-types'
import pathToRegexp from 'path-to-regexp'
import { connect } from 'dva'
import { Layout, Loader } from 'components'
import { classnames, config } from 'utils'
import { Helmet } from 'react-helmet'
import NProgress from 'nprogress'
import { LocaleProvider } from 'antd'
import moment from 'moment'
import enUS from 'antd/lib/locale-provider/en_US'
import '../themes/index.less'
import './app.less'
import Error from './error'

const { prefix, openPages } = config

const { Header, Bread, Footer, Sider, styles } = Layout
let lastHref

const App = ({ children, dispatch, app, loading, location }) => {
  const { user, siderFold, darkTheme, isNavbar, menuPopoverVisible,
    visibleItem, visiblePw, navOpenKeys, menu, permissions, totp, totpChecked,
    selectedDate, calendarMode, selectedMonth, totalBirthdayInAMonth, listTotalBirthdayPerDate,
    listCustomerBirthday, listNotification } = app
  let { pathname } = location
  pathname = pathname.startsWith('/') ? pathname : `/${pathname}`
  const { logo } = config
  const current = menu.filter(item => pathToRegexp(item.route || '').exec(pathname))
  const hasPermission = current.length ? permissions.visit.includes(current[0].menuId) : false
  const href = window.location.href
  if (lastHref !== href) {
    NProgress.start()
    if (!loading.global) {
      NProgress.done()
      lastHref = href
    }
  }

  const headerProps = {
    menu,
    user,
    siderFold,
    darkTheme,
    isNavbar,
    menuPopoverVisible,
    visibleItem,
    visiblePw,
    totp,
    totpChecked,
    navOpenKeys,
    selectedDate,
    calendarMode,
    selectedMonth,
    totalBirthdayInAMonth,
    listTotalBirthdayPerDate,
    listCustomerBirthday,
    listNotification,
    switchMenuPopover () {
      dispatch({ type: 'app/switchMenuPopver' })
    },
    logout (sessionId) {
      dispatch({ type: 'app/logout', payload: { sessionId } })
    },
    switchSider () {
      dispatch({ type: 'app/switchSider' })
    },
    changeTheme () {
      dispatch({ type: 'app/switchTheme' })
    },
    changeOpenKeys (openKeys) {
      dispatch({ type: 'app/handleNavOpenKeys', payload: { navOpenKeys: openKeys } })
    },
    handleShortcutKeyShow () {
      dispatch({ type: 'app/shortcutKeyShow' })
    },
    handleShortcutKeyHide () {
      dispatch({ type: 'app/shortcutKeyHide' })
    },
    handleChangePwShow () {
      dispatch({ type: 'app/changePwShow' })
    },
    handleChangePwHide () {
      dispatch({ type: 'app/changePwHide' })
    },
    handleTogglePw () {
      dispatch({ type: 'app/togglePw' })
    },
    handleTotpLoad (userId) {
      dispatch({
        type: 'app/totp',
        payload: { mode: 'load', id: userId }
      })
    },
    handleRegenerateTotp (userId) {
      dispatch({
        type: 'app/totp',
        payload: { mode: 'generate', id: userId }
      })
    },
    handleChangeTotpShow (userId) {
      dispatch({ type: 'app/changeTotpShow' })
      dispatch({ type: 'app/totp', payload: { mode: 'load', id: userId } })
    },
    handleChangeTotpHide () {
      dispatch({ type: 'app/changeTotpHide' })
    },
    handleSavePw (data) {
      dispatch({
        type: 'app/changePw',
        payload: {
          id: user.userid,
          data,
          currentItem: {}
        }
      })
    },
    handleSaveTotp (userId, data) {
      dispatch({
        type: 'app/totp',
        payload: { mode: 'edit', id: userId, data }
      })
    },
    modalSwitchChange (checked, userId) {
      if (checked) {
        dispatch({
          type: 'app/totp',
          payload: { mode: 'generate', id: userId }
        })
        dispatch({
          type: 'app/updateState',
          payload: { totpChecked: true }
        })
      } else {
        dispatch({
          type: 'app/updateState',
          payload: { totpChecked: false }
        })
      }
    },
    showBirthDayListModal (date) {
      dispatch({
        type: 'app/updateState',
        payload: {
          visibleItem: {
            displayBirthdate: true,
            showPopOver: false
          },
          selectedDate: moment(date).format('YYYY-MM-DD')
        }
      })
      if (calendarMode === 'month') {
        const monthdate = moment(date).format('MMDD')
        dispatch({
          type: 'app/queryShowCustomerBirthdayPerDate',
          payload: {
            monthdate
          }
        })
      } else {
        const month = moment(date).format('MM')
        dispatch({
          type: 'app/queryShowCustomerBirthdayPerMonth',
          payload: {
            month
          }
        })
      }
    },
    hideBirthDayListModal () {
      dispatch({
        type: 'app/updateState',
        payload: {
          visibleItem: {
            displayBirthdate: false,
            showPopOver: true
          },
          selectedDate: '',
          listCustomerBirthday: [],
          calendarMode: 'month'
        }
      })
    },
    showPopOver () {
      dispatch({
        type: 'app/updateState',
        payload: {
          visibleItem: {
            showPopOver: !visibleItem.showPopOver
          }
        }
      })
      if (!visibleItem.showPopOver) {
        dispatch({
          type: 'app/queryTotalBirthdayPerDate',
          payload: {
            month: selectedMonth
          }
        })
      }
    },
    changeCalendarMode (month, mode) {
      dispatch({
        type: 'app/updateState',
        payload: {
          selectedMonth: month,
          calendarMode: mode
        }
      })
      if (mode === 'month') {
        dispatch({
          type: 'app/queryTotalBirthdayPerDate',
          payload: {
            month
          }
        })
      }
    }
  }

  const siderProps = {
    menu,
    location,
    siderFold,
    darkTheme,
    navOpenKeys,
    changeRole (roleCode) {
      dispatch({ type: 'app/query', payload: { userid: user.userid, role: roleCode } })
    },
    switchSider () {
      dispatch({ type: 'app/switchSider' })
    },
    changeOpenKeys (openKeys) {
      localStorage.setItem(`${prefix}navOpenKeys`, JSON.stringify(openKeys))
      dispatch({ type: 'app/handleNavOpenKeys', payload: { navOpenKeys: openKeys } })
    }
  }

  const breadProps = {
    menu
  }
  if (openPages && openPages.includes(pathname)) {
    return (<div>
      <Loader spinning={loading.effects['app/query']} />
      {children}
    </div>)
  }

  return (
    <div>
      <Helmet>
        <title>{config.name}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href={logo} type="image/x-icon" />
      </Helmet>
      <div className={classnames(styles.layout, { [styles.fold]: isNavbar ? false : siderFold }, { [styles.withnavbar]: isNavbar })}>
        {!isNavbar ? <aside className={classnames(styles.sider, { [styles.light]: !darkTheme })}>
          <Sider {...siderProps} />
        </aside> : ''}
        <LocaleProvider locale={enUS}>
          <div className={styles.main}>
            <Header {...headerProps} />
            <Bread {...breadProps} />
            <div className={styles.container}>
              <div className={styles.content}>
                {hasPermission ? children : <Error />}
              </div>
            </div>
            <Footer />
          </div>
        </LocaleProvider>
      </div>
    </div>
  )
}

App.propTypes = {
  children: PropTypes.element.isRequired,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  app: PropTypes.object,
  loading: PropTypes.object
}

export default connect(({ app, loading }) => ({ app, loading }))(App)
