import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'
import { numberFormat } from 'utils'
import moment from 'moment'

const numberFormatter = numberFormat.numberFormatter

const List = ({ ...tableProps, onFilterChange }) => {
  const columns = [
    {
      title: 'Tanggal',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: text => moment(text).format('DD MMM YYYY')
    },
    {
      title: 'Faktur Penjualan',
      dataIndex: 'salesOrder.number',
      key: 'salesOrder.number'
    },
    {
      title: 'Nama Produk',
      dataIndex: 'stock.product.product_name',
      key: 'stock.product.product_name'
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity'
    },
    {
      title: 'Metode Pembayaran',
      dataIndex: 'salesOrder.paymentMethods.method',
      key: 'salesOrder.paymentMethods.method',
      render: value => value || '-'
    },
    {
      title: 'Total(Modal + Grab)',
      dataIndex: 'total',
      key: 'total',
      render: value => `Rp ${numberFormatter(value)}`
    },
    {
      title: 'Komisi(Komisi + Grab)',
      dataIndex: 'commission',
      key: 'commission',
      render: value => `Rp ${numberFormatter(value)}`
    },
    {
      title: 'Charge',
      dataIndex: 'charge',
      key: 'charge',
      render: value => `Rp ${numberFormatter(value)}`
    },
    {
      title: 'Grab',
      dataIndex: 'commissionGrab',
      key: 'commissionGrab',
      render: value => `Rp ${numberFormatter(value)}`
    },
    {
      title: 'Modal',
      dataIndex: 'stock.product.capital',
      key: 'stock.product.capital',
      render: (value, record) => {
        return `Rp ${numberFormatter(value * record.quantity)}`
      }
    },
    {
      title: 'Profit',
      dataIndex: 'profit',
      key: 'profit',
      render: value => `Rp ${numberFormatter(value)}`
    }
  ]

  const onChange = (pagination) => {
    onFilterChange({ pagination })
  }

  return (
    <Table {...tableProps}
      bordered
      columns={columns}
      simple
      scroll={{ x: 1300 }}
      rowKey={record => record.id}
      onChange={onChange}
    />
  )
}

List.propTypes = {
  editItem: PropTypes.func,
  deleteItem: PropTypes.func
}

export default List
