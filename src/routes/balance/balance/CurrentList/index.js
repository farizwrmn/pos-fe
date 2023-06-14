import React from 'react'
import {
  BALANCE_TYPE_AWAL,
  BALANCE_TYPE_TRANSACTION,

  TYPE_SALES,
  TYPE_PETTY_CASH
  // TYPE_CONSIGNMENT
} from 'utils/variable'
import CurrentItem from './CurrentItem'

const CurrentList = ({
  item
}) => {
  return (
    <div>
      <CurrentItem title="AWAL Sales" list={item && item.detail && item.detail.filter(filtered => filtered.type === TYPE_SALES && filtered.balanceType === BALANCE_TYPE_AWAL)} />
      <CurrentItem title="AWAL Petty Cash" list={item && item.detail && item.detail.filter(filtered => filtered.type === TYPE_PETTY_CASH && filtered.balanceType === BALANCE_TYPE_AWAL)} />
      <CurrentItem title="Petty Cash" list={item && item.transaction && item.transaction.filter(filtered => filtered.type === TYPE_PETTY_CASH && filtered.balanceType === BALANCE_TYPE_TRANSACTION)} />
    </div>
  )
}

export default CurrentList
