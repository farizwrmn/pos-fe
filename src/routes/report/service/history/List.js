import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'
import moment from 'moment'
import styles from '../../../../themes/index.less'

const List = ({ ...tableProps, dataSource }) => {
  const columns = [
    {
      title: 'Transaction Date',
      dataIndex: 'transDate',
      key: 'transDate',
      render: (text) => {
        return moment(text).format('MMMM, Do YYYY')
      }
    },
    {
      title: 'Transaction No',
      dataIndex: 'transNo',
      key: 'transNo'
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status'
    },
    {
      title: 'Employee Name',
      dataIndex: 'employeeName',
      key: 'employeeName'
    },
    {
      title: 'Service Name',
      dataIndex: 'serviceName',
      key: 'serviceName'
    },
    {
      title: 'Qty',
      dataIndex: 'qty',
      key: 'qty',
      className: styles.alignRight,
      render: text => text.toLocaleString()
    },
    {
      title: 'Selling Price',
      dataIndex: 'sellingPrice',
      key: 'sellingPrice',
      className: styles.alignRight,
      render: text => text.toLocaleString()
    },
    {
      title: 'Discount',
      dataIndex: 'discount',
      key: 'discount',
      className: styles.alignRight,
      render: text => text.toLocaleString()
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      className: styles.alignRight,
      render: text => text.toLocaleString()
    }
  ]

  const totalPrice = dataSource.reduce((cnt, o) => cnt + parseFloat(o.amount), 0)

  return (
    <div>
      <Table {...tableProps}
        bordered
        scroll={{ x: 1300 }}
        columns={columns}
        simple
        footer={() => `Total: ${totalPrice.toLocaleString(['ban', 'id'], { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`}
        rowKey={record => record.id}
      />
    </div>
  )
}

List.propTypes = {
  dataSource: PropTypes.array
}

export default List

