import React from 'react'
import BalanceItem from './BalanceItem'

import styles from './index.less'

const BalanceDetail = ({
  listOpts,
  dataSource
}) => {
  return (
    <div>
      {listOpts && listOpts.map(item => (
        <div>
          <div className={styles.left}>{`${item.typeName} (${item.typeCode}):`}</div>
          <BalanceItem item={item} dataSource={dataSource} />
        </div>
      ))}
    </div>
  )
}

export default BalanceDetail
