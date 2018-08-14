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
      key: 'productCode',
      width: '200px'
    },
    {
      title: 'Product Name',
      dataIndex: 'productName',
      key: 'productName',
      width: '200px'
    },
    {
      title: 'Transfer In',
      dataIndex: 'adjInQty',
      key: 'adjInQty',
      width: '150px',
      render: text => text.toLocaleString()
    },
    {
      title: 'Transfer Out',
      dataIndex: 'adjOutQty',
      key: 'adjOutQty',
      width: '150px',
      render: text => text.toLocaleString()
    },
    {
      title: 'In Transfer',
      dataIndex: 'inTransferQty',
      key: 'inTransferQty',
      width: '150px',
      render: text => text.toLocaleString()
    },
    {
      title: 'In Transit',
      dataIndex: 'inTransitQty',
      key: 'inTransitQty',
      width: '150px',
      render: text => text.toLocaleString()
    }
  ]

  return (
    <Table
      {...browseProps}
      bordered
      scroll={{ x: '1000px', y: 300 }}
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
