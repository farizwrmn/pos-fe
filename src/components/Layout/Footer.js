import React from 'react'
import PropTypes from 'prop-types'
import styles from './Footer.less'
import { config } from 'utils'
import { Popover, Button } from 'antd'
import Info from 'components/Layout/Info'

// const Footer = () => <div className={styles.footer}>
//   {config.footerText}
// </div>

const Footer = ({ otherClass }) => {
  return (
    <div className={`${styles.footer} ${otherClass}`}>
      <span>{config.footerText + ' - ' + config.footerSubText}</span>
      {/*<span>{config.footerSubText}</span>*/}
      {!otherClass ?
        <Popover placement='rightBottom' content={<div><Info/></div>} >
          <Button className={styles.info} type='dashed' shape='circle' icon='info'/>
        </Popover>
        : ''
      }

    </div>
  )
}

Footer.propTypes = {
  otherClass: PropTypes.string,
}

export default Footer
