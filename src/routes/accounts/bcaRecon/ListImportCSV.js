import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'
import { formatTimeBCA } from './utils'
import styles from '../../../themes/index.less'

const ListImportCSV = ({ ...tableProps }) => {
  const columns = [
    {
      title: 'Amount',
      dataIndex: 'grossAmount',
      key: 'grossAmount',
      className: styles.alignRight,
      render: (text) => {
        return text ? text.toLocaleString() : ''
      }
    },
    {
      title: 'Date',
      dataIndex: 'transactionDate',
      key: 'transactionDate'
    },
    {
      title: 'Time',
      dataIndex: 'transactionTime',
      key: 'transactionTime',
      className: styles.alignRight,
      render: (text) => {
        return (
          <div>
            {formatTimeBCA(text)}
          </div>
        )
      }
    },
    {
      title: 'Approval Code',
      dataIndex: 'approvalCode',
      key: 'approvalCode',
      className: styles.alignRight
    },
    {
      title: 'MDR',
      dataIndex: 'mdrAmount',
      key: 'mdrAmount',
      className: styles.alignLeft
    },
    {
      title: 'match',
      dataIndex: 'match',
      key: 'match',
      className: styles.alignLeft,
      render: (text, record) => {
        if (!record.match) {
          return ''
        }
        return (
          <div>match</div>
        )
      }
    }
  ]

  return (
    <div>
      <Table {...tableProps}
        bordered
        columns={columns}
        simple
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
