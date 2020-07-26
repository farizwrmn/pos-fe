import React from 'react'
import { Table } from 'antd'
import { numberFormatter } from 'utils/numberFormat'

const SalesDetail = ({ ...other }) => {
  const columns = [
    {
      title: 'Latest Sales',
      dataIndex: 'productCode',
      key: 'productCode',
      render: (text, record) => {
        return (
          <div>
            <div>{`${text} - ${record.productName}`}</div>
            <div>{`${record.qty} x ${numberFormatter(record.DPP / record.qty)}`}<strong style={{ float: 'right' }}>{`IDR ${numberFormatter(record.DPP)}`}</strong></div>
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

export default SalesDetail
