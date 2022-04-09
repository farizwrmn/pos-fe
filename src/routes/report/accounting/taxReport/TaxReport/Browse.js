/**
 * Created by Veirry on 17/09/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'

const Browse = ({ ...browseProps }) => {
  const columns = [
    {
      title: 'TYPE',
      dataIndex: 'type',
      key: 'type',
      width: '175px'
    },
    {
      title: 'DPP',
      dataIndex: 'DPP',
      key: 'DPP',
      width: '155px',
      render: text => (text || '-').toLocaleString()
    },
    {
      title: 'PPN',
      dataIndex: 'PPN',
      key: 'PPN',
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
