/**
 * Created by Veirry on 17/09/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'
import { numberFormat } from 'utils'

const BrowseTotal = ({ listOpts, ...browseProps }) => {
  const mappedColumn = listOpts.map(item => ({
    title: item.typeName,
    dataIndex: item.typeCode,
    key: item.typeCode,
    width: '150px',
    render: text => numberFormat.numberFormatter(text)
  }))
  const columns = [
    {
      title: 'Bank',
      dataIndex: 'machine',
      key: 'machine',
      width: '150px'
    },
    ...mappedColumn
  ]

  return (
    <Table
      {...browseProps}
      bordered
      columns={columns}
      simple
      size="small"
      rowKey={record => record.machine}
    />
  )
}

BrowseTotal.propTypes = {
  location: PropTypes.object,
  onExportExcel: PropTypes.func
}

export default BrowseTotal
