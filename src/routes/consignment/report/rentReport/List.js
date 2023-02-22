import React from 'react'
import { Table } from 'antd'
import moment from 'moment'
import { numberFormat } from 'utils'


const numberFormatter = numberFormat.numberFormatter

const List = ({
  ...tableProps,
  onFilterChange
}) => {
  const columns = [
    {
      title: 'Tanggal',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: value => moment(value).format('DD MMM YYYY')
    },
    {
      title: 'ID Permintaan Sewa',
      dataIndex: 'id',
      key: 'id',
      render: (value, record) => {
        let id = `00000000${value}`
        let time = moment(record.created_at).format('YYMM')

        return `BR-${time}${id.slice(id.length - 8)}`
      }
    },
    {
      title: 'Vendor',
      dataIndex: 'vendorName',
      key: 'vendorName'
    },
    {
      title: 'Outlet',
      dataIndex: 'outletName',
      key: 'outletName'
    },
    {
      title: 'Harga',
      dataIndex: 'price',
      key: 'price',
      render: value => `Rp ${numberFormatter(value)}`
    },
    {
      title: 'Diskon',
      dataIndex: 'discount',
      key: 'discount',
      render: value => `Rp ${numberFormatter(value || 0)}`
    },
    {
      title: 'Harga Final',
      dataIndex: 'final_price',
      key: 'final_price',
      render: value => `Rp ${numberFormatter(value)}`
    }
  ]

  const onChange = (pagination) => {
    onFilterChange({ pagination })
  }

  return (
    <Table
      {...tableProps}
      bordered
      columns={columns}
      simple
      scroll={{ x: 1000 }}
      rowKey={record => record.id}
      onChange={onChange}
    />
  )
}

export default List
