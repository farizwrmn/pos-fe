import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'
import styles from '../../../themes/index.less'

const ListFilenameImportCSV = ({ ...tableProps }) => {
  const columns = [
    {
      title: 'BankName',
      dataIndex: 'bankName',
      key: 'bankName',
      className: styles.alignRight
    },
    {
      title: 'filename',
      dataIndex: 'filename',
      key: 'filename',
      className: styles.alignRight
    },
    {
      title: 'createdBy',
      dataIndex: 'createdBy',
      key: 'createdBy'
    },
    {
      title: 'createdAt',
      dataIndex: 'createdAt',
      key: 'createdAt'
    }
  ]

  return (
    <div>
      <Table {...tableProps}
        bordered
        columns={columns}
        simple
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
