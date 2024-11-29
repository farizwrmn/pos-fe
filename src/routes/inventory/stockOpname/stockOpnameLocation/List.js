import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'

const List = ({ location, ...tableProps }) => {
  console.log('location', location)
  const columns = [
    {
      title: 'Location Name',
      dataIndex: 'locationName',
      key: 'locationName'
    },
    {
      title: 'Barcode',
      dataIndex: 'barcode',
      key: 'barcode'
    }
  ]

  return (
    <div>
      <Table {...tableProps}
        bordered
        columns={columns}
        simple
        scroll={{ x: 1000 }}
        rowKey={record => record.id}
      />
    </div>
  )
}

List.propTypes = {
  editItem: PropTypes.func,
  deleteItem: PropTypes.func
}

export default List
