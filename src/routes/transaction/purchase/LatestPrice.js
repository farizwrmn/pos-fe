import React from 'react'
import { Table } from 'antd'
import moment from 'moment'
import { currencyFormatter } from 'utils/string'

const LatestPrice = ({
  ...tableProps
}) => {
  const columns = [
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: text => (text ? moment(text).format('DD-MM-YYYY') : '')
    },
    {
      title: 'Trans No',
      dataIndex: 'transNo',
      key: 'transNo'
    },
    {
      title: 'DPP',
      dataIndex: 'dpp',
      key: 'dpp',
      render: (text, record) => currencyFormatter(text / record.qty)
    }
  ]
  return (
    <div>
      <Table
        {...tableProps}
        bordered
        columns={columns}
        simple
        size="small"
      />
    </div>
  )
}

export default LatestPrice
