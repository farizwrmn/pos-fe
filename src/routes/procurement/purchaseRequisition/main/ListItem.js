import React from 'react'
import { Table } from 'antd'

const ListItem = ({
  listItem,
  ...otherProps
}) => {
  const columns = [
    {
      title: 'Name',
      dataIndex: 'productName',
      key: 'productName'
    }
  ]

  return (
    <div>
      <div><h1>Requisition Item</h1></div>
      <div>
        <Table
          {...otherProps}
          bordered
          columns={columns}
          simple
          rowKey={record => record.id}
          dataSource={listItem}
        />
      </div>
    </div>
  )
}

export default ListItem
