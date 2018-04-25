import React from 'react'
import PropTypes from 'prop-types'
import pathToRegexp from 'path-to-regexp'
import moment from 'moment'
import { queryArray, lstorage } from 'utils'
import { Breadcrumb, Icon, Tooltip, Cascader } from 'antd'
import { Link } from 'dva/router'
import styles from './Bread.less'

const Bread = ({ menu, changeRole }) => {
  // user store
  const currentStoreName = lstorage.getCurrentUserStoreName()
  const listUserStores = lstorage.getListUserStores()
  const defaultStore = lstorage.getCurrentUserStore()

  const loginTimeDiff = lstorage.getLoginTimeDiff()

  // 匹配当前路由
  let pathArray = []
  let current
  for (let index in menu) {
    if (menu[index].route && pathToRegexp(menu[index].route).exec(location.pathname)) {
      current = menu[index]
      break
    }
  }

  const getPathArray = (item) => {
    pathArray.unshift(item)
    if (item.bpid) {
      getPathArray(queryArray(menu, item.bpid, 'menuId'))
    }
  }

  if (!current) {
    pathArray.push(menu[0] || {
      id: 1,
      icon: 'laptop',
      name: 'Dashboard'
    })
    pathArray.push({
      id: 404,
      name: 'Not Found'
    })
  } else {
    getPathArray(current)
  }

  // 递归查找父级
  const breads = pathArray.map((item, key) => {
    const content = (
      <span>{item.icon
        ? <Icon type={item.icon} style={{ marginRight: 4 }} />
        : ''}{item.name}</span>
    )
    return (
      <Breadcrumb.Item key={key}>
        {((pathArray.length - 1) !== key)
          ? <Link to={item.route}>
            {content}
          </Link>
          : content}
      </Breadcrumb.Item>
    )
  })

  const handleChangeStore = (value) => {
    const localId = lstorage.getStorageKey('udi')
    const serverTime = moment(new Date()).subtract(loginTimeDiff, 'milliseconds').toDate()
    lstorage.putStorageKey('udi', [localId[1], localId[2], value.toString(), localId[4], moment(new Date(serverTime)), localId[6]], localId[0])
    changeRole(value.toString())
    setInterval(() => { window.location.reload() }, 1000)
  }

  return (
    <div className={styles.bread}>
      <Breadcrumb>
        {/* <div className={styles.currentStore}>{currentStoreName}</div> */}
        <div className={styles.currentStore}>
          <Tooltip placement="right" title={`click to switch current store: \n ${currentStoreName}`} >
            <Cascader style={{ width: '100%' }}
              options={listUserStores}
              onChange={handleChangeStore}
              changeOnSelect
              allowClear={false}
              defaultValue={[defaultStore]}
              placeholder="Switch Store"
            >
              <a href="/">{currentStoreName}</a>
            </Cascader>
          </Tooltip>
        </div>
        {breads}
      </Breadcrumb>
    </div>
  )
}

Bread.propTypes = {
  menu: PropTypes.array
}

export default Bread
