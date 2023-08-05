import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'
import styles from '../../../themes/index.less'

const ListFilenameImportCSV = ({ ...tableProps }) => {
  const columns = [
    {
      title: 'filename',
      dataIndex: 'filename',
      key: 'filename',
      className: styles.alignRight
    },
    {
      title: 'createdAt',
      dataIndex: 'createdAt',
      key: 'createdAt'
    },
    {
      title: 'createdBy',
      dataIndex: 'createdBy',
      key: 'createdBy'
    }
  ]

  return (
    <div>
      <Table {...tableProps}
        bordered
        columns={columns}
        simple
        scroll={{ x: 1200 }}
        rowKey={record => record.id}
      />
    </div>
  )
}

ListFilenameImportCSV.propTypes = {
  editItem: PropTypes.func,
  deleteItem: PropTypes.func
}

export default ListFilenameImportCSV
