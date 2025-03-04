import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'
import moment from 'moment'
import { Link } from 'dva/router'

const List = ({ toDetail, ...tableProps }) => {
  const columns = [
    {
      title: 'No.',
      dataIndex: 'no',
      key: 'no'
    },
    {
      title: 'TransNo',
      dataIndex: 'transNo',
      key: 'transNo',
      render: (text, record) => {
        return (<Link target="_blank" to={`/delivery-order-detail/${record.id}`}>{text}</Link>)
      }
    },
    {
      title: 'From',
      dataIndex: 'storeName',
      key: 'storeName',
      onCellClick: record => toDetail(record)
    },
    {
      title: 'To',
      dataIndex: 'storeNameReceiver',
      key: 'storeNameReceiver',
      onCellClick: record => toDetail(record)
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      onCellClick: record => toDetail(record)
    },
    {
      title: 'Date',
      dataIndex: 'transDate',
      key: 'transDate',
      render: (text, record) => {
        const transDate = moment(record.createdAt).format('ddd, YYYY-MM-DD HH:mm')
        return transDate
      },
      onCellClick: record => toDetail(record)
    }
  ]

  return (
    <div>
      <Table {...tableProps}
        bordered
        columns={columns}
        pagination={false}
        simple
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
