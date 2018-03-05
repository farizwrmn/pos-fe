import React from 'react'
import { Table } from 'antd'
import moment from 'moment'

const Browse = ({ ...browseProps }) => {
  const columns = [
    {
      title: 'Invoice',
      dataIndex: 'transNo',
      key: 'transNo',
      width: '155px'
    },
    {
      title: 'Date',
      dataIndex: 'transDate',
      key: 'transDate',
      width: '175px',
      render: text => `${moment(text).format('LL ')}`
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
      width: '50px'
    },
    {
      title: 'Unit Price',
      dataIndex: 'sellingPrice',
      key: 'sellingPrice',
      width: '100px',
      render: text => text.toLocaleString()
    },
    {
      title: 'Sub Total',
      dataIndex: 'total',
      key: 'total',
      width: '100px',
      render: text => text.toLocaleString()
    },
    {
      title: 'Discount',
      dataIndex: 'totalDiscount',
      key: 'totalDiscount',
      width: '100px',
      render: text => text.toLocaleString()
    },
    {
      title: 'Total',
      dataIndex: 'netto',
      key: 'netto',
      width: '100px',
      render: text => text.toLocaleString()
    }
  ]

  return (
    <div>
      <Table
        style={{ clear: 'both' }}
        {...browseProps}
        bordered
        scroll={{ x: 1200, y: 700 }}
        columns={columns}
        simple
        size="small"
        rowKey={record => record.id}
      />
    </div>
  )
}

export default Browse
