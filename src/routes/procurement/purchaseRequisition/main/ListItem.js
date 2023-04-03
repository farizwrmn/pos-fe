import React from 'react'
import { Table } from 'antd'

const ListItem = ({
  listItem
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
      <div><h1>Safety Stock</h1></div>
      <div>
        <Table
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
