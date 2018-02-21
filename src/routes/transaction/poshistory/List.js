import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { Table, Button } from 'antd'

const List = ({ ...tableProps }) => {
  const printPOSHistory = (record) => {
    console.log(record.transNo)
  }
  const columns = [
    {
      title: 'Store Name',
      dataIndex: 'storeName',
      key: 'storeName'
    },
    {
      title: 'Store Name Receiver',
      dataIndex: 'storeNameReceiver',
      key: 'storeNameReceiver'
    },
    {
      title: 'Transaction Date',
      dataIndex: 'transDate',
      key: 'transDate',
      render: (text) => {
        return moment(text).format('DD MMMM YYYY')
      }
    },
    {
      title: 'Transaction No',
      dataIndex: 'transNo',
      key: 'transNo'
    },
    {
      title: 'Operation',
      key: 'operation',
      width: 100,
      fixed: 'right',
      render: (record) => {
        return <Button type="primary" onClick={() => printPOSHistory(record)}>Print</Button>
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
