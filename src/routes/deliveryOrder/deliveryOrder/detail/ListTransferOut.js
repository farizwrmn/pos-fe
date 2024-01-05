import React from 'react'
import { Table } from 'antd'
// import { IMAGEURL } from 'utils/config.company'
// import { withoutFormat } from 'utils/string'

const ListTransferOut = (tableProps) => {
  const columns = [
    {
      title: 'id',
      dataIndex: 'id',
      key: 'id'
    },
    {
      title: 'DO Transaction Number',
      dataIndex: 'transNo',
      key: 'transNo'
    },
    {
      title: 'Quantity MUOUT',
      dataIndex: 'totalColly',
      key: 'totalColly'
    },
    {
      title: 'Box Number',
      dataIndex: 'boxNumber',
      key: 'boxNumber'
    },
    {
      title: 'Distribution Center',
      dataIndex: 'storeName',
      key: 'storeName'
    },
    {
      title: 'Store Name Receiver',
      dataIndex: 'storeNameReceiver',
      key: 'storeNameReceiver'
    },
    {
      title: 'Sent date',
      dataIndex: 'transDate',
      key: 'transDate'
    },
    // {
    //   title: 'Duration',
    //   dataIndex: '',
    //   key: ''
    // },
    // {
    //   title: 'Expired DO',
    //   dataIndex: '',
    //   key: ''
    // },
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
        rowKey={record => record.id}
      />
    </div>
  )
}

export default ListTransferOut
