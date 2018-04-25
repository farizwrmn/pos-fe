import React from 'react'
import PropTypes from 'prop-types'
import pathToRegexp from 'path-to-regexp'
import { connect } from 'dva'
import { Layout, Loader, Notification } from 'components'
import { classnames, configMain } from 'utils'
import { Helmet } from 'react-helmet'
import NProgress from 'nprogress'
import { LocaleProvider } from 'antd'
import moment from 'moment'
import enUS from 'antd/lib/locale-provider/en_US'
import '../themes/index.less'
import './app.less'
import Error from './error'
import ButtonIcon from '../../public/icons/Notifications_button_24.svg'

const { prefix, openPages, logo } = configMain

const { Header, Bread, Footer, Sider, styles } = Layout
let lastHref

const App = ({ children, dispatch, app, loading, location }) => {
  const { user, siderFold, darkTheme, isNavbar, menuPopoverVisible,
    visibleItem, visiblePw, navOpenKeys, menu,
    permissions,
    totp, totpChecked,
    selectedDate, calendarMode, selectedMonth, listTotalBirthdayPerDate,
    listCustomerBirthday, listNotification, listNotificationDetail, ignore, title } = app
  let { pathname } = location
  pathname = pathname.startsWith('/') ? pathname : `/${pathname}`
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
    listTotalBirthdayPerDate,
    listCustomerBirthday,
    listNotification,
    listNotificationDetail,
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
            showPopOverCalendar: false
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
            showPopOverCalendar: true
          },
          selectedDate: '',
          listCustomerBirthday: [],
          calendarMode: 'month'
        }
      })
    },
    showPopOverCalendar () {
      dispatch({
        type: 'app/updateState',
        payload: {
          visibleItem: {
            showPopOverCalendar: !visibleItem.showPopOverCalendar,
            showPopOverNotification: false
          }
        }
      })
      if (!visibleItem.showPopOverCalendar) {
        dispatch({
          type: 'app/queryTotalBirthdayPerDate',
          payload: {
            month: selectedMonth
          }
        })
      }
    },
    showPopOverNotification () {
      dispatch({
        type: 'app/updateState',
        payload: {
          visibleItem: {
            showPopOverNotification: !visibleItem.showPopOverNotification,
            showPopOverCalendar: false
          }
        }
      })
      if (!visibleItem.showPopOverNotification) {
        dispatch({ type: 'app/queryListNotifications' })
      }
    },
    refreshNotifications () {
      dispatch({ type: 'app/queryRefreshNotifications' })
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
    menu,
    changeRole (roleCode) {
      dispatch({ type: 'app/query', payload: { userid: user.userid, role: roleCode } })
    }
  }
  if (openPages && openPages.includes(pathname)) {
    return (<div>
      <Loader spinning={loading.effects['app/query']} />
      {children}
    </div>)
  }

  const homeNotification = {
    title: 'dmiPOS',
    options: {
      body: 'Thankyou for subcribe us!',
      icon: <ButtonIcon />,
      lang: 'en'
    }
  }

  const notificationProps = {
    homeTitle: homeNotification.title,
    homeOptions: homeNotification.options,
    ignore,
    timeout: 5000,
    askAgain: true,
    onPermissionDenied () {
      dispatch({ type: 'app/permissionDenied' })
      console.log('permission denied!')
    },
    onPermissionGranted () {
      dispatch({ type: 'app/permissionGranted' })
      console.log('permission granted!')
    },
    notSupported () {
      dispatch({ type: 'app/permissionDenied' })
      console.log('Web Notification not Supported')
    }
  }

  return (
    <div>
      <Helmet>
        <title>{configMain.name}</title>
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
                {loading.effects['app/query'] ? <Loader spinning={loading.effects['app/query']} /> :
                  hasPermission ? children : <Error />}
              </div>
            </div>
            <Footer />
          </div>
        </LocaleProvider>
        <Notification {...notificationProps} />
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
