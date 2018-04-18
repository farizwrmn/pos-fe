import React from 'react'
import moment from 'moment'
import { Table } from 'antd'

const List = ({ ...tableProps }) => {
  const columns = [
    {
      title: 'Datetime',
      dataIndex: 'transDate',
      key: 'transDate',
      render: text => moment(text).format('DD-MMM-YYYY HH:mm a')
    },
    {
      title: 'Employee Name',
      dataIndex: 'employeeName',
      key: 'employeeName'
    },
    {
      title: 'Store name',
      dataIndex: 'storeName',
      key: 'storeName'
    },
    {
      title: 'Store name receiver',
      dataIndex: 'storeNameReceiver',
      key: 'storeNameReceiver'
    }
  ]

  return (
    <div>
      <Table {...tableProps}
        bordered
        columns={columns}
        simple
        scroll={{ x: 1000 }}
        rowKey={record => record.id}
      />
    </div>
  )
}

export default List
