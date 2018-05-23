import React from 'react'
import PropTypes from 'prop-types'
import { Icon, Tooltip, Popover } from 'antd'
import { Link } from 'dva/router'
import styles from './HeaderMenu.less'

const HeaderMenu = ({ prompt, icon, addClass, separator, onClick, clickRoute, popContent, total, showPopOver, handleVisibleChange }) => {
  const content = (
    <div classNames={styles.menuContent}>
      {popContent}
    </div>
  )
  const childComp = (
    <Tooltip placement="leftBottom" title={prompt}>
      <div className={separator ? styles.void : `${styles.button} ${styles[addClass || prompt]}`} onClick={onClick}>
        <Link to={clickRoute}>
          <Icon type={icon || prompt} />
          {prompt === 'calendar' && total > 0 &&
            <span className={styles.badgeStyle}>{total > 99 ? '99+' : total}</span>
          }
          {prompt === 'notification' && total > 0 &&
            <span className={styles.badgeStyle}>{total > 99 ? '99+' : total}</span>}
        </Link>
      </div>
    </Tooltip>
  )

  let parentComp = <Popover content={content} trigger="click">{childComp}</Popover>
  if (prompt === 'calendar' || prompt === 'notification') {
    parentComp = <Popover visible={showPopOver} onVisibleChange={handleVisibleChange} content={content} trigger="click">{childComp}</Popover>
  }

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
  popContent: PropTypes.array
}

export default HeaderMenu
