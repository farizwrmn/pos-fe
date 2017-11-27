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
      width: '100px',
    },
    {
      title: 'Date',
      dataIndex: 'transDate',
      key: 'transDate',
      width: '150px',
      render: text => `${moment(text).format('LL ')}`,
    },
    {
      title: 'CODE',
      dataIndex: 'productCode',
      key: 'productCode',
      width: '200px',
    },
    {
      title: 'PRODUCT',
      dataIndex: 'productName',
      key: 'productName',
      width: '200px',
    },
    {
      title: 'QTY',
      dataIndex: 'qty',
      key: 'qty',
      width: '50px',
    },
    {
      title: 'Total',
      dataIndex: 'amount',
      key: 'amount',
      width: '100px',
    },
    {
      title: 'MEMO',
      dataIndex: 'memo',
      key: 'memo',
      width: '200px',
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
        dataSource={dataSource}
      />
    </div>
  )
}

Browse.propTypes = {
  location: PropTypes.object,
  onExportExcel: PropTypes.func,
}

export default Browse
