import React from 'react'
import { Table } from 'antd'

const List = ({
  ...tableProps
}) => {
  return (
    <Table
      {...tableProps}
      bordered
      rowKey={record => record.id}
    />
  )
}
export default List
