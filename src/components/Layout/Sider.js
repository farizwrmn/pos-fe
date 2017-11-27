import React from 'react'
import PropTypes from 'prop-types'
import { Icon, Switch, Cascader } from 'antd'
import styles from './Layout.less'
import { config } from 'utils'
import Menus from './Menu'

const { prefix } = config

const Sider = ({ siderFold, darkTheme, location, changeRole, navOpenKeys, switchSider, changeOpenKeys, menu }) => {
  const menusProps = {
    menu,
    siderFold,
    darkTheme,
    location,
    navOpenKeys,
    changeOpenKeys,
  }

  let defaultRole =''
  const localId = localStorage.getItem(`${prefix}uid`)
  if (localId && localId.indexOf("#") > -1) {
    defaultRole = localId.split(/[# ]+/).pop()
  }

  const handleChange = (value) => {
    console.log(value)
    const a=localStorage.getItem(`${prefix}uid`)
    console.log(a)
    const b=a.split('#')
    console.log(b)
    const c=b[0]+'#'+b[1]+'#'+value
    console.log(c)
    localStorage.setItem(`${prefix}uid`,c)
    changeRole(value.toString())
  }

  return (
    <div>
      <div className={styles.logo}>
        <img alt={'logo'} src={config.logo} />
        {siderFold ? '' : <span>{config.name}</span>}
      </div>
      <div className={styles.switchstore}>
      </div>
      <Menus {...menusProps} />
      {!siderFold ?
        <div className={styles.switchrole}>
          <Cascader options={JSON.parse(localStorage.getItem(`${prefix}uRole`))}
                    onChange={handleChange} changeOnSelect
                    defaultValue={[defaultRole]} placeholder="Switch Role"/>
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
