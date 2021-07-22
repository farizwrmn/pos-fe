import React from 'react'
import {
  currencyFormatter
} from 'utils/string'
import styles from './index.less'

const BalanceItem = ({
  sales,
  consignment,
  cash
}) => {
  return (
    <div>
      <div className={styles.right} style={{ color: sales ? 'red' : '' }}>{sales ? `Sales: ${currencyFormatter(sales)}` : null}</div>
      <div className={styles.right} style={{ color: cash ? 'red' : '' }}>{cash ? `Petty Cash: ${currencyFormatter(cash)}` : null}</div>
      <div className={styles.right} style={{ color: consignment ? 'red' : '' }}>{consignment ? `Consignment: ${currencyFormatter(consignment)}` : null}</div>
    </div>
  )
}

export default BalanceItem
