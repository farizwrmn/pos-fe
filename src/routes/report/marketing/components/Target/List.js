import React from 'react'
import { Table } from 'antd'

const List = ({ ...listProps }) => {
  const columns = [
    {
      title: 'Category Code',
      dataIndex: 'categoryCode',
      key: 'categoryCode'
    },
    {
      title: 'Category Name',
      dataIndex: 'categoryName',
      key: 'categoryName'
    }
  ]

  return (
    <Table
      {...listProps}
      bordered
      scroll={{ x: 1200 }}
      columns={columns}
      simple
      size="small"
    />
  )
}

export default List
