/**
 * Created by Veirry on 17/09/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'

const Browse = ({ ...browseProps }) => {
  const columns = [
    {
      title: 'Account',
      dataIndex: 'accountName',
      key: 'accountName',
      width: '175px'
    },
    {
      title: 'Debit',
      dataIndex: 'debit',
      key: 'debit',
      width: '155px',
      render: text => (text || '-').toLocaleString()
    },
    {
      title: 'Credit',
      dataIndex: 'credit',
      key: 'credit',
      width: '155px',
      render: text => (text || '-').toLocaleString()
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
