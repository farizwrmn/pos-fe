import React from 'react'
import {
  BALANCE_TYPE_CLOSING,
  BALANCE_TYPE_TRANSACTION,

  TYPE_SALES,
  TYPE_PETTY_CASH,
  TYPE_CONSIGNMENT
} from 'utils/variable'
import CurrentItem from './CurrentItem'

const CurrentList = ({
  item
}) => {
  return (
    <div>
      <CurrentItem title="Sales" list={item && item.detail && item.detail.filter(filtered => filtered.type === TYPE_SALES && filtered.balanceType === BALANCE_TYPE_CLOSING)} />
      <CurrentItem title="Petty Cash" list={item && item.detail && item.detail.filter(filtered => filtered.type === TYPE_PETTY_CASH && filtered.balanceType === BALANCE_TYPE_CLOSING)} />
      <CurrentItem title="Consignment" list={item && item.detail && item.detail.filter(filtered => filtered.type === TYPE_CONSIGNMENT && filtered.balanceType === BALANCE_TYPE_TRANSACTION)} />
    </div>
  )
}

export default CurrentList
