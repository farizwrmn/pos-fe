import React from 'react'
import PropTypes from 'prop-types'
import { Icon, Cascader, Tooltip } from 'antd'
import { lstorage } from 'utils'
// import moment from 'moment'
import styles from './Layout.less'
import Menus from './Menu'
import DateTime from './DateTime'

const Sider = ({ siderFold, sidebarColor, darkTheme, location, changeRole, navOpenKeys, switchSider, changeOpenKeys, menu }) => {
  const menusProps = {
    sidebarColor,
    menu,
    siderFold,
    darkTheme,
    location,
    navOpenKeys,
    changeOpenKeys
  }

  // user role
  const listUserRoles = lstorage.getListUserRoles()
  const defaultRole = lstorage.getCurrentUserRole()

  // user company
  const companyName = lstorage.getCompanyName()
  // login time
  const loginTime = lstorage.getLoginTime()
  const loginTimeDiff = lstorage.getLoginTimeDiff()
  // const todayDateTime = new Date(moment.utc(loginTime).format('DD-MMM-YYYY HH:mm:ss'))
  // user store
  // const listUserStores = lstorage.getListUserStores()
  // const defaultStore = lstorage.getCurrentUserStore()
  const defaultStoreName = lstorage.getCurrentUserStoreName()
  const defaultStoreColor = (defaultStoreName === '>> No Store <<') ? { color: styles.colorred, backgroundColor: styles.colorgrey } : { backgroundColor: styles.colorgrey }

  const handleChangeRole = (value) => {
    const localId = lstorage.getStorageKey('udi')
    const dataUdi = [
      localId[1],
      value.toString(),
      localId[3],
      localId[4],
      localId[5],
      localId[6],
      localId[7]
    ]
    lstorage.putStorageKey('udi', dataUdi, localId[0])
    changeRole(value.toString())
  }

  // const handleChangeStore = (value) => {
  //   const localId = lstorage.getStorageKey('udi')
  //   const serverTime = moment(new Date()).subtract(loginTimeDiff, 'milliseconds').toDate()
  //   lstorage.putStorageKey('udi', [localId[1], localId[2], value.toString(), localId[4], moment(new Date(serverTime)), localId[6]], localId[0])
  //   changeRole(value.toString())
  //   setTimeout(() => { window.location.reload() }, 1000)
  // }

  const loopLogo = () => {
    let i
    let logo4 = []
    for (i = 0; i < 5; i += 1) {
      logo4.push(<span key={i}><img alt={'logo'} src={`/logo${lstorage.getIdBE()}.png`} style={{ float: 'center', height: '20px', width: '20px' }} /></span>)
    }
    return (logo4)
  }

  return (
    <div>
      <div className={styles.logo}>
        <div className={styles.verticalFlip}>
          {siderFold
            ? <div>{loopLogo()}</div> :
            <div>
              <span><img alt={'logo'} src={`/logo${lstorage.getIdBE()}.png`} style={{ float: 'center', height: '20px', width: '20px' }} /></span>
              <span><DateTime setDate={loginTime} setDateDiff={loginTimeDiff} /></span>
              <span>{companyName}</span>
              <span style={defaultStoreColor}>{defaultStoreName}</span>
              {/* <span>
                <Tooltip placement="right" title={`click to switch current store: \n ${defaultStoreName}`} >
                  <Cascader style={{ width: '100%' }}
                    options={listUserStores}
                    onChange={handleChangeStore}
                    changeOnSelect
                    allowClear={false}
                    defaultValue={[defaultStore]}
                    placeholder="Switch Store"
                  >
                    <a href="/" style={defaultStoreColor}>{defaultStoreName}</a>
                  </Cascader>
                </Tooltip>
              </span> */}
            </div>
          }
        </div>
      </div>
      <Menus {...menusProps} />
      {!siderFold ?
        <div className={styles.switchrole} style={{ backgroundColor: sidebarColor, borderTop: `1px solid ${sidebarColor}` }}>
          <Tooltip placement="top" title="click to switch role">
            <Cascader options={listUserRoles}
              onChange={handleChangeRole}
              changeOnSelect
              allowClear={false}
              defaultValue={[defaultRole]}
              placeholder="Switch Role"
            />
          </Tooltip>
        </div> : ''}
      <div className={styles.siderCollapse} href={switchSider}>
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
  changeOpenKeys: PropTypes.func
}

export default Sider
