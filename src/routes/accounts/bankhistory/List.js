import React from 'react'
import PropTypes from 'prop-types'
import {
  Table, Tag
} from 'antd'
import {
  currencyFormatter
} from 'utils/string'
import { getName, getLink } from 'utils/link'
import styles from '../../../themes/index.less'


const List = ({ dispatch, ...tableProps, summaryBankRecon }) => {
  const columns = [
    {
      title: 'Type',
      dataIndex: 'transactionType',
      key: 'transactionType',
      render: (text, record) => {
        return (
          <a onClick={() => getLink(dispatch, { transactionType: text, transactionId: record.transactionId })}>
            {getName(text)}
          </a>
        )
      }
    },
    {
      title: 'Date',
      dataIndex: 'transDate',
      key: 'transDate'
    },
    {
      title: 'Debit',
      dataIndex: 'debit',
      key: 'debit',
      className: styles.alignRight,
      render: text => (text || '-').toLocaleString()
    },
    {
      title: 'Credit',
      dataIndex: 'credit',
      key: 'credit',
      className: styles.alignRight,
      render: text => (text || '-').toLocaleString()
    },
    {
      title: 'Status',
      dataIndex: 'recon',
      key: 'recon',
      className: styles.alignRight,
      render: (text) => {
        if (text) {
          return (
            <Tag color="green">
              Recon
            </Tag>
          )
        }
        return (
          <Tag color="yellow">
            Not Recon
          </Tag>
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
        title={() => (summaryBankRecon && summaryBankRecon[0]
          ? `Balance: ${currencyFormatter(summaryBankRecon[0].amount)}`
          : null)}
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
