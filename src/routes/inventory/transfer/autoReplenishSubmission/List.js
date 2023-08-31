import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'
import moment from 'moment'
import { Link } from 'dva/router'


const List = (tableProps) => {
  const columns = [
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text, record) => {
        return (<Link target="_blank" to={`/inventory/transfer/auto-replenish-submission/${record.id}`}>{moment(text).format('lll')}</Link>)
      }
    },
    {
      title: 'Sales From',
      dataIndex: 'salesDateFrom',
      key: 'accountName'
    },
    {
      title: 'Sales To',
      dataIndex: 'salesDateTo',
      key: 'salesDateTo'
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
