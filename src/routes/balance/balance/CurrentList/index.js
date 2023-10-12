import React from 'react'
import {
  BALANCE_TYPE_TRANSACTION
} from 'utils/variable'
import moment from 'moment'
import CurrentItem from './CurrentItem'

const CurrentList = ({
  item
}) => {
  return (
    <div>
      <CurrentItem title={`Penjualan POS ${item && item.transaction && item.transaction.filter(filtered => filtered.balanceType === BALANCE_TYPE_TRANSACTION).length > 0 ? `(Updated At: ${moment(item.transaction[0].updatedAt).format('lll')})` : ''}`} list={item && item.transaction && item.transaction.filter(filtered => filtered.balanceType === BALANCE_TYPE_TRANSACTION)} />
    </div>
  )
}

export default CurrentList
