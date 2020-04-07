import React from 'react'
import {
  BALANCE_TYPE_CLOSING,

  TYPE_SALES,
  TYPE_PETTY_CASH,
  TYPE_CONSIGNMENT
} from 'utils/variable'
import {
  currencyFormatter
} from 'utils/string'
import styles from './index.less'

const filterAndSum = (item, type, dataSource) => {
  const transaction = dataSource
    .filter(filtered => filtered.type === type && filtered.paymentOptionId === item.id && filtered.balanceType === BALANCE_TYPE_CLOSING)
    .reduce((prev, next) => prev + next.balanceIn, 0)
  return transaction
}

const BalanceItem = ({
  item,
  dataSource
}) => {
  const sales = filterAndSum(item, TYPE_SALES, dataSource)
  const cash = filterAndSum(item, TYPE_PETTY_CASH, dataSource)
  const consignment = filterAndSum(item, TYPE_CONSIGNMENT, dataSource)

  return (
    <div>
      <div className={styles.right}>{`Sales: ${currencyFormatter(sales)} (Closing - By input)`}</div>
      <div className={styles.right}>{`Petty Cash: ${currencyFormatter(cash)} (Closing - By input)`}</div>
      <div className={styles.right}>{`Consignment: ${currencyFormatter(consignment)} (Closing - By input)`}</div>
    </div>
  )
}

export default BalanceItem
