import React from 'react'
import { Table } from 'antd'

const ListErrorLog = ({ ...tableProps }) => {
  const columns = [
    {
      title: 'Log Key',
      dataIndex: 'logKey',
      key: 'logKey',
      width: 120
    },
    {
      title: 'value',
      dataIndex: 'value',
      key: 'value',
      width: 200
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 50
    }
  ]

  return (
    <div>
      <h3>Error Log </h3>
      <Table {...tableProps}
        bordered
        columns={columns}
        simple
        rowKey={record => record.id}
      />
    </div>
  )
}

export default ListErrorLog
