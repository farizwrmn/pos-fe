import React from 'react'
import PropTypes from 'prop-types'
import { Menu, Icon, Popover, Calendar, Switch, Cascader } from 'antd'
import { Link } from 'dva/router'
import styles from './Header.less'
import Menus from './Menu'
import HeaderMenu from './HeaderMenu'
import ShortcutKey from './ShortcutKey'
import ChangePw from './ChangePassword'
import ChangeTotp from './ChangeTotp'
import { classnames, lstorage } from 'utils'

const SubMenu = Menu.SubMenu

const Header = ({ user, logout, changeTheme, darkTheme, switchSider, siderFold, isNavbar,
                  menuPopoverVisible, visibleItem, visiblePw, visibleTotp, handleShortcutKeyShow,
                  handleShortcutKeyHide, handleMyProfileShow, handleChangePwShow, handleChangePwHide, handleTogglePw, handleSavePw,
                  handleTotpLoad, handleChangeTotpShow, handleChangeTotpHide, handleSaveTotp, totp,
                  handleRegenerateTotp, modalSwitchChange, totpChecked,
                  location, switchMenuPopover, navOpenKeys, changeOpenKeys, menu
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
    siderFold: false,
    darkTheme: false,
    isNavbar,
    handleClickNavMenu: switchMenuPopover,
    location,
    navOpenKeys,
    changeOpenKeys,
  }

  const shortcutProps = {
    visible: visibleItem.shortcutKey,
    onCancel () {
      handleShortcutKeyHide()
    },
  }
  const changePwProps = {
    visible: visibleItem.changePw,
    visiblePw: visiblePw,
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
    },
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

  return (
    <div className={classnames(styles.header,styles.store1)}>
      {isNavbar
        ? <Popover placement="bottomLeft" onVisibleChange={switchMenuPopover}
                   visible={menuPopoverVisible} overlayClassName={styles.popovermenu}
                   trigger="click" content={<Menus {...menusProps} />}>
          <div className={styles.button}>
            <Icon type="bars" />
          </div>
        </Popover>
        : <div className={styles.leftWrapper}>
          <HeaderMenu prompt="toggle menu" icon={siderFold ? 'menu-unfold' : 'menu-fold'} onClick={switchSider} />
        </div>
      }

      <div className={styles.rightWarpper}>
        { !isNavbar &&
        <div style={{ display: 'inherit'}}>
          <HeaderMenu prompt="home" clickRoute="/dashboard" />
          <HeaderMenu prompt="setting" />
          <HeaderMenu prompt="calculator" />
          <HeaderMenu prompt="calendar" popContent={<Calendar fullscreen={false} />} />
          <HeaderMenu prompt="change theme" icon="bulb"
                      popContent={
                        <Switch onChange={changeTheme} defaultChecked={darkTheme}
                                checkedChildren={<Icon type="bulb" />}
                                unCheckedChildren={<Icon type="eye" style={{ color: '#000' }} />}
                        />
                      }
          />
          <HeaderMenu prompt="shortcut key" icon="key" onClick={handleShortcutKeyShow} addClass="shortcut" />
          <HeaderMenu prompt="notification" icon="bell" />
          <HeaderMenu separator={true} />
          <HeaderMenu prompt="pos" icon="barcode" clickRoute="/transaction/pos" />
          <HeaderMenu prompt="profit" icon="like-o" />
          <HeaderMenu prompt="alert quantity" icon="exclamation-circle-o" addClass="alert" />
          <HeaderMenu separator={true} />
        </div>
        }
        {visibleItem.shortcutKey && <ShortcutKey {...shortcutProps} />}
        {visibleItem.changePw && <ChangePw  {...changePwProps} />}
        {visibleItem.changeTotp && <ChangeTotp  {...changeTotpProps} />}

        <Menu mode="horizontal" onClick={handleClickMenu}>
          <SubMenu
            style={{
              float: 'right',
            }}
            title={<span> <Icon type="user" />
              {user.username} </span>}
          >
            <Menu.Item key="myProfile">
              My Profile
              <Link to='/userprofile'></Link>
            </Menu.Item>
            <Menu.Item key="password">
              Change Password
            </Menu.Item>
            <Menu.Item key="totp">
              { (user.totp ? 'Change' : 'Enable') + ' TOTP' }
            </Menu.Item>
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
  changeOpenKeys: PropTypes.func,
}

export default Header
