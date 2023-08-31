import React from 'react'
import styles from './index.less'
import BodyItem from './BodyItem'

const Body = ({
  list
}) => {
  return (
    <div>
      <div className={styles.borderedSection}>
        {list && list.length > 0 && list.map((record) => {
          return (
            <BodyItem item={record} />
          )
        })}
      </div>
    </div>
  )
}

export default Body
