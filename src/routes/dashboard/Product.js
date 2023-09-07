import React from 'react'
import { Table } from 'antd'

const Profit = ({ ...other }) => {
  const columns = [
    {
      title: 'Product',
      dataIndex: 'productCode',
      key: 'productCode',
      width: '150px',
      render: (text, record) => {
        return (
          <div style={{ color: record.color }}>
            <div><strong>{record.productCode}</strong>-{record.productName}</div>
          </div>
        )
      }
    },
    {
      title: 'Stock',
      dataIndex: 'stock',
      key: 'stock',
      width: '70px',
      render: (text, record) => {
        return (
          <div style={{ color: record.color }}>
            {text ? text.toLocaleString() : ''}
          </div>
        )
      }
    },
    {
      title: 'Sales',
      dataIndex: 'salesQty',
      key: 'salesQty',
      width: '70px',
      render: (text, record) => {
        return (
          <div style={{ color: record.color }}>
            {text ? text.toLocaleString() : ''}
          </div>
        )
      }
    }
  ]

  return (
    <div>
      <Table
        columns={columns}
        {...other}
      />
    </div>
  )
}

export default Profit
