import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'
import styles from '../../../../../themes/index.less'

const List = ({ ...tableProps, editList }) => {
  const handleMenuClick = (record) => {
    editList(record)
  }

  const columns = [
    {
      title: 'No',
      dataIndex: 'no',
      width: 50,
      className: styles.alignCenter,
      key: 'no'
    },
    {
      title: 'Product Code',
      dataIndex: 'productCode',
      key: 'productCode',
      width: 175,
      className: styles.alignCenter,
      render: (text, record) => (record.productCode || record.serviceCode)
    },
    {
      title: 'Product Name',
      dataIndex: 'productName',
      key: 'productName',
      width: 200,
      render: (text, record) => (record.productName || record.serviceName)
    },
    {
      title: 'Qty',
      dataIndex: 'qty',
      key: 'qty',
      className: styles.alignRight,
      width: 60,
      render: text => (text || '-').toLocaleString()
    }
  ]

  return (
    <div>
      <Table {...tableProps}
        bordered={false}
        pagination={false}
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
