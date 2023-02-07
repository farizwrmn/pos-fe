import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'
import moment from 'moment'

const List = ({ ...tableProps, onFilterChange, dataSource }) => {
  const columns = [
    {
      title: 'Tanggal',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text, record) => {
        if (record !== dataSource[dataSource.length - 1]) {
          return {
            children: <div>{moment(text).format('DD MMM YYYY')}</div>,
            props: {
              colSpan: 1
            }
          }
        }
        return {
          children: <div>Jumlah Stok</div>,
          props: {
            colSpan: 4
          }
        }
      }
    },
    {
      title: 'Deskripsi',
      dataIndex: 'description',
      key: 'description',
      render: (value, record) => {
        if (record !== dataSource[dataSource.length - 1]) {
          return {
            children: <div>{value}</div>,
            props: {
              colSpan: 1
            }
          }
        }
        return {
          children: <div>{value}</div>,
          props: {
            colSpan: 0
          }
        }
      }
    },
    {
      title: 'Tipe',
      dataIndex: 'stock_type',
      key: 'stock_type',
      render: (value, record) => {
        if (record !== dataSource[dataSource.length - 1]) {
          return {
            children: <div>{value === 1 ? 'Stock IN' : 'Stock Out'}</div>,
            props: {
              colSpan: 1
            }
          }
        }
        return {
          children: <div>{value === 1 ? 'Stock IN' : 'Stock Out'}</div>,
          props: {
            colSpan: 0
          }
        }
      }
    },
    {
      title: 'Jumlah',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (value, record) => {
        console.log('record === dataSource[dataSource.length - 1]', record === dataSource[dataSource.length - 1])
        if (record !== dataSource[dataSource.length - 1]) {
          return {
            children: <div style={{ color: record.stock_type === 0 ? '#FF0000' : '#000000' }}>{value}</div>,
            props: {
              colSpan: 1
            }
          }
        }
        return {
          children: <div style={{ color: record.stock_type === 0 ? '#FF0000' : '#000000' }}>{value}</div>,
          props: {
            colSpan: 0
          }
        }
      }
    },
    {
      title: 'Stok',
      dataIndex: 'stock_amount',
      key: 'stock_amount',
      render: (value, record) => {
        if (record !== dataSource[dataSource.length - 1]) {
          return {
            children: <div>{value}</div>,
            props: {
              colSpan: 1
            }
          }
        }
        return {
          children: <div>{record.quantity}</div>,
          props: {
            colSpan: 1
          }
        }
      }
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
