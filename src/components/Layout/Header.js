import React from 'react'
import PropTypes from 'prop-types'
import { Menu, Icon, Popover, Calendar } from 'antd'
import styles from './Header.less'
import Menus from './Menu'
import HeaderMenu from './HeaderMenu'
import ShortcutKey from './ShortcutKey'
import ChangePw from './ChangePassword'

const SubMenu = Menu.SubMenu

const Header = ({ user, logout, switchSider, siderFold, isNavbar, menuPopoverVisible,
  visibleItem, visiblePw, handleShortcutKeyShow, handleShortcutKeyHide,
  handleChangePwShow, handleChangePwHide, handleTogglePw, handleSave,
  location, switchMenuPopover, navOpenKeys, changeOpenKeys, menu
}) => {
  let handleClickMenu = (e) => {
    e.key === 'logout' && logout()
    e.key === 'password' && handleChangePwShow()
  }

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
      handleSave(data)
    },
  }
  return (
    <div className={styles.header}>
      {isNavbar
        ? <Popover placement="bottomLeft" onVisibleChange={switchMenuPopover} visible={menuPopoverVisible} overlayClassName={styles.popovermenu} trigger="click" content={<Menus {...menusProps} />}>
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
        <HeaderMenu prompt="calendar" popContent={<Calendar fullscreen={false} />} />
        <HeaderMenu prompt="change theme" icon="bulb" />
        <HeaderMenu prompt="shortcut key" icon="key" onClick={handleShortcutKeyShow} addClass="shortcut" />
        <HeaderMenu prompt="notification" icon="bell" />
        <HeaderMenu separator={true} />
        <HeaderMenu prompt="pos" icon="barcode" clickRoute="/transaction/pos" />
        <HeaderMenu prompt="profit" icon="like-o" />
        <HeaderMenu prompt="alert quantity" icon="exclamation-circle-o" addClass="alert" />
        <HeaderMenu separator={true} />

        {visibleItem.shortcutKey && <ShortcutKey {...shortcutProps} />}
        {visibleItem.changePw && <ChangePw  {...changePwProps} />}

        <Menu mode="horizontal" onClick={handleClickMenu}>
          <SubMenu
            style={{
              float: 'right',
            }}
            title={<span> <Icon type="user" />
              {user.username} </span>}
          >
            <Menu.Item key="logout">
              Sign out
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item key="password">
              Change Password
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
