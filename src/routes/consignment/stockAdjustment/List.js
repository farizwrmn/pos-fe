import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'
import moment from 'moment'

const List = ({ ...tableProps, openDetail, onFilterChange }) => {
  const dateFormatter = (value) => {
    const formattedDate = moment(value).format('DD MMM YYYY')
    return formattedDate || '-'
  }

  const columns = [
    {
      title: 'ID Penyesuaian Stok',
      dataIndex: 'id',
      key: 'id',
      width: 120,
      render: (text, record) => {
        return (
          <a href={null} onClick={() => { openDetail(text) }} >
            <div style={{ textAlign: 'center' }}>
              SF-{moment(record.createdAt).format('YYMM')}{String(text).padStart(8, '0')}
            </div>
          </a>
        )
      }
    },
    {
      title: 'Tipe',
      dataIndex: 'request_type',
      key: 'request_type',
      width: 80,
      filters: [
        { text: 'Stock IN', value: '1' },
        { text: 'Stock OUT', value: '0' }
      ],
      render: (value) => {
        return value === 1 ? 'Stock IN' : 'Stock OUT'
      }
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      filters: [
        { text: 'Approved', value: 'approved' },
        { text: 'Canceled', value: 'canceled' },
        { text: 'Pending', value: 'pending' },
        { text: 'Rejected', value: 'rejected' }
      ],
      render: value => `${String(value).at(0).toUpperCase()}${String(value).slice(1)}`
    },
    {
      title: 'Vendor',
      dataIndex: 'vendor.name',
      key: 'vendor.name',
      width: 80
    },
    {
      title: 'Dibuat pada',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 90,
      render: value => dateFormatter(value)
    },
    {
      title: 'Dipegang oleh',
      dataIndex: 'admin.name',
      key: 'admin.name',
      width: 120,
      render: (text, record) => {
        return (
          <div>
            {record.handledby_pos ? record.handledby_pos : (text || '-')}
          </div>
        )
      }
    },
    {
      title: 'Dipegang pada',
      dataIndex: 'approved_at',
      key: 'approved_at',
      width: 120,
      render: value => dateFormatter(value)
    }
  ]

  const onChange = (pagination, filter) => {
    let status
    if (filter.status) {
      status = filter.status
    }
    let type
    if (filter.request_type) {
      type = filter.request_type
    }

    onFilterChange({ pagination, status, type })
  }

  return (
    <Table {...tableProps}
      bordered
      columns={columns}
      simple
      scroll={{ x: 800 }}
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
