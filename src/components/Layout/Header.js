import React from 'react'
import PropTypes from 'prop-types'
import { Menu, Icon, Popover, Calendar, Button, Row, Col } from 'antd'
import { classnames, lstorage } from 'utils'
import { Link } from 'dva/router'
import moment from 'moment'
import styles from './Header.less'
import Menus from './Menu'
import HeaderMenu from './HeaderMenu'
import ShortcutKey from './ShortcutKey'
import ChangePw from './ChangePassword'
import ChangeTotp from './ChangeTotp'
import BirthdayList from './BirthdayList'

const SubMenu = Menu.SubMenu

const Header = ({ user, logout, switchSider, siderFold, isNavbar,
  menuPopoverVisible, visibleItem, visiblePw, visibleTotp, handleShortcutKeyShow,
  handleShortcutKeyHide, handleMyProfileShow, handleChangePwShow, handleChangePwHide, handleTogglePw, handleSavePw,
  handleChangeTotpShow, handleChangeTotpHide, handleSaveTotp, totp,
  handleRegenerateTotp, modalSwitchChange, totpChecked,
  location, switchMenuPopover, navOpenKeys, changeOpenKeys, menu,
  selectedDate, selectedMonth, showBirthDayListModal, hideBirthDayListModal, changeCalendarMode,
  listTotalBirthdayPerDate, listCustomerBirthday, calendarMode, listNotification, listNotificationDetail, showPopOverCalendar, showPopOverNotification,
  refreshNotifications, defaultSidebarColor, changeSiderColor, sidebarColor
}) => {
  let handleClickMenu = (e) => {
    e.key === 'logout' && logout(lstorage.getSessionId())
    e.key === 'myprofile' && handleMyProfileShow()
    e.key === 'password' && handleChangePwShow()
    e.key === 'totp' && handleChangeTotpShow(user.userid)
  }

  // menu prop
  const menusProps = {
    menu,
    sidebarColor,
    siderFold: false,
    darkTheme: false,
    isNavbar,
    handleClickNavMenu: switchMenuPopover,
    location,
    navOpenKeys,
    changeOpenKeys
  }

  const shortcutProps = {
    visible: visibleItem.shortcutKey,
    onCancel () {
      handleShortcutKeyHide()
    }
  }
  const changePwProps = {
    visible: visibleItem.changePw,
    visiblePw,
    onCancel () {
      handleChangePwHide()
    },
    onTogglePw () {
      handleTogglePw()
    },
    onCancelButton () {
      handleChangePwHide()
    },
    onSaveButton (data) {
      handleSavePw(data)
    }
  }
  const changeTotpProps = {
    user,
    totp,
    visible: visibleItem.changeTotp,
    visiblePw: visibleTotp,
    onCancel () {
      handleChangeTotpHide()
    },
    onCancelButton () {
      handleChangeTotpHide()
    },
    onSaveTotpButton (userId, data) {
      handleSaveTotp(userId, data)
    },
    onRegenerateTotp () {
      handleRegenerateTotp(user.userid)
    },
    modalSwitchChange,
    totpChecked
  }

  const getListData = (value) => {
    let listData
    for (let key in listTotalBirthdayPerDate) {
      switch (value.format('MM-DD')) {
        case `${selectedMonth}-${listTotalBirthdayPerDate[key].birthDate}`:
          listData = [
            { style: styles.badgeStyleDate, content: listTotalBirthdayPerDate[key].counter }
          ]; break
        default:
      }
    }
    return listData || []
  }

  const dateCellRender = (value) => {
    const listData = getListData(value)
    return (
      listData.map(item => (
        <span className={item.style}>{item.content}</span>
      ))
    )
  }

  const calendarProps = {
    fullscreen: false,
    dateCellRender,
    onSelect (value) {
      showBirthDayListModal(value)
    },
    onPanelChange (value, mode) {
      const month = moment(value).format('MM')
      changeCalendarMode(month, mode)
    },
    disabledDate (current) {
      return current < moment().endOf('day')
    }
  }
  const date = calendarMode === 'month' ? moment(new Date(selectedDate)).format('MMMM, Do YYYY') : moment(new Date(selectedDate)).format('MMMM, YYYY')

  const displayBirthdayProps = {
    visible: visibleItem.displayBirthdate,
    footer: [],
    content: listCustomerBirthday,
    title: `Birthday List on ${date}`,
    onCancel () {
      hideBirthDayListModal()
    }
  }

  let notifications = []
  if (listNotification.length) {
    notifications.push(listNotificationDetail.map(notification => (<li>
      <Link to={notification.route}
        className={styles.notifications}
      >
        <span className={styles.list_notifications_badge}>{notification.counter > 99 ? '99+' : notification.counter}</span>
        <span>{notification.notificationName}</span>
      </Link>
    </li>)))
    notifications.push(<li style={{ borderTop: '1px solid #d0d0d0' }}><Button size="small" className={styles.refresh} onClick={refreshNotifications}>Refresh</Button></li>)
  }

  const calendarPopOver = {
    showPopOver: visibleItem.showPopOverCalendar,
    handleVisibleChange: showPopOverCalendar
  }

  const notificationPopOver = {
    showPopOver: visibleItem.showPopOverNotification,
    handleVisibleChange: showPopOverNotification
  }

  let totalBirhtday = 0
  let totalNotification = 0
  for (let i = 0; i < listNotification.length; i += 1) {
    switch (listNotification[i].info) {
      case 'bday':
        totalBirhtday = listNotification[i].counter
        break
      case 'notif':
        totalNotification = listNotification[i].counter
        break
      default:
    }
  }

  let notificationPopContent
  if (totalNotification) {
    notificationPopContent = {
      ...notificationPopOver,
      total: totalNotification,
      popContent: (<ul style={{ width: 150, maxHeight: 200, overflowX: 'hidden' }}>{notifications}</ul>)
    }
  }

  const changeColor = (color) => {
    changeSiderColor(color)
  }

  return (
    <div className={classnames(styles.header, styles.store1)}>
      {isNavbar
        ? <Popover placement="bottomLeft"
          onVisibleChange={switchMenuPopover}
          visible={menuPopoverVisible}
          overlayClassName={styles.popovermenu}
          trigger="click"
          content={<Menus {...menusProps} />}
        >
          <div className={styles.button}>
            <Icon type="bars" />
          </div>
        </Popover>
        : <div className={styles.leftWrapper}>
          <HeaderMenu prompt="toggle menu" icon={siderFold ? 'menu-unfold' : 'menu-fold'} onClick={switchSider} />
        </div>
      }

      <div className={styles.rightWarpper}>
        <HeaderMenu prompt="home" clickRoute="/dashboard" />
        <HeaderMenu prompt="setting" />
        <HeaderMenu prompt="calculator" />
        <HeaderMenu prompt="calendar" {...calendarPopOver} total={totalBirhtday} popContent={<Calendar {...calendarProps} />} />
        <HeaderMenu prompt="change theme"
          icon="bulb"
          popContent={
            // <Switch onChange={changeTheme}
            //   defaultChecked={darkTheme}
            //   checkedChildren={<Icon type="bulb" />}
            //   unCheckedChildren={<Icon type="eye" style={{ color: '#000' }} />}
            // />
            <Row style={{ width: 100, textAlign: 'center' }}>
              <Col span={8}>
                <Button onClick={() => changeColor('#FFFFFF')} size="small" style={{ backgroundColor: '#FFFFFF', width: 20, borderColor: defaultSidebarColor === '#FFFFFF' ? '#108ee9' : '' }} />
              </Col>
              <Col span={8}>
                <Button onClick={() => changeColor('#3E3E3E')} size="small" style={{ backgroundColor: '#3E3E3E', width: 20, borderColor: defaultSidebarColor === '#3E3E3E' ? '#108ee9' : '' }} />
              </Col>
              <Col span={8}>
                <Button onClick={() => changeColor('#5A87b5')} size="small" style={{ backgroundColor: '#5A87b5', width: 20, borderColor: defaultSidebarColor === '#5A87b5' ? '#108ee9' : '' }} />
              </Col>
            </Row>
          }
        />
        <HeaderMenu prompt="shortcut key" icon="key" onClick={handleShortcutKeyShow} addClass="shortcut" />
        <HeaderMenu prompt="notification"
          icon="bell"
          {...notificationPopContent}
        />
        <HeaderMenu separator />
        <HeaderMenu prompt="pos" icon="barcode" clickRoute="/transaction/pos" />
        <HeaderMenu prompt="profit" icon="like-o" />
        <HeaderMenu prompt="alert quantity" icon="exclamation-circle-o" addClass="alert" />
        <HeaderMenu separator />

        {visibleItem.shortcutKey && <ShortcutKey {...shortcutProps} />}
        {visibleItem.changePw && <ChangePw {...changePwProps} />}
        {visibleItem.changeTotp && <ChangeTotp {...changeTotpProps} />}
        {visibleItem.displayBirthdate && <BirthdayList {...displayBirthdayProps} />}

        <Menu mode="horizontal" onClick={handleClickMenu}>
          <SubMenu
            style={{
              float: 'right'
            }}
            title={<span> <Icon type="user" />
              {user.username} </span>}
          >
            <Menu.Item key="myProfile">
              My Profile
              <Link to="/user_profile" />
            </Menu.Item>
            {/* <Menu.Item key="password">
              Change Password
            </Menu.Item>
            <Menu.Item key="totp">
              {`${user.totp ? 'Change' : 'Enable'} TOTP`}
            </Menu.Item> */}
            <Menu.Divider />
            <Menu.Item key="logout">
              Sign out
            </Menu.Item>
          </SubMenu>
        </Menu>
      </div>
    </div>
  )
}

Header.propTypes = {
  menu: PropTypes.array,
  user: PropTypes.object,
  logout: PropTypes.func,
  switchSider: PropTypes.func,
  siderFold: PropTypes.bool,
  isNavbar: PropTypes.bool,
  menuPopoverVisible: PropTypes.bool,
  location: PropTypes.object,
  switchMenuPopover: PropTypes.func,
  navOpenKeys: PropTypes.array,
  changeOpenKeys: PropTypes.func
}

export default Header
