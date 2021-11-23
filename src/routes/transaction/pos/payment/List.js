import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'
import moment from 'moment'

const List = ({ ...tableProps, editList }) => {
  const handleMenuClick = (record) => {
    if (record.typeCode !== 'V') {
      editList(record)
    }
  }

  const columns = [
    {
      title: 'No',
      dataIndex: 'id',
      key: 'id'
    },
    {
      title: 'Payment',
      dataIndex: 'typeCode',
      key: 'typeCode',
      render: (text, data) => {
        return (
          <div>
            <div>Type: {data.typeCode}</div>
            <div>Charge: <strong>{data.chargeTotal}</strong></div>
            <div>Amount: {data.amount}</div>
          </div>
        )
      }
    },
    {
      title: 'Customer',
      dataIndex: 'printDate',
      key: 'printDate',
      render: (text, data) => {
        return (
          <div>
            <div>Print Date: {text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : null}</div>
            <div>Card Name: {data.cardName}</div>
            <div>Card No: {data.cardNo}</div>
          </div>
        )
      }
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description'
    }
  ]

  return (
    <div>
      <Table {...tableProps}
        bordered
        scroll={{ x: 500 }}
        columns={columns}
        simple
        onRowClick={record => handleMenuClick(record)}
      />
    </div>
  )
}

List.propTypes = {
  editList: PropTypes.func
}

export default List
