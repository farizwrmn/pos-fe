import React from 'react'
import PropTypes from 'prop-types'
import { Col, Table } from 'antd'
import moment from 'moment'

const List = ({ ...tableProps, onFilterChange, dataSource }) => {
  const columns = [
    {
      title: 'Tanggal',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
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
      width: 150,
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
      title: 'Jumlah',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 70,
      render: (value, record) => {
        if (record !== dataSource[dataSource.length - 1]) {
          return {
            children: <div style={{ color: record.stock_type === 0 ? '#FF0000' : '#000000', textAlign: 'center' }}>{value}</div>,
            props: {
              colSpan: 1
            }
          }
        }
        return {
          children: <div style={{ color: record.stock_type === 0 ? '#FF0000' : '#000000', textAlign: 'center' }}>{value}</div>,
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
      width: 50,
      render: (value, record) => {
        if (record !== dataSource[dataSource.length - 1]) {
          return {
            children: <div style={{ textAlign: 'center' }}>{value}</div>,
            props: {
              colSpan: 1
            }
          }
        }
        return {
          children: <div style={{ textAlign: 'center' }}>{record.quantity}</div>,
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
    <Col span={24}>
      <Table {...tableProps}
        bordered
        columns={columns}
        simple
        scroll={{ x: 400 }}
        rowKey={record => record.id}
        onChange={onChange}
      />
    </Col>
  )
}

List.propTypes = {
  editItem: PropTypes.func,
  deleteItem: PropTypes.func
}

export default List
