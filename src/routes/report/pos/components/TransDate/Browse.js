/**
 * Created by Veirry on 17/09/2017.
 */
import React from 'react'
import { Table } from 'antd'
import moment from 'moment'
import { numberFormat } from 'utils'

const { formatNumberIndonesia } = numberFormat

const Browse = ({ ...browseProps }) => {
  const columns = [
    {
      title: 'Date',
      dataIndex: 'transDate',
      key: 'transDate',
      width: '175px',
      render: text => `${moment(text).format('DD-MMM-YYYY')}`
    },
    {
      title: 'qty',
      dataIndex: 'qty',
      key: 'qty',
      width: '155px'
    },
    {
      title: 'Netto',
      dataIndex: 'netto',
      key: 'netto',
      width: '100px',
      render: text => <p style={{ textAlign: 'right' }}>{formatNumberIndonesia(text)}</p>
    }
  ]

  return (
    <Table
      {...browseProps}
      bordered
      scroll={{ x: 1000, y: 300 }}
      columns={columns}
      simple
      size="small"
      rowKey={record => record.transNo}
    />
  )
}

export default Browse
