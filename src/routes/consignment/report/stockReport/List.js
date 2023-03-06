import React from 'react'
import PropTypes from 'prop-types'
import { numberFormat } from 'utils'
import { Table } from 'antd'

const numberFormatter = numberFormat.numberFormatter

const List = ({ ...tableProps, onFilterChange }) => {
  const columns = [
    {
      title: 'Vendor',
      dataIndex: 'product.vendor.name',
      key: 'product.vendor.name',
      width: 100
    },
    {
      title: 'Nama Produk',
      dataIndex: 'product.product_name',
      key: 'product.product_name',
      width: 170,
      render: (value, record) => {
        return (
          <div>
            {record['product.product_code']} - {value}
          </div>
        )
      }
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 80,
      render: value => <div style={{ textAlign: 'center' }}>{value}</div>
    },
    {
      title: 'Harga',
      dataIndex: 'price',
      key: 'price',
      width: 100,
      render: value => <div style={{ textAlign: 'right' }}>{`Rp ${numberFormatter(value)}`}</div>
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
      scroll={{ x: 470 }}
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
