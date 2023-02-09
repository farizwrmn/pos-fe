import React from 'react'
import { Table } from 'antd'
import moment from 'moment'

const DetailList = ({
  ...tableProps,
  list,
  numberFormatter
}) => {
  const columns = [
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (value, record) => <div style={{ color: record.type === 'RTN' ? '#FF0000' : '#000000' }}>{moment(value).format('DD MMM YYYY')}</div>
    },
    {
      title: 'Order ID',
      dataIndex: 'number',
      key: 'number',
      render: (number, record) => <div style={{ color: record.type === 'RTN' ? '#FF0000' : '#000000' }}>{number}</div>
    },
    {
      title: 'Amount',
      dataIndex: 'total',
      key: 'total',
      render: (value, record) => <div style={{ color: record.type === 'RTN' ? '#FF0000' : '#000000' }}>{`Rp ${numberFormatter(value)}`}</div>
    }
  ]

  return (
    <Table
      {...tableProps}
      dataSource={list}
      bordered
      columns={columns}
      simple
      pagination={false}
      scroll={{ x: 1000 }}
      rowKey={record => record.id}
    />
  )
}

export default DetailList
