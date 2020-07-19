import React from 'react'
import { Table } from 'antd'
import { numberFormatter } from 'utils/numberFormat'

const Profit = ({ ...other }) => {
  const columns = [
    {
      title: 'Profit',
      dataIndex: 'productCode',
      key: 'productCode',
      render: (text, record) => {
        return (
          <div>
            <div>{record.title}<strong style={{ float: 'right' }}>{`IDR ${numberFormatter(record.value)}`}</strong></div>
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
