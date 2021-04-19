import React from 'react'
import styles from './index.less'

const Footer = () => {
  return (
    <div>
      <div className={styles.reward}>
        <div>Redeem your reward at</div>
        <div>
          <strong>{window.location.hostname.replace('pos.', 'www.')}</strong>
        </div>
      </div>
      <div className={styles.amountSection}>
        <div>THANK YOU - SEE YOU AGAIN SOON!</div>
      </div>
    </div>
  )
}

export default Footer
