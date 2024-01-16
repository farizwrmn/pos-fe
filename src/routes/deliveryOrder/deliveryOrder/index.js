import React from 'react'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { lstorage } from 'utils'
import List from './List'
import Filter from './Filter'

const DeliveryOrder = ({ dispatch, deliveryOrder, loading }) => {
  const { list } = deliveryOrder

  const ListProps = {
    dataSource: list.map((item, index) => ({ no: index + 1, ...item })),
    loading: loading.effects['deliveryOrder/query'],
    toDetail: (record) => {
      dispatch(routerRedux.push(`/delivery-order-detail/${record.id}?storeId=${record.storeIdReceiver}`))
    }
  }

  const filterProps = {
    // dataSource: list,
    storeId: lstorage.getCurrentUserStore(),
    listStore: lstorage.getListUserStores(),
    loading: loading.effects['deliveryOrder/query'],
    onFilter ({ storeIdReceiver, transNo }) {
      dispatch({
        type: 'deliveryOrder/query',
        payload: {
          type: 'all',
          storeIdReceiver,
          storeId: lstorage.getCurrentUserStore(),
          q: transNo
          // relationship: 1
          // page,
          // pageSize,
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
