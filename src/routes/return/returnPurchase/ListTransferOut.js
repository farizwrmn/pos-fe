import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'

const ListTransfer = ({ ...tableProps, updateFilter }) => {
  const handleChange = (pagination, filters, sorter) => {
    updateFilter(filters, sorter)
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
      key: 'transDate'
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status'
    },
    {
      title: 'Transaction No',
      dataIndex: 'transNo',
      key: 'transNo'
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
        onChange={handleChange}
      />
    </div>
  )
}

ListTransfer.propTypes = {
  sort: PropTypes.object,
  filter: PropTypes.object,
  updateFilter: PropTypes.func,
  onShowPrint: PropTypes.func,
  showPrintModal: PropTypes.bool,
  storeInfo: PropTypes.object,
  user: PropTypes.func,
  listReturnSales: PropTypes.object,
  getProducts: PropTypes.func,
  getTrans: PropTypes.func,
  listProducts: PropTypes.object,
  listTransOut: PropTypes.object,
  onClosePrint: PropTypes.func
}

export default ListTransfer
