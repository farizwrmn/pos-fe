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
      title: 'Product Name',
      dataIndex: 'productName',
      key: 'productName',
      width: '150px'
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
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
      title: 'Qty',
      dataIndex: 'qty',
      key: 'qty',
      width: '50px',
      render: (text, record) => <p style={{ textAlign: 'right' }}>{formatNumberIndonesia(parseFloat(record.type === 'IN' ? record.qty : record.qty * -1) || '')}</p>
    },
    {
      title: 'Price',
      dataIndex: 'DPP',
      key: 'DPP',
      width: '150px',
      render: text => <p style={{ textAlign: 'right' }}>{formatNumberIndonesia(parseFloat(text) || '')}</p>
    },
    {
      title: 'Amount',
      dataIndex: 'total',
      key: 'total',
      width: '150px',
      render: (text, record) => <p style={{ textAlign: 'right' }}>{formatNumberIndonesia(parseFloat(record.type === 'IN' ? record.total : record.total * -1) || '')}</p>
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
