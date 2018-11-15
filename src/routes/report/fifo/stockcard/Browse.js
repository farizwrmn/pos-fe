/**
 * Created by Veirry on 24/11/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'
import moment from 'moment'
import { numberFormat } from 'utils'

const { formatNumberIndonesia } = numberFormat

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
      width: '50px'
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
      render: text => <p style={{ textAlign: 'right' }}>{formatNumberIndonesia(parseFloat(text) || '')}</p>
    },
    {
      title: 'Price',
      dataIndex: 'pPrice',
      key: 'pPrice',
      width: '100px',
      render: text => <p style={{ textAlign: 'right' }}>{formatNumberIndonesia(parseFloat(text) || '')}</p>
    },
    {
      title: 'Amount',
      dataIndex: 'pAmount',
      key: 'pAmount',
      width: '150px',
      render: text => <p style={{ textAlign: 'right' }}>{formatNumberIndonesia(parseFloat(text) || '')}</p>
    },
    {
      title: 'Out',
      dataIndex: 'sQty',
      key: 'sQty',
      width: '50px',
      render: text => <p style={{ textAlign: 'right' }}>{formatNumberIndonesia(parseFloat(text) || '')}</p>
    },
    {
      title: 'Price',
      dataIndex: 'sPrice',
      key: 'sPrice',
      width: '100px',
      render: text => <p style={{ textAlign: 'right' }}>{formatNumberIndonesia(parseFloat(text) || '')}</p>
    },
    {
      title: 'Amount',
      dataIndex: 'sAmount',
      key: 'sAmount',
      width: '150px',
      render: text => <p style={{ textAlign: 'right' }}>{formatNumberIndonesia(parseFloat(text) || '')}</p>
    }
  ]

  return (
    <Table
      {...browseProps}
      bordered
      scroll={{ x: 1000, y: 300 }}
      columns={columns}
      simple
      size="small"
    />
  )
}

Browse.propTypes = {
  location: PropTypes.object,
  onExportExcel: PropTypes.func
}

export default Browse
