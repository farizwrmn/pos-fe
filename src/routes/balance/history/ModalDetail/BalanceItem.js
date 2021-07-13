import React from 'react'
import {
  currencyFormatter
} from 'utils/string'
import styles from './index.less'

const BalanceItem = ({
  sales,
  cash,
  consignment
}) => {
  return (
    <div>
      <div className={styles.right}>{`Sales: ${currencyFormatter(sales)}`}</div>
      <div className={styles.right}>{`Petty Cash: ${currencyFormatter(cash)}`}</div>
      <div className={styles.right}>{`Consignment: ${currencyFormatter(consignment)}`}</div>
    </div>
  )
}

export default BalanceItem
