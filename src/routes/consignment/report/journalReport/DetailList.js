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
      width: 90,
      render: (value, record) => <div style={{ color: record.type === 'RTN' ? '#FF0000' : '#000000' }}>{moment(value).format('DD MMM YYYY')}</div>
    },
    {
      title: 'Order ID',
      dataIndex: 'number',
      key: 'number',
      width: 140,
      render: (number, record) => <div style={{ color: record.type === 'RTN' ? '#FF0000' : '#000000' }}>{number}</div>
    },
    {
      title: 'Amount',
      dataIndex: 'total',
      key: 'total',
      width: 120,
      render: (value, record) => <div style={{ color: record.type === 'RTN' ? '#FF0000' : '#000000', textAlign: 'end' }}>{`Rp ${numberFormatter(value)}`}</div>
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
      scroll={{ x: 350 }}
      rowKey={record => record.id}
    />
  )
}

export default DetailList
