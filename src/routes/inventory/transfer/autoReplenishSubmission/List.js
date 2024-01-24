import React from 'react'
import PropTypes from 'prop-types'
import { Table, Tag } from 'antd'
import moment from 'moment'
import { Link } from 'dva/router'


const List = (tableProps) => {
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
      render: (text, record) => {
        if (text == 0) {
          return (
            <Tag color="red">
              Canceled
            </Tag>
          )
        }
        if (text == 1) {
          return (
            <Tag color="blue">
              Picking
            </Tag>
          )
        }
        if (text == 2) {
          return (
            <Tag color="green">
              Delivery
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
