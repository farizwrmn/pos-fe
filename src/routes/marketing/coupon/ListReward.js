import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'

const List = ({ columns, ...tableProps }) => {
  return (
    <div>
      <Table {...tableProps}
        columns={columns}
        simple
        scroll={{ x: 519 }}
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
