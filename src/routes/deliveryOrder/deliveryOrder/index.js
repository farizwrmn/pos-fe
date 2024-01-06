import React from 'react'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import List from './List'

const DeliveryOrder = ({ dispatch, deliveryOrder, loading }) => {
  const { list } = deliveryOrder

  const ListProps = {
    dataSource: list,
    loading: loading.effects['deliveryOrder/query'],
    toDetail: (record) => {
      dispatch(routerRedux.push(`/delivery-order-detail/${record.id}?storeId=${record.storeIdReceiver}`))
    }
  }

  return (
    <div>
      <List {...ListProps} />
    </div>
  )
}

export default connect(({ deliveryOrder, loading, app }) => ({ deliveryOrder, loading, app }))(DeliveryOrder)
