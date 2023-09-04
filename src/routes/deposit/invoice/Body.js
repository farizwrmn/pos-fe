import React from 'react'
import styles from './index.less'
import BodyItem from './BodyItem'
import BodySummary from './BodySummary'

const Body = ({
  list,
  invoiceSummary
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
      <div className={styles.borderedSection}>
        <BodySummary invoiceSummary={invoiceSummary} />
      </div>
    </div>
  )
}

export default Body
