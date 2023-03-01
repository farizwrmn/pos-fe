import React from 'react'
import { Table } from 'antd'
import moment from 'moment'
import { Link } from 'dva/router'

const List = ({ ...tableProps, onFilterChange, selectedOutlet }) => {
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
      dataIndex: 'outlet_id',
      key: 'outlet_id',
      width: 180,
      render: value => (value === selectedOutlet.id ? selectedOutlet.outlet_name : '-')
    },
    {
      title: 'Tipe',
      dataIndex: 'request_type',
      key: 'request_type',
      width: 80,
      render: (value) => {
        return (
          <div style={{
            padding: '5px',
            color: '#FFFFFF',
            backgroundColor: value === 1 ? '#6fc182' : '#e47882',
            borderRadius: '10px',
            textAlign: 'center'
          }
          }
          >
            {value === 1 ? 'Stock IN' : 'Stock OUT'}
          </div >
        )
      },
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
      render: (text) => {
        return (
          <div style={{
            padding: '5px',
            color: text !== 'canceled' && '#FFFFFF',
            backgroundColor: text === 'pending' ? '#808080' : text === 'approved' ? '#6fc182' : text === 'rejected' ? '#e47882' : '#fad25a',
            borderRadius: '10px',
            textAlign: 'center'
          }
          }
          >
            {String(text).at(0).toUpperCase() + String(text).slice(1)}
          </div >
        )
      },
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
