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
  const { dataSource } = tableProps
  const columns = [
    {
      title: 'Type',
      dataIndex: 'transactionType',
      key: 'transactionType',
      width: 100,
      render: (text, record) => {
        return (
          <a onClick={() => getLink(dispatch, { storeId: record.storeId, transactionType: text, transactionId: record.transactionId })}>
            {getName(text)}
          </a>
        )
      }
    },
    {
      title: 'Transaction No',
      dataIndex: 'transNo',
      key: 'transNo',
      width: 100
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      width: 300
    },
    {
      title: 'Date',
      dataIndex: 'transDate',
      key: 'transDate',
      width: 100
    },
    {
      title: 'Debit',
      dataIndex: 'debit',
      key: 'debit',
      width: 100,
      className: styles.alignRight,
      render: text => (text || '-').toLocaleString()
    },
    {
      title: 'Credit',
      dataIndex: 'credit',
      key: 'credit',
      width: 100,
      className: styles.alignRight,
      render: text => (text || '-').toLocaleString()
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      width: 100,
      className: styles.alignRight,
      render: text => (text || '-').toLocaleString()
    },
    {
      title: 'Status',
      dataIndex: 'recon',
      key: 'recon',
      width: 100,
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

  let debit = (dataSource || []).reduce((prev, record) => {
    return prev + (record.debit || 0)
  }, 0)

  let credit = (dataSource || []).reduce((prev, record) => {
    return prev + (record.credit || 0)
  }, 0)

  return (
    <div>
      <Table {...tableProps}
        bordered
        columns={columns}
        simple
        title={() => (summaryBankRecon && summaryBankRecon[0]
          ? `Balance: ${currencyFormatter(summaryBankRecon[0].amount)}`
          : null)}
        footer={() => (
          <div>
            <div>Debit {currencyFormatter(debit)}</div>
            <div>Kredit {currencyFormatter(credit)}</div>
          </div>
        )}
        scroll={{ x: 1000, y: 1000 }}
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
