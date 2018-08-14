import React from 'react'
import { Table } from 'antd'

const DataTable = ({ ...tableProps, headers }) => {
  let columns = headers.map((x) => {
    return {
      title: x,
      dataIndex: x.toLowerCase(),
      key: x.toLowerCase()
    }
  })
  return (
    <Table {...tableProps}
      columns={columns}
      bordered
      rowKey={record => record.id}
    />
  )
}

export default DataTable
