import React from 'react'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { lstorage } from 'utils'
import List from './List'
import Filter from './Filter'

const DeliveryOrder = ({ dispatch, deliveryOrder, loading }) => {
  const { list } = deliveryOrder

  const ListProps = {
    dataSource: list,
    loading: loading.effects['deliveryOrder/query'],
    toDetail: (record) => {
      dispatch(routerRedux.push(`/delivery-order-detail/${record.id}?storeId=${record.storeIdReceiver}`))
    }
  }
  const filterProps = {
    // dataSource: list,
    loading: loading.effects['deliveryOrder/query'],
    onFilter: (storeIdReceiver) => {
      dispatch({
        type: 'query',
        payload: {
          type: 'all',
          storeIdReceiver,
          storeId: lstorage.getCurrentUserStore()
          // relationship: 1
          // page,
          // pageSize,
          // q: null
        }
      })
    }
  }

  return (
    <div>
      <Filter {...filterProps} />
      <List {...ListProps} />
    </div>
  )
}

export default connect(({ deliveryOrder, loading, app }) => ({ deliveryOrder, loading, app }))(DeliveryOrder)
