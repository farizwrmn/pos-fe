import React from 'react'
import styles from './index.less'

const BalanceUser = ({
  item
}) => {
  return (
    <div>
      <div>
        <div className={styles.left}>{`Store: ${item && item.store ? item.store.storeName : ''}`}</div>
        <div className={styles.left}>{`User: ${item && item.user ? item.user.fullName : ''}`}</div>
        <div className={styles.left}>{`Approve By: ${item && item.approveUser ? item.approveUser.fullName : ''}`}</div>
        <div className={styles.left}>{`Closed: ${item && item.closed ? item.closed : '-'}`}</div>
        <div className={styles.left}>{`Description: ${item && item.description ? item.description : ''}`}</div>
      </div>
    </div>
  )
}

BalanceUser.propTypes = {

}

export default BalanceUser
