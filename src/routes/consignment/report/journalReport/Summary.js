import React from 'react'
import { Table } from 'antd'

const List = ({
  ...tableProps,
  summary,
  numberFormatter,
  paymentMethod
}) => {
  const paymentColumn = []
  paymentMethod.map((record) => {
    paymentColumn.push({
      title: `${record.method}`,
      dataIndex: `${record.typeCode}`,
      key: `${record.typeCode}`,
      render: value => `Rp ${numberFormatter(value)}`
    })
    return record
  })

  const columns = [
    {
      title: 'Tipe',
      dataIndex: 'type',
      key: 'type',
      fixed: 'left',
      width: '150px'
    },
    ...paymentColumn,
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      fixed: 'right',
      width: '85px',
      render: value => `Rp ${numberFormatter(value)}`
    }
  ]

  return (
    <div>
      <Table
        {...tableProps}
        dataSource={summary}
        bordered
        columns={columns}
        simple
        pagination={false}
        scroll={{ x: 2600 }}
        rowKey={record => record.id}
      />
    </div>
  )
}

export default List
