import React from 'react'
import { connect } from 'dva'
import moment from 'moment'
import { Table } from 'antd'

const History = ({ bookinghistory }) => {
  const { listHistory } = bookinghistory
  const columns = [{
    title: 'Old Status',
    dataIndex: 'oldStatus',
    key: 'oldStatus'
  }, {
    title: 'New Status',
    dataIndex: 'newStatus',
    key: 'newStatus'
  }, {
    title: 'Old Schedule',
    dataIndex: 'oldSchedule',
    key: 'oldSchedule',
    render: (text) => {
      return text ? moment(text).format('MMMM Do YYYY, HH:mm') : ''
    }
  }, {
    title: 'Updated',
    children: [{
      title: 'Last Updated by',
      dataIndex: 'updatedBy',
      key: 'updatedBy',
      render: (text) => {
        return text !== 'undefined' && text ? text : ''
      }
    }, {
      title: 'Last Updated',
      dataIndex: 'updateAt',
      key: 'updateAt',
      render: (text) => {
        return text ? moment().format('MMMM Do YYYY, HH:mm') : ''
      }
    }]
  }]

  const tableProps = {
    dataSource: listHistory,
    columns,
    bordered: true,
    pagination: false
  }

  return (
    <div className="content-inner">
      <h2>Booking ID: <strong>{listHistory[0].bookingId.match(/\d{4}/g).join('-')}</strong></h2>
      <Table {...tableProps} />
    </div>
  )
}

export default connect(({ bookinghistory }) => ({ bookinghistory }))(History)
