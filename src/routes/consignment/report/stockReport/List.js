import React from 'react'
import PropTypes from 'prop-types'
import { numberFormat } from 'utils'
import { Table } from 'antd'

const numberFormatter = numberFormat.numberFormatter

const List = ({ ...tableProps, onFilterChange }) => {
  const columns = [
    {
      title: (
        <div style={{ fontWeight: 'bolder' }}>
          Vendor
        </div>
      ),
      dataIndex: 'product.vendor.name',
      key: 'product.vendor.name'
    },
    {
      title: 'Nama Produk',
      dataIndex: 'product.product_name',
      key: 'product.product_name',
      render: (value, record) => {
        console.log('record', record)
        console.log('record', record['product.product_code'])
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
      key: 'quantity'
    },
    {
      title: 'Harga',
      dataIndex: 'price',
      key: 'price',
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
      scroll={{ x: 1000 }}
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
