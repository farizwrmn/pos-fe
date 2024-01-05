import React from 'react'
import { connect } from 'dva'
import List from './List'

const DeliveryOrder = ({ deliveryOrder, loading }) => {
  const { list } = deliveryOrder

  const ListProps = {
    dataSource: list,
    loading: loading.effects['deliveryOrder/query']
  }

  return (
    <div>
      <List {...ListProps} />
    </div>
  )
}

export default connect(({ deliveryOrder, loading, app }) => ({ deliveryOrder, loading, app }))(DeliveryOrder)
