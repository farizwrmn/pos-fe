import React from 'react'
import {
  BALANCE_TYPE_CLOSING,

  TYPE_SALES,
  TYPE_PETTY_CASH,
  TYPE_CONSIGNMENT
} from 'utils/variable'
import BalanceItem from './BalanceItem'

import styles from './index.less'

const filterAndSum = (item, type, dataSource) => {
  const transaction = dataSource
    .filter(filtered => filtered.type === type && filtered.paymentOptionId === item.id && filtered.balanceType === BALANCE_TYPE_CLOSING)
    .reduce((prev, next) => prev + next.balanceIn, 0)
  return transaction
}

const BalanceDetail = ({
  listOpts,
  dataSource
}) => {
  return (
    <div>
      {listOpts && listOpts.filter((filtered) => {
        const sales = filterAndSum(filtered, TYPE_SALES, dataSource)
        const cash = filterAndSum(filtered, TYPE_PETTY_CASH, dataSource)
        const consignment = filterAndSum(filtered, TYPE_CONSIGNMENT, dataSource)
        return sales > 0 || cash > 0 || consignment > 0
      }).map((item) => {
        const sales = filterAndSum(item, TYPE_SALES, dataSource)
        const cash = filterAndSum(item, TYPE_PETTY_CASH, dataSource)
        const consignment = filterAndSum(item, TYPE_CONSIGNMENT, dataSource)
        return (
          <div>
            <div className={styles.left}>{`${item.typeName} (${item.typeCode}):`}</div>
            <BalanceItem sales={sales} cash={cash} consignment={consignment} item={item} dataSource={dataSource} />
          </div>
        )
      })}
    </div>
  )
}

export default BalanceDetail
