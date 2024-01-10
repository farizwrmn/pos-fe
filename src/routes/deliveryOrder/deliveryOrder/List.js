import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'
import moment from 'moment'
// import { Link } from 'dva/router'

const List = ({ toDetail, ...tableProps }) => {
  const columns = [
    // {
    //   title: 'id',
    //   dataIndex: 'id',
    //   key: 'id',
    //   render: (text, record) => {
    //     return (<Link target="_blank" to={`/delivery-order-detail/${record.id}?storeId=${record.storeIdReceiver}`}>{text}</Link>)
    //   }
    // },
    {
      title: 'Trans No.',
      dataIndex: 'transNo',
      key: 'transNo'
    },
    {
      title: 'From',
      dataIndex: 'storeName',
      key: 'storeName'
    },
    {
      title: 'To',
      dataIndex: 'storeNameReceiver',
      key: 'storeNameReceiver'
    },
    {
      title: 'Day/Date/Hour',
      dataIndex: 'transDate',
      key: 'transDate',
      render: (text, record) => {
        const parsedDate = moment(record)
        const day = parsedDate.format('dddd') // 'dddd' gives the full day name (e.g., Monday)
        const date = parsedDate.format('YYYY-MM-DD') // 'YYYY-MM-DD' gives the date in the specified format
        const hour = parsedDate.format('HH') // 'HH' gives the hour in 24-hour format
        return `${day}, ${date} ${hour}`
      }
    },
    // {
    //   title: 'Duration of DO',
    //   dataIndex: '',
    //   key: ''
    // },
    {
      title: 'Expired DO',
      dataIndex: '',
      key: ''
    },
    {
      title: 'Notes',
      dataIndex: 'memo',
      key: 'memo'
    }
    // {
    //   title: 'Created At',
    //   dataIndex: 'createdAt',
    //   key: 'createdAt',
    //   render: (text, record) => {
    //     return (<Link target="_blank" to={`/inventory/transfer/auto-replenish-submission/${record.id}?storeId=${record.storeIdReceiver}`}>{moment(text).format('lll')}</Link>)
    //   }
    // }
  ]

  return (
    <div>
      <Table {...tableProps}
        bordered
        columns={columns}
        pagination={false}
        simple
        onRowClick={record => toDetail(record)}
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
