import React from 'react'
import PropTypes from 'prop-types'
import { Col, Table } from 'antd'
import { numberFormat } from 'utils'
import moment from 'moment'

const numberFormatter = numberFormat.numberFormatter

const List = ({ ...tableProps, dataSource }) => {
  const columns = [
    {
      title: 'Tanggal',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 90,
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
      width: 140,
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
      width: 120,
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
      width: 80,
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
          children: <div style={{ textAlign: 'center' }}>{value}</div>,
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
      width: 100,
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
          children: <div style={{ textAlign: 'end' }}>{`Rp ${numberFormatter(value)}`}</div>,
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
      width: 100,
      render: (value) => {
        return ({
          children: <div style={{ textAlign: 'end' }}>{`Rp ${numberFormatter(value)}`}</div>,
          props: {
            colSpan: 1
          }
        })
      }
    }
  ]

  return (
    <Col span={24}>
      <Table {...tableProps}
        bordered
        columns={columns}
        simple
        scroll={{ x: 650 }}
        rowKey={record => record.id}
      />
    </Col>
  )
}

List.propTypes = {
  editItem: PropTypes.func,
  deleteItem: PropTypes.func
}

export default List
