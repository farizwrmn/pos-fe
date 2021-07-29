import React from 'react'
import PropTypes from 'prop-types'
import { Icon, Tooltip, Popover } from 'antd'
import { Link } from 'dva/router'
import styles from './HeaderMenu.less'

const HeaderMenu = ({ prompt, title, icon, addClass, separator, onClick, clickRoute, popContent, total, showPopOver, handleVisibleChange }) => {
  const content = (
    <div classNames={styles.menuContent}>
      {popContent}
    </div>
  )
  const childComp = (
    <Link to={clickRoute} className={styles.link}>
      <Tooltip placement="leftBottom" title={prompt}>
        <div data-count={total > 99 ? '99+' : total}
          className={separator ?
            styles.void :
            (((prompt === 'calendar' || prompt === 'notification') && total > 0) ? `${styles.button} ${styles[addClass || prompt]} ${styles.badgeStyle}` : `${styles.button} ${styles[addClass || prompt]}`)}
          onClick={onClick}
        >
          <Icon type={icon || prompt} />
          {title && <span style={{ marginLeft: '5px' }}>{title}</span>}
        </div>
      </Tooltip>
    </Link>
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
