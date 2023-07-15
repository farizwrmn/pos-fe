import React from 'react'
import { Table, Tag } from 'antd'
import moment from 'moment'
import { Link } from 'dva/router'

const List = ({ ...tableProps, onFilterChange }) => {
  const onChange = (pagination, filters) => {
    let status
    if (filters.status) {
      status = filters.status
    }
    let type
    if (filters.request_type) {
      type = filters.request_type
    }

    onFilterChange({ status, type, pagination })
  }

  const dateFormat = (dateData) => {
    const result = moment(dateData).format('DD MMM YYYY')
    return dateData ? result : '-'
  }

  const columns = [
    {
      title: 'ID Mutasi Produk',
      dataIndex: 'id',
      key: 'id',
      width: 120,
      render: (text, record) => {
        return (
          <div style={{ textAlign: 'center' }}>
            <Link to={`/integration/consignment/stock-flow/${record.id}`}>
              SF-{moment(record.created_at).format('YYMM')}{String(text).padStart(8, '0')}
            </Link>
          </div>
        )
      }
    },
    {
      title: 'Outlet',
      dataIndex: 'outletName',
      key: 'outletName',
      width: 180
    },
    {
      title: 'Tipe',
      dataIndex: 'request_type',
      key: 'request_type',
      width: 80,
      render: value => <div style={{ textAlign: 'center' }}><Tag color={value === 1 ? 'green' : 'red'}>{(value === 1 ? 'Stock IN' : 'Stock OUT')}</Tag></div>,
      filters: [{
        text: 'Stock IN',
        value: 1
      }, {
        text: 'Stock Out',
        value: 0
      }]
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 90,
      render: text => (
        <div style={{ textAlign: 'center' }}>
          <Tag
            color={text === 'approved' ? 'green'
              : text === 'rejected' ? 'red'
                : text === 'canceled' ? 'yellow' : ''
            }
          >
            {String(text).at(0).toUpperCase() + String(text).slice(1)}
          </Tag>
        </div>
      ),
      filters: [{
        text: 'Approved',
        value: 'approved'
      }, {
        text: 'Pending',
        value: 'pending'
      }, {
        text: 'Rejected',
        value: 'rejected'
      }, {
        text: 'Canceled',
        value: 'canceled'
      }]
    },
    {
      title: 'Vendor',
      dataIndex: 'vendor.name',
      key: 'vendor.name',
      width: 70
    },
    {
      title: 'Dibuat pada',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 80,
      render: (text) => {
        return dateFormat(text)
      }
    },
    {
      title: 'Dipegang oleh',
      dataIndex: 'admin.name',
      key: 'admin.name',
      width: 90,
      render: (value, record) => {
        return (
          <div>
            {record.handledby_pos ? record.handledby_pos : (value || '-')}
          </div>
        )
      }
    },
    {
      title: 'Dipegang pada',
      dataIndex: 'approved_at',
      key: 'approved_at',
      width: 90,
      render: (text) => {
        return dateFormat(text)
      }
    }
  ]

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

export default List
