import React from 'react'
import { Table } from 'antd'

const ListErrorLog = ({ openModalInputMdrAmount, ...tableProps }) => {
  const columns = [
    {
      title: 'logKey',
      dataIndex: 'logKey',
      key: 'logKey',
      width: 120
    },
    {
      title: 'value',
      dataIndex: 'value',
      key: 'value',
      width: 120
    }
  ]

  return (
    <div>
      <Table {...tableProps}
        scroll={{ x: 1000 }}
        bordered
        columns={columns}
        simple
        pagination={false}
      />
    </div>
  )
}

export default ListErrorLog
