import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'
import moment from 'moment'

const List = ({ ...tableProps, editList }) => {
  const handleMenuClick = (record) => {
    editList(record)
  }

  const columns = [
    {
      title: 'No',
      dataIndex: 'id',
      key: 'id'
    },
    {
      title: 'CashierTrans',
      dataIndex: 'cashierTransId',
      key: 'cashierTransId'
    },
    {
      title: 'Cashier Name',
      dataIndex: 'cashierName',
      key: 'cashierName'
    },
    {
      title: 'Type',
      dataIndex: 'typeCode',
      key: 'typeCode'
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount'
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description'
    },
    {
      title: 'Print Date',
      dataIndex: 'printDate',
      key: 'printDate',
      render: (text) => {
        return text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : null
      }
    },
    {
      title: 'Card Name',
      dataIndex: 'cardName',
      key: 'cardName'
    },
    {
      title: 'Card No.',
      dataIndex: 'cardNo',
      key: 'cardNo'
    }
  ]

  return (
    <div>
      <Table {...tableProps}
        bordered
        scroll={{ x: 500 }}
        columns={columns}
        simple
        rowKey={record => record.id}
        onRowClick={record => handleMenuClick(record)}
      />
    </div>
  )
}

List.propTypes = {
  editList: PropTypes.func
}

export default List
