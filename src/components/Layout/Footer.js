import React from 'react'
import PropTypes from 'prop-types'
import styles from './Footer.less'
import { config } from 'utils'

// const Footer = () => <div className={styles.footer}>
//   {config.footerText}
// </div>

const Footer = ({ otherClass }) => {
  return (<div className={`${styles.footer} ${otherClass}`}>
    {config.footerText}
  </div>)
}

Footer.propTypes = {
  otherClass: PropTypes.string,
}

export default Footer
