import React from 'react'
import { APPNAME } from 'utils/config.company'
import styles from './index.less'

const Footer = () => {
  return (
    <div>
      {APPNAME === 'k3mart' && (
        <div className={styles.reward}>
          <img src="/invoice-k3mart-footer-20231007.jpg" width="100%" alt="" />
        </div>
      )}
    </div>
  )
}

export default Footer
