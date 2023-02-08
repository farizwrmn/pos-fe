import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'
import { numberFormat } from 'utils'
import moment from 'moment'

const numberFormatter = numberFormat.numberFormatter

const List = ({ ...tableProps, dataSource }) => {
  const columns = [
    {
      title: 'Tanggal',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (value, record) => {
        if (record === dataSource[dataSource.length - 1]) {
          return ({
            children: <div>TOTAL</div>,
            props: {
              colSpan: 5
            }
          })
        }
        return ({
          children: <div>{moment(value).format('DD MMM YYYY')}</div>,
          props: {
            colSpan: 1
          }
        })
      }
    },
    {
      title: 'Retur Penjualan',
      dataIndex: 'returnOrder.number',
      key: 'returnOrder.number',
      render: (value, record) => {
        if (record === dataSource[dataSource.length - 1]) {
          return ({
            children: <div>TOTAL</div>,
            props: {
              colSpan: 0
            }
          })
        }
        return ({
          children: value,
          props: {
            colSpan: 1
          }
        })
      }
    },
    {
      title: 'Nama Produk',
      dataIndex: 'salesOrderProduct.stock.product.product_name',
      key: 'salesOrderProduct.stock.product.product_name',
      render: (value, record) => {
        if (record === dataSource[dataSource.length - 1]) {
          return ({
            children: <div>TOTAL</div>,
            props: {
              colSpan: 0
            }
          })
        }
        return ({
          children: value,
          props: {
            colSpan: 1
          }
        })
      }
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (value, record) => {
        if (record === dataSource[dataSource.length - 1]) {
          return ({
            children: <div>TOTAL</div>,
            props: {
              colSpan: 0
            }
          })
        }
        return ({
          children: value,
          props: {
            colSpan: 1
          }
        })
      }
    },
    {
      title: 'Harga',
      dataIndex: 'price_after_discount',
      key: 'price_after_discount',
      render: (value, record) => {
        if (record === dataSource[dataSource.length - 1]) {
          return ({
            children: <div>TOTAL</div>,
            props: {
              colSpan: 0
            }
          })
        }
        return ({
          children: `Rp ${numberFormatter(value)}`,
          props: {
            colSpan: 1
          }
        })
      }
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      render: (value) => {
        return ({
          children: `Rp ${numberFormatter(value)}`,
          props: {
            colSpan: 1
          }
        })
      }
    }
  ]

  console.log({ ...tableProps })

  return (
    <Table {...tableProps}
      bordered
      columns={columns}
      simple
      scroll={{ x: 1000 }}
      rowKey={record => record.id}
    />
  )
}

List.propTypes = {
  editItem: PropTypes.func,
  deleteItem: PropTypes.func
}

export default List
