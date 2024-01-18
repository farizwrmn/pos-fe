import React from 'react'
import { Table } from 'antd'
import styles from '../../../themes/index.less'

const ListTransferOutDetail = ({ ...tableProps }) => {
  const columns = [
    {
      title: 'TransNo',
      dataIndex: 'transNo',
      key: 'transNo',
      width: '150px'
    },
    {
      title: 'Product Code',
      dataIndex: 'productCode',
      key: 'productCode',
      width: '150px',
      render: (text, record) => (record.productCode || record.serviceCode)
    },
    {
      title: 'Product Name',
      dataIndex: 'productName',
      key: 'productName',
      width: '250px',
      render: (text, record) => (record.productName || record.serviceName)
    },
    {
      title: 'Qty',
      dataIndex: 'qty',
      key: 'qty',
      width: '50px',
      className: styles.alignRight,
      render: text => (text || '-').toLocaleString()
    },
    {
      title: 'Price',
      dataIndex: 'purchasePrice',
      key: 'purchasePrice',
      width: '70px',
      className: styles.alignRight,
      render: text => (text || '-').toLocaleString()
    },
    {
      title: 'Latest',
      dataIndex: 'latestPrice',
      key: 'latestPrice',
      width: '70px',
      className: styles.alignRight,
      render: text => (text || '-').toLocaleString()
    },
    {
      title: 'Subtotal',
      dataIndex: 'subtotal',
      key: 'subtotal',
      width: '75px',
      className: styles.alignRight,
      render: (text, record) => (parseFloat(record.qty) * parseFloat(record.purchasePrice) || '-').toLocaleString()
    }
  ]

  return (
    <div>
      <Table
        bordered={false}
        scroll={{ x: 600, y: 700 }}
        columns={columns}
        simple
        rowKey={record => record.transNo}
        {...tableProps}
      />
    </div>
  )
}

export default ListTransferOutDetail
