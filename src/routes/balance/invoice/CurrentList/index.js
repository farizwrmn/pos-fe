import React from 'react'
import {
  BALANCE_TYPE_AWAL,

  TYPE_SALES,
  TYPE_PETTY_CASH
} from 'utils/variable'
import CurrentItem from './CurrentItem'

const CurrentList = ({
  item
}) => {
  return (
    <div>
      <CurrentItem title="Sales" list={item && item.detail && item.detail.filter(filtered => filtered.type === TYPE_SALES && filtered.balanceType === BALANCE_TYPE_AWAL)} />
      <CurrentItem title="Petty Cash" list={item && item.detail && item.detail.filter(filtered => filtered.type === TYPE_PETTY_CASH && filtered.balanceType === BALANCE_TYPE_AWAL)} />
    </div>
  )
}

export default CurrentList
