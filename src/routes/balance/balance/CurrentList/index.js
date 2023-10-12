import React from 'react'
import {
  BALANCE_TYPE_TRANSACTION
} from 'utils/variable'
import CurrentItem from './CurrentItem'

const CurrentList = ({
  item
}) => {
  return (
    <div>
      <CurrentItem title="Penjualan POS" list={item && item.transaction ? item.transaction.filter(filtered => filtered.balanceType === BALANCE_TYPE_TRANSACTION) : []} />
    </div>
  )
}

export default CurrentList
