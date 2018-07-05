import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'
import { numberFormat } from 'utils'
import moment from 'moment'

const formatNumberIndonesia = numberFormat.formatNumberIndonesia

const List = ({ ...tableProps, dataSource }) => {
  const columns = [
    {
      title: 'Date',
      dataIndex: 'transDate',
      key: 'transDate',
      render: text => <p style={{ textAlign: 'left' }}>{moment(text).format('DD-MMM-YYYY')}</p>
    },
    {
      title: 'Invoice',
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
      render: text => <p style={{ textAlign: 'right' }}>{formatNumberIndonesia(text)}</p>
    },
    {
      title: 'Selling Price',
      dataIndex: 'sellingPrice',
      key: 'sellingPrice',
      render: text => <p style={{ textAlign: 'right' }}>{formatNumberIndonesia(text)}</p>
    },
    {
      title: 'Discount',
      dataIndex: 'discount',
      key: 'discount',
      render: text => <p style={{ textAlign: 'right' }}>{formatNumberIndonesia(text)}</p>
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: text => <p style={{ textAlign: 'right' }}>{formatNumberIndonesia(text)}</p>
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
        footer={() => `Total: ${formatNumberIndonesia(totalPrice)}`}
        rowKey={record => record.id}
      />
    </div>
  )
}

List.propTypes = {
  dataSource: PropTypes.array
}

export default List

