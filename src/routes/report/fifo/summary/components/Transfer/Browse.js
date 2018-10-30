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
      title: 'Product Name',
      dataIndex: 'productName',
      key: 'productName'
    },
    {
      title: 'Transfer In',
      dataIndex: 'adjInQty',
      key: 'adjInQty',
      render: text => text.toLocaleString()
    },
    {
      title: 'Transfer Out',
      dataIndex: 'adjOutQty',
      key: 'adjOutQty',
      render: text => text.toLocaleString()
    },
    {
      title: 'In Transfer',
      dataIndex: 'inTransferQty',
      key: 'inTransferQty',
      render: text => text.toLocaleString()
    },
    {
      title: 'In Transit',
      dataIndex: 'inTransitQty',
      key: 'inTransitQty',
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
