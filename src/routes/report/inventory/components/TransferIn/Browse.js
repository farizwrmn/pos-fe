import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'
import moment from 'moment'

const Browse = ({ ...browseProps }) => {
  const columns = [
    {
      title: 'Invoice',
      dataIndex: 'transNo',
      key: 'transNo',
      width: '200px'
    },
    {
      title: 'Date',
      dataIndex: 'transDate',
      key: 'transDate',
      width: '175px',
      render: text => `${moment(text).format('LL ')}`
    },
    {
      title: 'Reference',
      dataIndex: 'referenceTrans',
      key: 'referenceTrans',
      width: '200px'
    },
    {
      title: 'Product Code',
      dataIndex: 'productCode',
      key: 'productCode',
      width: '190px'
    },
    {
      title: 'Product Name',
      dataIndex: 'productName',
      key: 'productName',
      width: '350px'
    },
    {
      title: 'Qty',
      dataIndex: 'qty',
      key: 'qty',
      width: '80px'
    },
    {
      title: 'Unit Price',
      dataIndex: 'purchasePrice',
      key: 'purchasePrice',
      width: '130px',
      render: text => Math.round(text).toLocaleString()
    },
    {
      title: 'Total',
      dataIndex: 'nettoTotal',
      key: 'nettoTotal',
      width: '130px',
      render: text => Math.round(text).toLocaleString()
    },
    {
      title: 'Type',
      dataIndex: 'transType',
      key: 'transType',
      width: '100px'
    }
  ]

  return (
    <div>
      <Table
        style={{ clear: 'both' }}
        {...browseProps}
        bordered
        scroll={{ x: 1200, y: 300 }}
        columns={columns}
        simple
        size="small"
      />
    </div>
  )
}

Browse.propTypes = {
  location: PropTypes.object,
  onExportExcel: PropTypes.func
}

export default Browse
