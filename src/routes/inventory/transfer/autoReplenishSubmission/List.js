import React from 'react'
import PropTypes from 'prop-types'
import { Table, Tag, Modal } from 'antd'
import moment from 'moment'
import { Link } from 'dva/router'


const List = (tableProps) => {
  const updateStatus = (id, status) => {
    if (status === 1) {
      Modal.confirm({
        title: 'Update Status to Packing',
        content: 'Are you sure ?',
        onOk () {
          tableProps.updateStatus(id, 2)
        }
      })
    }
    if (status === 2) {
      Modal.confirm({
        title: 'Update Status to Delivery',
        content: 'Are you sure ?',
        onOk () {
          tableProps.updateStatus(id, 3)
        }
      })
    }
    if (status === 3) {
      Modal.confirm({
        title: 'Update Status to Done',
        content: 'Are you sure ?',
        onOk () {
          tableProps.updateStatus(id, 4)
        }
      })
    }
    if (status === 4) {
      Modal.confirm({
        title: 'Update Status to Picking',
        content: 'Are you sure ?',
        onOk () {
          tableProps.updateStatus(id, 1)
        }
      })
    }
  }
  const columns = [
    {
      title: 'Store Name',
      dataIndex: 'storeNameReceiver',
      key: 'storeNameReceiver'
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text, record) => {
        return (<Link target="_blank" to={`/inventory/transfer/auto-replenish-submission/${record.id}?storeId=${record.storeIdReceiver}`}>{moment(text).format('lll')}</Link>)
      }
    },
    {
      title: 'Sales From',
      dataIndex: 'salesDateFrom',
      key: 'salesDateFrom'
    },
    {
      title: 'Sales To',
      dataIndex: 'salesDateTo',
      key: 'salesDateTo'
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      onCellClick: record => updateStatus(record.id, record.status),
      render: (text) => {
        if (text === 0) {
          return (
            <Tag color="red">
              Canceled
            </Tag>
          )
        }
        if (text === 1) {
          return (
            <Tag color="yellow">
              Picking
            </Tag>
          )
        }
        if (text === 2) {
          return (
            <Tag color="blue">
              Packing
            </Tag>
          )
        }
        if (text === 3) {
          return (
            <Tag color="green">
              Delivery
            </Tag>
          )
        }
        if (text === 4) {
          return (
            <Tag color="green">
              Done
            </Tag>
          )
        }
      }
    }
  ]

  return (
    <div>
      <Table {...tableProps}
        bordered
        columns={columns}
        simple
        scroll={{ x: 1000 }}
        rowKey={record => record.id}
      />
    </div>
  )
}

List.propTypes = {
  editItem: PropTypes.func,
  deleteItem: PropTypes.func
}

export default List
