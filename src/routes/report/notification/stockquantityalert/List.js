import React from 'react'
import { Table } from 'antd'

const List = ({ ...tableProps }) => {
  const columns = [
    {
      title: 'Product Name',
      dataIndex: 'productName',
      key: 'productName'
    },
    {
      title: 'Quantity',
      dataIndex: 'sumQty',
      key: 'sumQty'
    },
    {
      title: 'Alert Quantity',
      dataIndex: 'alertQty',
      key: 'alertQty'
    }
  ]

  return (
    <div>
      <Table {...tableProps}
        bordered
        columns={columns}
        simple
        scroll={{ x: 1000 }}
        rowKey={record => record.id}
      />
    </div>
  )
}

export default List
