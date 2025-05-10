import React from 'react'
import { connect } from 'dva'
import { lstorage } from 'utils'
import List from './List'
import Filter from './Filter'

const DeliveryOrder = ({ dispatch, userStore, deliveryOrder, loading }) => {
  const { list } = deliveryOrder
  const { listAllTargetStores } = userStore

  const ListProps = {
    dataSource: list.map((item, index) => ({ no: index + 1, ...item })),
    loading: loading.effects['deliveryOrder/query'],
    toDetail: (record) => {
      window.open(`/delivery-order-detail/${record.id}`, '_blank')
    }
  }

  const filterProps = {
    // dataSource: list,
    listAllStores: listAllTargetStores.map(item => ({ value: item.id, label: item.storeName })),
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
    <div className="content-inner">
      <Filter {...filterProps} />
      <List {...ListProps} />
    </div>
  )
}

export default connect(({ deliveryOrder, userStore, loading, app }) => ({ deliveryOrder, userStore, loading, app }))(DeliveryOrder)
