import React from 'react'
import { Table } from 'antd'
import { numberFormatter, formatNumberIndonesia } from 'utils/numberFormat'

const Profit = ({ ...other }) => {
  const columns = [
    {
      title: 'Product',
      dataIndex: 'productCode',
      key: 'productCode',
      width: '150px',
      render: (text, record) => {
        return (
          <div>
            <div><strong>{record.productCode}</strong></div>
            <div>{record.productName}</div>
          </div>
        )
      }
    },
    {
      title: 'Qty',
      dataIndex: 'count',
      key: 'count',
      width: '70px',
      render: text => numberFormatter(text)
    },
    {
      title: '',
      dataIndex: 'posPrice',
      key: 'posPrice',
      width: '80px',
      render: (text, record) => {
        return (
          <div>
            <div>Harga: {formatNumberIndonesia(record.valuePrice / record.posQty)}</div>
            <div>Modal: {formatNumberIndonesia(record.posPrice / record.posQty)}</div>
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
