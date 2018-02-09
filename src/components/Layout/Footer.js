import React from 'react'
import PropTypes from 'prop-types'
import { config } from 'utils'
import styles from './Footer.less'

// const Footer = () => <div className={styles.footer}>
//   {config.footerText}
// </div>

const Footer = ({ otherClass }) => {
  return (
    <div className={`${styles.footer} ${otherClass}`}>
      <span>{`${config.footerText} - ${config.footerSubText}`}</span>
      {/* <span>{config.footerSubText}</span> */}
    </div>
  )
}

Footer.propTypes = {
  otherClass: PropTypes.string
}

export default Footer
