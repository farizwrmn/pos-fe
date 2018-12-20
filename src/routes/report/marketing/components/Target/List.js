import React from 'react'
import { Table } from 'antd'

const List = ({ byCategory, ...listProps }) => {
  const columns = [
    {
      title: byCategory ? 'Category Code' : 'Brand Code',
      dataIndex: 'categoryCode',
      key: 'categoryCode'
    },
    {
      title: byCategory ? 'Category Name' : 'Brand Name',
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
