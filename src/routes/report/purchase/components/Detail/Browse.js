import React from 'react'
import { Table } from 'antd'
import styles from '../../../../../themes/index.less'

const Browse = ({ ...browseProps }) => {
  const columns = [
    {
      title: 'Invoice',
      dataIndex: 'transNo',
      key: 'transNo',
      width: '175px'
    },
    {
      title: 'Product Code',
      dataIndex: 'productCode',
      key: 'productCode',
      width: '200px'
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
    },
    {
      title: 'Unit Price',
      dataIndex: 'purchasePrice',
      key: 'purchasePrice',
      width: '100px',
      className: styles.alignRight,
      render: text => (text || '-').toLocaleString()
    },
    {
      title: 'Discount',
      dataIndex: 'totalDiscount',
      key: 'totalDiscount',
      width: '100px',
      className: styles.alignRight,
      render: text => (text || '-').toLocaleString()
    },
    {
      title: 'Total',
      dataIndex: 'netto',
      key: 'netto',
      width: '100px',
      className: styles.alignRight,
      render: text => (text || '-').toLocaleString()
    },
    {
      title: 'Grand Total',
      dataIndex: 'grandtotal',
      key: 'grandtotal',
      width: '100px',
      className: styles.alignRight,
      render: text => (text || '-').toLocaleString()
    }
  ]

  return (
    <div>
      <Table
        {...browseProps}
        bordered
        scroll={{ x: 1125, y: 300 }}
        columns={columns}
        simple
        size="small"
      />
    </div>
  )
}

export default Browse
