import React from 'react'
import {
  BALANCE_TYPE_AWAL,
  BALANCE_TYPE_CLOSING,
  BALANCE_TYPE_TRANSACTION,

  TYPE_SALES,
  TYPE_PETTY_CASH,
  TYPE_CONSIGNMENT
} from 'utils/variable'
import {
  currencyFormatter
} from 'utils/string'
import styles from './index.less'

const filterAndSum = (item, type, dataSource) => {
  const awal = dataSource
    .filter(filtered => filtered.type === type && filtered.paymentOptionId === item.id && filtered.balanceType === BALANCE_TYPE_AWAL)
    .reduce((prev, next) => prev + next.balanceIn, 0)
  const sales = dataSource
    .filter(filtered => filtered.type === type && filtered.paymentOptionId === item.id && filtered.balanceType === BALANCE_TYPE_TRANSACTION)
    .reduce((prev, next) => prev + next.balanceIn, 0)
  const transaction = dataSource
    .filter(filtered => filtered.type === type && filtered.paymentOptionId === item.id && filtered.balanceType === BALANCE_TYPE_CLOSING)
    .reduce((prev, next) => prev + next.balanceIn, 0)
  return ((awal + sales) - transaction) - (item.typeCode === 'C' ? awal : 0)
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
      <div className={styles.right}>{sales ? `Sales: ${currencyFormatter(sales)}` : null}</div>
      <div className={styles.right}>{cash ? `Petty Cash: ${currencyFormatter(cash)}` : null}</div>
      <div className={styles.right}>{consignment ? `Consignment: ${currencyFormatter(consignment)}` : null}</div>
    </div>
  )
}

export default BalanceItem
