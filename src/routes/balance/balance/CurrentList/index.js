import React from 'react'
import {
  BALANCE_TYPE_TRANSACTION,

  TYPE_SALES,
  TYPE_PETTY_CASH
  // TYPE_CONSIGNMENT
} from 'utils/variable'
import moment from 'moment'
import CurrentItem from './CurrentItem'

const CurrentList = ({
  item
}) => {
  return (
    <div>
      <CurrentItem title={`Sales + Consignment ${item && item.detail && item.detail.filter(filtered => filtered.type === TYPE_SALES && filtered.balanceType === BALANCE_TYPE_TRANSACTION).length > 0 ? `(Updated At: ${moment(item.detail[0].updatedAt).format('lll')})` : ''}`} list={item && item.detail && item.detail.filter(filtered => filtered.type === TYPE_SALES && filtered.balanceType === BALANCE_TYPE_TRANSACTION)} />
      <CurrentItem title="Petty Cash" list={item && item.detail && item.detail.filter(filtered => filtered.type === TYPE_PETTY_CASH && filtered.balanceType === BALANCE_TYPE_TRANSACTION)} />
    </div>
  )
}

export default CurrentList
