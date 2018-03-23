import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'
import moment from 'moment'

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
      render: text => <p style={{ textAlign: 'right' }}>{text.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
    },
    {
      title: 'Selling Price',
      dataIndex: 'sellingPrice',
      key: 'sellingPrice',
      render: text => <p style={{ textAlign: 'right' }}>{text.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
    },
    {
      title: 'Discount',
      dataIndex: 'discount',
      key: 'discount',
      render: text => <p style={{ textAlign: 'right' }}>{text.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: text => <p style={{ textAlign: 'right' }}>{text.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
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

