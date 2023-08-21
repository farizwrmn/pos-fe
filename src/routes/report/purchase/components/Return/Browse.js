/**
 * Created by Veirry on 19/09/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'
import moment from 'moment'

const Browse = ({ dataSource, ...browseProps }) => {
  const columns = [
    {
      title: 'Invoice',
      dataIndex: 'transNo',
      key: 'transNo',
      width: '100px'
    },
    {
      title: 'Store',
      dataIndex: 'storeName',
      key: 'storeName',
      width: '100px'
    },
    {
      title: 'Supplier',
      dataIndex: 'supplierName',
      key: 'supplierName',
      width: '100px'
    },
    {
      title: 'Date',
      dataIndex: 'transDate',
      key: 'transDate',
      width: '150px',
      render: text => <p style={{ textAlign: 'left' }}>{moment(text).format('DD-MMM-YYYY')}</p>
    },
    {
      title: 'MEMO',
      dataIndex: 'memo',
      key: 'memo',
      width: '200px'
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
      rowKey={record => record.transNo}
      dataSource={dataSource}
    />
  )
}

Browse.propTypes = {
  location: PropTypes.object,
  onExportExcel: PropTypes.func
}

export default Browse
