import React from 'react'
import styles from './index.less'

const User = ({ user }) => {
  return (
    <div>
      <img className={styles.user} src="./no-user.png" alt="user" />
      <h2>{user.username}</h2>
    </div>
  )
}
export default User
