import React from 'react'
import PropTypes from 'prop-types'
import styles from './HeaderMenu.less'
import { Icon, Tooltip, Popover } from 'antd'
import { Link } from 'dva/router'

const HeaderMenu = ({ prompt, icon, addClass, separator, onClick, clickRoute, popContent }) => {
  const content = (
    <div style={{ width: 290, border: '0px', borderRadius: 4 }}>
      {popContent}
    </div>
  )
  const childComp = (
    <Tooltip placement='bottomLeft' title={prompt}>
      <div className={separator ? styles.void : styles.button + ' ' + styles[addClass || prompt]} onClick={onClick}>
        <Link to={clickRoute}>
          <Icon type={icon || prompt} />
        </Link>
      </div>
    </Tooltip>
  )
  const parentComp = (
    <Popover content={content} trigger='click'>
      {childComp}
    </Popover>
  )
  return (
    <div>
      {popContent ? parentComp : childComp}
    </div>
  )
}

HeaderMenu.propTypes = {
  prompt: PropTypes.string,
  icon: PropTypes.string,
  addClass: PropTypes.string,
  separator: PropTypes.bool,
  onClick: PropTypes.func,
  clickRoute: PropTypes.string,
  popContent: PropTypes.array,
}

export default HeaderMenu
