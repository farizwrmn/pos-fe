import React from 'react'
import { Table } from 'antd'
import moment from 'moment'
import { numberFormat } from 'utils'

const { formatNumberIndonesia } = numberFormat

const List = ({ ...listProps }) => {
  const columns = [
    {
      title: 'Trans No',
      dataIndex: 'transNo',
      key: 'transNo',
      width: '150px'
    },
    {
      title: 'Date',
      dataIndex: 'transDate',
      key: 'transDate',
      width: '160px',
      render: text => <p style={{ textAlign: 'left' }}>{moment(text).format('LL')}</p>
    },
    {
      title: 'Time',
      dataIndex: 'transTime',
      key: 'transTime',
      width: '160px'
    },
    {
      title: 'Member Code',
      dataIndex: 'memberCode',
      key: 'memberCode',
      width: '150px'
    },
    {
      title: 'Member Name',
      dataIndex: 'memberName',
      key: 'memberName',
      width: '150px'
    },
    {
      title: 'Disc Item',
      dataIndex: 'discItem',
      key: 'discItem',
      width: '100px',
      render: text => <p style={{ textAlign: 'right' }}>{formatNumberIndonesia(parseFloat(text) || '')}</p>
    },
    {
      title: 'Disc Invoice',
      dataIndex: 'discInvoice',
      key: 'discInvoice',
      width: '120px',
      render: text => <p style={{ textAlign: 'right' }}>{formatNumberIndonesia(parseFloat(text) || '')}</p>
    },
    {
      title: 'DPP',
      dataIndex: 'DPP',
      key: 'DPP',
      width: '100px',
      render: text => <p style={{ textAlign: 'right' }}>{formatNumberIndonesia(parseFloat(text) || '')}</p>
    },
    {
      title: 'PPN',
      dataIndex: 'PPN',
      key: 'PPN',
      width: '100px',
      render: text => <p style={{ textAlign: 'right' }}>{formatNumberIndonesia(parseFloat(text) || '')}</p>
    },
    {
      title: 'Netto',
      dataIndex: 'netto',
      key: 'netto',
      width: '150px',
      render: text => <p style={{ textAlign: 'right' }}>{formatNumberIndonesia(parseFloat(text) || '')}</p>
    }
  ]

  return (
    <Table
      {...listProps}
      bordered
      scroll={{ x: 1200 }}
      columns={columns}
      simple
      size="small"
      rowKey={record => record.transNoId}
    />
  )
}

export default List
