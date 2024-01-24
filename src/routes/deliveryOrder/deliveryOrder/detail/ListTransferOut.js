import React from 'react'
import { Table } from 'antd'
// import { IMAGEURL } from 'utils/config.company'
// import { withoutFormat } from 'utils/string'

const ListTransferOut = ({ toDetail, ...tableProps }) => {
  const columns = [
    {
      title: 'Trans No.',
      dataIndex: 'transNo',
      key: 'transNo'
    },
    {
      title: 'Box Number',
      dataIndex: 'boxNumber',
      key: 'boxNumber'
    },
    {
      title: 'From',
      dataIndex: 'storeName',
      key: 'storeName'
    },
    {
      title: 'To',
      dataIndex: 'storeNameReceiver',
      key: 'storeNameReceiver'
    },
    {
      title: 'Date',
      dataIndex: 'transDate',
      key: 'transDate'
    },
    {
      title: 'Notes',
      dataIndex: 'memo',
      key: 'memo'
    }
  ]


  return (
    <div>
      <Table {...tableProps}
        bordered
        columns={columns}
        simple
        pagination={false}
        onRowClick={record => toDetail(record)}
        rowKey={record => record.id}
      />
    </div>
  )
}

export default ListTransferOut
