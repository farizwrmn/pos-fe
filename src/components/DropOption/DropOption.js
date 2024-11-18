import React from 'react'
import PropTypes from 'prop-types'
import { Dropdown, Button, Icon, Menu } from 'antd'

const DropOption = ({ menuName, onMenuClick, menuOptions = [], buttonStyle, dropdownProps }) => {
  let styleMenuItem
  let disabledItem = false
  // const menu = menuOptions.map(item => <Menu.Item key={item.key}>{item.name}</Menu.Item>)
  const menu = menuOptions.map((item) => {
    switch (item.name) {
      case 'Edit':
        styleMenuItem = { color: '#108ee9', background: '#d2eafb', bordercolor: '#d2eafb' }
        break
      case 'Print':
        styleMenuItem = { color: '#108ee9', background: '#d2eafb', bordercolor: '#d2eafb' }
        break
      case 'Delete':
        styleMenuItem = { color: '#f04134', background: '#fcdbd9', bordercolor: '#fcdbd9' }
        disabledItem = item.disabled === undefined ? true : item.undefined
        break
      case 'Void':
        styleMenuItem = { color: '#f04134', background: '#fcdbd9', bordercolor: '#fcdbd9' }
        disabledItem = item.disabled || false
        break
      case 'Password':
        styleMenuItem = { color: '#00a854', background: '#cfefdf', bordercolor: '#cfefdf' }
        break
      default:
        disabledItem = item.disabled || false
        styleMenuItem = {}
        break
    }
    return <Menu.Item disabled={disabledItem} style={styleMenuItem} key={item.key}><Icon type={item.icon} /> {item.name}</Menu.Item>
  })
  return (<Dropdown
    overlay={<Menu onClick={onMenuClick}>{menu}</Menu>}
    {...dropdownProps}
  >
    <Button style={{ border: 'none', ...buttonStyle }}>
      <Icon style={{ marginRight: 2 }} type="bars" />
      {menuName}
      <Icon type="down" />
    </Button>
  </Dropdown>)
}

DropOption.propTypes = {
  onMenuClick: PropTypes.func.isRequired,
  menuOptions: PropTypes.array.isRequired,
  buttonStyle: PropTypes.object.isRequired,
  dropdownProps: PropTypes.object.isRequired,
  menuName: PropTypes.string.isRequired
}

export default DropOption
