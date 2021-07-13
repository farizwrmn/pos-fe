import React from 'react'
import BalanceSummaryItem from './BalanceSummaryItem'

import styles from './index.less'

const BalanceSummary = ({
  listOpts,
  dataSource
}) => {
  return (
    <div>
      {listOpts && listOpts.map((item) => {
        return (
          <div>
            <div className={styles.left}>{`${item.typeName} (${item.typeCode}):`}</div>
            <BalanceSummaryItem item={item} dataSource={dataSource} />
          </div>
        )
      })}
    </div>
  )
}

export default BalanceSummary
