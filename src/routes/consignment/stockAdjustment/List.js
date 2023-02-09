import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'
import moment from 'moment'

const List = ({ ...tableProps, openDetail, onFilterChange }) => {
  const idFormatter = (value) => {
    const id = `00000000${value}`
    return id.slice(id.length - 8)
  }

  const dateFormatter = (value) => {
    const formattedDate = moment(value).format('DD MMM YYYY')
    return formattedDate || '-'
  }

  const columns = [
    {
      title: 'ID Penyesuaian Stok',
      dataIndex: 'id',
      key: 'id',
      render: (text) => {
        return (
          <a href={null} onClick={() => { openDetail(text) }}>SF-{idFormatter(text)}</a>
        )
      }
    },
    {
      title: 'Tipe',
      dataIndex: 'request_type',
      key: 'request_type',
      filters: [
        { text: 'Stock IN', value: '1' },
        { text: 'Stock OUT', value: '0' }
      ],
      render: (value) => {
        return value === 1 ? 'Stock In' : 'Stock Out'
      }
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: 'Approved', value: 'approved' },
        { text: 'Canceled', value: 'canceled' },
        { text: 'Pending', value: 'pending' },
        { text: 'Rejected', value: 'rejected' }
      ]
    },
    {
      title: 'Vendor',
      dataIndex: 'vendor.name',
      key: 'vendor.name'
    },
    {
      title: 'Dibuat pada',
      dataIndex: 'created_at',
      key: 'created_at',
      render: value => dateFormatter(value)
    },
    {
      title: 'Dipegang oleh',
      dataIndex: 'admin.name',
      key: 'admin.name',
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
