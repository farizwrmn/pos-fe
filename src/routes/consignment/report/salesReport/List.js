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
      width: 90,
      render: text => moment(text).format('DD MMM YYYY')
    },
    {
      title: 'Faktur Penjualan',
      dataIndex: 'salesOrder.number',
      key: 'salesOrder.number',
      width: 140
    },
    {
      title: 'Nama Produk',
      dataIndex: 'stock.product.product_name',
      key: 'stock.product.product_name',
      width: 100
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 80,
      render: value => <div style={{ textAlign: 'center' }}>{value}</div>
    },
    {
      title: 'Metode Pembayaran',
      dataIndex: 'salesOrder.paymentMethods.method',
      key: 'salesOrder.paymentMethods.method',
      width: 140,
      render: value => value || '-'
    },
    {
      title: 'Total(Modal + Grab)',
      dataIndex: 'total',
      key: 'total',
      width: 140,
      render: value => <div style={{ textAlign: 'end' }}>{`Rp ${numberFormatter(value)}`}</div>
    },
    {
      title: 'Komisi(Komisi + Grab)',
      dataIndex: 'commission',
      key: 'commission',
      width: 150,
      render: value => <div style={{ textAlign: 'end' }}>{`Rp ${numberFormatter(value)}`}</div>
    },
    {
      title: 'Charge',
      dataIndex: 'charge',
      key: 'charge',
      width: 90,
      render: value => <div style={{ textAlign: 'end' }}>{`Rp ${numberFormatter(value)}`}</div>
    },
    {
      title: 'Grab',
      dataIndex: 'commissionGrab',
      key: 'commissionGrab',
      width: 90,
      render: value => <div style={{ textAlign: 'end' }}>{`Rp ${numberFormatter(value)}`}</div>
    },
    {
      title: 'Modal',
      dataIndex: 'stock.product.capital',
      key: 'stock.product.capital',
      width: 90,
      render: (value, record) => {
        return <div style={{ textAlign: 'end' }}>{`Rp ${numberFormatter(value * record.quantity)}`}</div>
      }
    },
    {
      title: 'Profit',
      dataIndex: 'profit',
      key: 'profit',
      width: 90,
      render: value => <div style={{ textAlign: 'end' }}>{`Rp ${numberFormatter(value)}`}</div>
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
      scroll={{ x: 1200 }}
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
