/**
 * Created by Vendrie on 24/09/2020.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'
import { Link } from 'dva/router'
import { numberFormat } from 'utils'

const { formatNumberIndonesia } = numberFormat

const BrowseReturn = ({ ...browseProps }) => {
  const columns = [
    {
      title: 'Trans Sales',
      dataIndex: 'posDetail.transNo',
      key: 'posDetail.transNo',
      width: '120px',
      render: (text, record) => (record.posDetail.transNo ? <Link to={`/accounts/payment/${encodeURIComponent(record.posDetail.transNo)}`}>{text}</Link> : <p>{text}</p>)
    },
    {
      title: 'Trans Return',
      dataIndex: 'returnSales.transNo',
      key: 'returnSales.transNo',
      width: '120px'
    },
    {
      title: 'Product Code',
      dataIndex: 'product.productCode',
      key: 'product.productCode',
      width: '120px'
    },
    {
      title: 'Product Name',
      dataIndex: 'product.productName',
      key: 'product.productName',
      width: '300px'
    },
    {
      title: 'Qty',
      dataIndex: 'qty',
      key: 'qty',
      width: '60px',
      render: text => <p style={{ textAlign: 'right' }}>{formatNumberIndonesia(text)}</p>
    }
  ]

  return (
    <Table
      {...browseProps}
      bordered
      columns={columns}
      simple
      size="small"
      style={{ marginTop: '2rem' }}
      rowKey={record => record.id}
    />
  )
}

BrowseReturn.propTypes = {
  location: PropTypes.object,
  onExportExcel: PropTypes.func
}

export default BrowseReturn
