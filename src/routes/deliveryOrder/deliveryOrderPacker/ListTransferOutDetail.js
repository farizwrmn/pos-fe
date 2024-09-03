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
      width: '150px'
    },
    {
      title: 'Product Name',
      dataIndex: 'productName',
      key: 'productName',
      width: '250px'
    },
    {
      title: 'Qty',
      dataIndex: 'qty',
      key: 'qty',
      width: '50px',
      className: styles.alignRight,
      render: text => (text || '-').toLocaleString()
    }
  ]

  return (
    <div>
      <Table
        bordered={false}
        scroll={{ y: 700 }}
        columns={columns}
        simple
        rowKey={record => record.transNo}
        {...tableProps}
      />
    </div>
  )
}

export default ListTransferOutDetail
