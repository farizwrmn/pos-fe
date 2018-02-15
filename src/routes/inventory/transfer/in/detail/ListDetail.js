import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'

const List = ({ ...tableProps, editList }) => {
  const handleMenuClick = (record) => {
    editList(record)
  }

  const columns = [
    {
      title: 'No',
      dataIndex: 'no',
      key: 'no'
    },
    {
      title: 'Product Code',
      dataIndex: 'productCode',
      key: 'productCode',
      render: (text, record) => (record.productCode || record.serviceCode)
    },
    {
      title: 'Product Name',
      dataIndex: 'productName',
      key: 'productName',
      render: (text, record) => (record.productName || record.serviceName)
    },
    {
      title: 'Qty',
      dataIndex: 'qty',
      key: 'qty'
    }
  ]

  return (
    <div>
      <Table {...tableProps}
        bordered={false}
        scroll={{ x: 500, y: 700 }}
        columns={columns}
        simple
        rowKey={record => record.no}
        onRowClick={record => handleMenuClick(record)}
      />
    </div>
  )
}

List.propTypes = {
  editList: PropTypes.func
}

export default List
