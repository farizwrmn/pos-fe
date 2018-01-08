import React from 'react'
import PropTypes from 'prop-types'
import { Icon, Cascader, Tooltip } from 'antd'
import styles from './Layout.less'
import { config } from 'utils'
import Menus from './Menu'
import { crypt, lstorage } from 'utils'

const Sider = ({ siderFold, darkTheme, location, changeRole, navOpenKeys, switchSider, changeOpenKeys, menu }) => {
  const menusProps = {
    menu,
    siderFold,
    darkTheme,
    location,
    navOpenKeys,
    changeOpenKeys,
  }

  // user role
  const listUserRoles = lstorage.getListUserRoles()
  const defaultRole = lstorage.getCurrentUserRole()

  // user store
  const listUserStores = lstorage.getListUserStores()
  const defaultStore = lstorage.getCurrentUserStore()
  const defaultStoreName = lstorage.getCurrentUserStoreName()
  const defaultStoreColor = (defaultStoreName === '>> No Store <<') ? {color: '#ff0000', backgroundColor: '#ff0ff'} : {backgroundColor: '#ff0ff'}

  const handleChangeRole = (value) => {
    const localId = lstorage.getStorageKey('udi')
    lstorage.putStorageKey('udi', [localId[1], value.toString(), localId[3]], localId[0])
    changeRole(value.toString())
  }

  const handleChangeStore = (value) => {
    const localId = lstorage.getStorageKey('udi')
    lstorage.putStorageKey('udi', [localId[1], localId[2], value.toString()], localId[0])
    changeRole(value.toString())
  }

  return (
    <div>
      <div className={styles.company}>
        <img alt={'logo'} src={config.logo} />
        <span>
          master ban
        </span>
      </div>
      <div className={styles.logo}>
        {/*<span>{config.name}</span>*/}
        {siderFold ?
          ''
          :
          <span style={{ textAlign: 'center', width: '100%' }}>
            <Tooltip placement="right" title="click to switch store">
              <Cascader style={{width: '180px'}}
                        options={listUserStores}
                        onChange={handleChangeStore}
                        changeOnSelect allowClear={false}
                        defaultValue={[defaultStore]}
                        placeholder="Switch Store">
                <a href="#" style={defaultStoreColor}>{defaultStoreName}</a>
              </Cascader>
            </Tooltip>
          </span>
        }
      </div>
      <Menus {...menusProps} />
      {!siderFold ?
        <div className={styles.switchrole}>
          <Tooltip placement="top" title="click to switch role">
            <Cascader options={listUserRoles}
                    onChange={handleChangeRole} changeOnSelect allowClear={false}
                    defaultValue={[defaultRole]} placeholder="Switch Role"/>
          </Tooltip>
        </div> : ''}
      <div className={styles.siderCollapse} onClick={switchSider}>
        <Icon type={siderFold ? 'menu-unfold' : 'menu-fold'} />
      </div>
    </div>
  )
}

Sider.propTypes = {
  menu: PropTypes.array,
  siderFold: PropTypes.bool,
  darkTheme: PropTypes.bool,
  location: PropTypes.object,
  changeTheme: PropTypes.func,
  switchSider: PropTypes.func,
  navOpenKeys: PropTypes.array,
  changeOpenKeys: PropTypes.func,
}

export default Sider
