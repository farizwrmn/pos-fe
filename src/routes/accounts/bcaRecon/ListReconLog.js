import React from 'react'
import { Table } from 'antd'

const ListReconLog = ({ ...tableProps }) => {
  const columns = [
    {
      title: 'Store Id',
      dataIndex: 'storeId',
      key: 'storeId',
      width: 20
    },
    {
      title: 'Trans Date',
      dataIndex: 'transDate',
      key: 'transDate',
      width: 20
    },
    {
      title: 'Detail',
      dataIndex: 'detail',
      key: 'detail',
      width: 150
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
      <h3>Recon Log </h3>
      <Table {...tableProps}
        bordered
        columns={columns}
        simple
        rowKey={record => record.id}
      />
    </div>
  )
}

export default ListReconLog
