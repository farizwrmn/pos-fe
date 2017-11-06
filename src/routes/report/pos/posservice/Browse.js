/**
 * Created by Veirry on 29/09/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'

const Browse = ({ ...browseProps }) => {
  const columns = [
    {
      title: 'Trans',
      dataIndex: 'transNo',
      key: 'transNo',
      width: '155px',
    },
    {
      title: 'Date',
      dataIndex: 'transDate',
      key: 'transDate',
      width: '175px',
    },
    {
      title: 'Product',
      dataIndex: 'product',
      key: 'product',
      width: '100px',
    },
    {
      title: 'Service',
      dataIndex: 'service',
      key: 'service',
      width: '100px',
    },
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
        rowKey={record => record.productCode}
      />
    </div>
  )
}

Browse.propTypes = {
  location: PropTypes.object,
  onExportExcel: PropTypes.func.isRequired,
}

export default Browse
