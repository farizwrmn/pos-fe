/**
 * Created by Veirry on 17/09/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'

const Browse = ({ ...browseProps }) => {
  const columns = [
    {
      title: 'Product Code',
      dataIndex: 'productCode',
      key: 'productCode'
    },
    {
      title: 'Begin',
      dataIndex: 'beginQty',
      key: 'beginQty',
      render: text => text.toLocaleString()
    },
    {
      title: 'Purchase Qty',
      dataIndex: 'purchaseQty',
      key: 'purchaseQty',
      render: text => text.toLocaleString()
    },
    {
      title: 'Adjust IN',
      dataIndex: 'adjInQty',
      key: 'adjInQty',
      render: text => text.toLocaleString()
    },
    {
      title: 'POS Qty',
      dataIndex: 'posQty',
      key: 'posQty',
      render: text => text.toLocaleString()
    },
    {
      title: 'Adjust OUT',
      dataIndex: 'adjOutQty',
      key: 'adjOutQty',
      render: text => text.toLocaleString()
    },
    {
      title: 'Count',
      dataIndex: 'count',
      key: 'count',
      render: text => text.toLocaleString()
    }
  ]

  return (
    <Table
      {...browseProps}
      bordered
      columns={columns}
      simple
      size="small"
      rowKey={record => record.transNo}
    />
  )
}

Browse.propTypes = {
  location: PropTypes.object,
  onExportExcel: PropTypes.func
}

export default Browse
