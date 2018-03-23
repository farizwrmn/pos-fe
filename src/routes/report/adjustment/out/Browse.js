/**
 * Created by Veirry on 29/09/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'

const Browse = ({ ...browseProps }) => {
  const columns = [
    {
      title: 'Code',
      dataIndex: 'productCode',
      key: 'productCode',
      width: '155px'
    },
    {
      title: 'Description',
      dataIndex: 'productName',
      key: 'productName',
      width: '200px'
    },
    {
      title: 'Date',
      dataIndex: 'transDate',
      key: 'transDate',
      width: '175px'
    },
    {
      title: 'QTY',
      dataIndex: 'qtyOut',
      key: 'qtyOut',
      width: '100px'
    },
    {
      title: 'Price',
      dataIndex: 'costPrice',
      key: 'costPrice',
      width: '100px',
      render: text => <p style={{ textAlign: 'right' }}>{text.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
    },
    {
      title: 'Total',
      dataIndex: 'amount',
      key: 'amount',
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
        scroll={{ x: 890, y: 300 }}
        columns={columns}
        simple
        size="small"
      // rowKey={record => record.productCode}
      />
    </div>
  )
}

Browse.propTypes = {
  location: PropTypes.object,
  onExportExcel: PropTypes.func
}

export default Browse
