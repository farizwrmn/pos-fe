/**
 * Created by Veirry on 24/11/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'
import moment from 'moment'

const Browse = ({ ...browseProps }) => {
  const columns = [
    {
      title: 'Product Code',
      dataIndex: 'productCode',
      key: 'productCode',
      width: '150px'
    },
    {
      title: 'Type',
      dataIndex: 'transType',
      key: 'transType',
      width: '50px',
      render: text => <p style={{ textAlign: 'left' }}>{text}</p>
    },
    {
      title: 'Date',
      dataIndex: 'transDate',
      key: 'transDate',
      width: '175px',
      render: text => <p style={{ textAlign: 'left' }}>{moment(text).format('DD-MMM-YYYY')}</p>
    },
    {
      title: 'IN',
      dataIndex: 'pQty',
      key: 'pQty',
      width: '50px',
      render: text => <p style={{ textAlign: 'right' }}>{(parseFloat(text) || '').toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
    },
    {
      title: 'Price',
      dataIndex: 'pPrice',
      key: 'pPrice',
      width: '100px',
      render: text => <p style={{ textAlign: 'right' }}>{(parseFloat(text) || '').toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
    },
    {
      title: 'Amount',
      dataIndex: 'pAmount',
      key: 'pAmount',
      width: '150px',
      render: text => <p style={{ textAlign: 'right' }}>{(parseFloat(text) || '').toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
    },
    {
      title: 'Out',
      dataIndex: 'sQty',
      key: 'sQty',
      width: '50px',
      render: text => <p style={{ textAlign: 'right' }}>{(parseFloat(text) || '').toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
    },
    {
      title: 'Price',
      dataIndex: 'sPrice',
      key: 'sPrice',
      width: '100px',
      render: text => <p style={{ textAlign: 'right' }}>{(parseFloat(text) || '').toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
    },
    {
      title: 'Amount',
      dataIndex: 'sAmount',
      key: 'sAmount',
      width: '150px',
      render: text => <p style={{ textAlign: 'right' }}>{(parseFloat(text) || '').toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
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
        rowKey={record => record.transNo}
      />
    </div>
  )
}

Browse.propTypes = {
  location: PropTypes.object,
  onExportExcel: PropTypes.func
}

export default Browse
