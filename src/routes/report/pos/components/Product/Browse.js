/**
 * Created by Veirry on 09/09/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'
import moment from 'moment'

const Browse = ({ ...browseProps }) => {
  const columns = [
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: '175px',
      render: text => `${moment(text).format('DD-MMM-YYYY')}`
    },
    {
      title: 'Product',
      dataIndex: 'productCode',
      key: 'productCode',
      width: '155px'
    },
    {
      title: 'Product Name',
      dataIndex: 'productName',
      key: 'productName'
    },
    {
      title: 'Qty',
      dataIndex: 'Qty',
      key: 'Qty',
      width: '60px',
      render: text => <p style={{ textAlign: 'right' }}>{text.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
    },
    {
      title: 'Total',
      dataIndex: 'Total',
      key: 'Total',
      width: '100px',
      render: text => <p style={{ textAlign: 'right' }}>{text.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
    },
    {
      title: 'Discount',
      dataIndex: 'discountTotal',
      key: 'discountTotal',
      width: '100px',
      render: text => <p style={{ textAlign: 'right' }}>{text.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
    },
    {
      title: 'Netto',
      dataIndex: 'Netto',
      key: 'Netto',
      width: '100px',
      render: text => <p style={{ textAlign: 'right' }}>{text.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
    }
  ]

  return (
    <div>
      <Table
        style={{ clear: 'both' }}
        {...browseProps}
        bordered
        scroll={{ x: 1000, y: 300 }}
        columns={columns}
        simple
        size="small"
        rowKey={record => record.createdAt + record.productCode}
      />
    </div>
  )
}

Browse.propTypes = {
  location: PropTypes.object,
  onExportExcel: PropTypes.func
}

export default Browse
