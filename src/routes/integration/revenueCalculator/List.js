import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'

const List = ({ ...tableProps }) => {
  const columns = [
    {
      title: 'Code',
      dataIndex: 'accountCode',
      key: 'accountCode'
    },
    {
      title: 'Name',
      dataIndex: 'accountName',
      key: 'accountName'
    },
    {
      title: 'Parent',
      dataIndex: 'accountParentId',
      key: 'accountParentId'
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
