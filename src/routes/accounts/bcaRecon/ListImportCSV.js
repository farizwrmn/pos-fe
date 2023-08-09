import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'
import styles from '../../../themes/index.less'

const ListImportCSV = ({ ...tableProps }) => {
  const columns = [
    {
      title: 'Edc Batch Number',
      dataIndex: 'edcBatchNumber',
      key: 'edcBatchNumber',
      className: styles.alignRight
    },
    {
      title: 'grossAmount',
      dataIndex: 'grossAmount',
      key: 'grossAmount',
      className: styles.alignLeft
    },
    {
      title: 'mdr',
      dataIndex: 'mdr',
      key: 'mdr',
      className: styles.alignLeft
    },
    {
      title: 'transactionDate',
      dataIndex: 'transactionDate',
      key: 'transactionDate',
      className: styles.alignLeft
    },
    {
      title: 'match',
      dataIndex: 'match',
      key: 'match',
      className: styles.alignLeft,
      render: text => (text ? 'match' : '')
    }
  ]

  return (
    <div>
      <Table {...tableProps}
        bordered
        columns={columns}
        simple
        rowKey={record => record.id}
        pagination={false}
      />
    </div>
  )
}

ListImportCSV.propTypes = {
  editItem: PropTypes.func,
  deleteItem: PropTypes.func
}

export default ListImportCSV
