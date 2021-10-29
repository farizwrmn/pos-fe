/**
 * Created by Veirry on 17/09/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'
import { numberFormat } from 'utils'

const { formatNumberIndonesia } = numberFormat

const Browse = ({ ...browseProps }) => {
  const columns = [
    {
      title: 'Supplier',
      dataIndex: 'supplier.supplierName',
      key: 'supplier.supplierName',
      width: '155px'
    },
    {
      title: 'Owing',
      dataIndex: 'payable',
      key: 'payable',
      width: '100px',
      render: text => <p style={{ textAlign: 'right' }}>{formatNumberIndonesia(text || 0)}</p>
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
    />
  )
}

Browse.propTypes = {
  location: PropTypes.object,
  onExportExcel: PropTypes.func
}

export default Browse
