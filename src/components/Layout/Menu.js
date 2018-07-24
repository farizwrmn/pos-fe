import React from 'react'
import PropTypes from 'prop-types'
import { Menu, Icon, message } from 'antd'
import { Link } from 'dva/router'
import { arrayToTree, queryArray, lstorage } from 'utils'
import pathToRegexp from 'path-to-regexp'

const Menus = ({ siderFold, sidebarColor, darkTheme, handleClickNavMenu, navOpenKeys, changeOpenKeys, menu }) => {
  const noStoreMessage = (type) => {
    if (type === 'info') {
      message.info('There is no store selected.\nPlease contact your IT.')
    } else {
      message.warning('There is no store selected.\nPlease contact your IT.')
    }
  }

  let textColor = sidebarColor === '#FFFFFF' ? '#444' : '#f4f5f7'
  let selectedMenu = '#ecf6fd'
  let hoverColor = '#108ee9'
  switch (sidebarColor) {
    case '#FFFFFF':
      selectedMenu = '#ecf6fd'
      break
    case '#3E3E3E':
      selectedMenu = '#494949'
      break
    case '#5A87b5':
      selectedMenu = '#83a4c6'
      hoverColor = '#444'
      break
    default:
  }

  let menuStyle = document.createElement('style')
  menuStyle.innerHTML = `.parent-wrapper,
                          .parent {
                            background-color: ${sidebarColor};
                            color: ${textColor};
                          }
                          .parent > div:hover,
                          .child > div:hover {
                            color: ${hoverColor};
                          }
                          .child {
                            background-color: ${sidebarColor};
                            color: ${textColor};
                          }
                          .ant-menu:not(.ant-menu-horizontal) .ant-menu-item-selected {
                            background-color: ${selectedMenu};
                          }
                          .ant-menu-item > a {
                            color: ${textColor};
                          }
                          .ant-menu-item > a:hover {
                            color: ${hoverColor};
                          }`
  document.head.appendChild(menuStyle)

  // 生成树状 - Generate a tree
  const menuTree = arrayToTree(menu.filter(_ => _.mpid !== '-1').sort((x, y) => x.menuId - y.menuId), 'menuId', 'mpid')
  const levelMap = {}

  // 递归生成菜单 - Generate a tree
  const getMenus = (menuTreeN, siderFoldN) => {
    return menuTreeN.map((item) => {
      if (item.children) {
        if (item.mpid) {
          levelMap[item.menuId] = item.mpid
        }
        return (
          <Menu.SubMenu className={!item.bpid ? 'parent' : 'child'}
            key={item.menuId}
            title={<span>
              {item.icon && <Icon type={item.icon} />}
              {(!siderFoldN || !menuTree.includes(item)) && item.name}
            </span>}
          >
            {getMenus(item.children, siderFoldN)}
          </Menu.SubMenu>
        )
      }
      return (
        <Menu.Item key={item.menuId} className={!item.bpid ? 'parent' : 'child'}>
          <Link to={item.route}>
            {item.icon && <Icon type={item.icon} />}
            {(!siderFoldN || !menuTree.includes(item)) && item.name}
          </Link>
        </Menu.Item>
      )
    })
  }
  const menuItems = getMenus(menuTree, siderFold)

  // 保持选中 - Keep selected
  const getAncestorKeys = (key) => {
    let map = {}
    const getParent = (index) => {
      const result = [String(levelMap[index])]
      if (levelMap[result[0]]) {
        result.unshift(getParent(result[0])[0])
      }
      return result
    }
    for (let index in levelMap) {
      if ({}.hasOwnProperty.call(levelMap, index)) {
        map[index] = getParent(index)
      }
    }
    return map[key] || []
  }

  const onOpenChange = (openKeys) => {
    // if (isNaN(lstorage.getCurrentUserStore())) {
    //   if (openKeys[1] === '3') {
    //     noStoreMessage('warning')
    //     return
    //   } else {
    //     noStoreMessage('info')
    //   }
    // }
    const latestOpenKey = openKeys.find(key => !navOpenKeys.includes(key))
    const latestCloseKey = navOpenKeys.find(key => !openKeys.includes(key))
    let nextOpenKeys = []
    if (latestOpenKey) {
      nextOpenKeys = getAncestorKeys(latestOpenKey).concat(latestOpenKey)
    }
    if (latestCloseKey) {
      nextOpenKeys = getAncestorKeys(latestCloseKey)
    }
    changeOpenKeys(nextOpenKeys)
  }

  let menuProps = !siderFold ? {
    onOpenChange,
    openKeys: navOpenKeys
  } : {}


  // 寻找选中路由 - Find the selected route
  let currentMenu
  let defaultSelectedKeys
  for (let item of menu) {
    if (item.route && pathToRegexp(item.route).exec(location.pathname)) {
      currentMenu = item
      break
    }
  }
  const getPathArray = (array, current, pid, menuId) => {
    let result = [String(current[menuId])]
    const getPath = (item) => {
      if (item && item[pid]) {
        result.unshift(String(item[pid]))
        getPath(queryArray(array, item[pid], menuId))
      }
    }
    getPath(current)
    return result
  }
  if (currentMenu) {
    // console.log('mpid', currentMenu.mpid, typeof currentMenu.mpid)
    if (isNaN(lstorage.getCurrentUserStore())) {
      if (currentMenu.mpid === '3') {
        noStoreMessage('warning')
        defaultSelectedKeys = ['1']
        // return
      } else {
        noStoreMessage('info')
        defaultSelectedKeys = getPathArray(menu, currentMenu, 'mpid', 'menuId')
      }
    }
    // defaultSelectedKeys = getPathArray(menu, currentMenu, 'mpid', 'menuId')
    // console.log('defaultSelectedKeys',defaultSelectedKeys)
  }

  return (
    <Menu className="parent-wrapper"
      {...menuProps}
      mode={siderFold ? 'vertical' : 'inline'}
      theme={darkTheme ? 'dark' : 'primary'}
      onClick={handleClickNavMenu}
      inlineCollapsed={siderFold}
      defaultSelectedKeys={defaultSelectedKeys}
    >
      {menuItems}
    </Menu>
  )
}

Menus.propTypes = {
  menu: PropTypes.array,
  siderFold: PropTypes.bool,
  darkTheme: PropTypes.bool,
  isNavbar: PropTypes.bool,
  handleClickNavMenu: PropTypes.func,
  navOpenKeys: PropTypes.array,
  changeOpenKeys: PropTypes.func
}

export default Menus
