import React from 'react'
import PropTypes from 'prop-types'
import { Tag, Table } from 'antd'
import { numberFormatter } from 'utils/string'
import styles from '../../../themes/index.less'
import { getTotal } from './utils'

const List = ({ ...tableProps }) => {
  const columns = [
    {
      title: 'Code',
      dataIndex: 'transNo',
      key: 'transNo',
      width: '140px',
      render (text, record) {
        if (!record.active) {
          return <div style={{ color: 'red' }}>{text}</div>
        }
        return text
      }
    },
    {
      title: 'Date',
      dataIndex: 'transDate',
      key: 'transDate',
      width: '100px',
      render (text, record) {
        if (!record.active) {
          return <div style={{ color: 'red' }}>{text}</div>
        }
        return text
      }
    },
    {
      title: 'In',
      dataIndex: 'depositTotal',
      key: 'depositTotal',
      width: '100px',
      className: styles.alignRight,
      render (text, record) {
        if (!record.active) {
          return <div style={{ color: 'red' }}>{(text || '-').toLocaleString()}</div>
        }
        return {
          props: {
            style: { background: record.color }
          },
          children: <div>{(text || '-').toLocaleString()}</div>
        }
      }
    },
    {
      title: 'Out',
      dataIndex: 'expenseTotal',
      key: 'expenseTotal',
      width: '100px',
      className: styles.alignRight,
      render (text, record) {
        if (!record.active) {
          return <div style={{ color: 'red' }}>{(text || '-').toLocaleString()}</div>
        }
        return {
          props: {
            style: { background: record.color }
          },
          children: <div>{(text || '-').toLocaleString()}</div>
        }
      }
    },
    {
      title: 'Discount',
      dataIndex: 'discount',
      key: 'discount',
      width: '100px',
      className: styles.alignRight,
      render (text, record) {
        if (!record.active) {
          return <div style={{ color: 'red' }}>{(text || '-').toLocaleString()}</div>
        }
        return {
          props: {
            style: { background: record.color }
          },
          children: <div>{(text || '-').toLocaleString()}</div>
        }
      }
    },
    {
      title: 'Approval',
      dataIndex: 'cashEntryId',
      key: 'cashEntryId',
      width: '100px',
      render (text, record) {
        if (record.cashEntryId > 0) {
          return <Tag color="green">Approved</Tag>
        }
        if (record.journalEntryId > 0) {
          return <Tag color="green">Approved</Tag>
        }
        if (record.purchaseId > 0) {
          return <Tag color="green">Approved</Tag>
        }
        if (record.entryType === 'D' && record.cashEntryId === null) {
          return <Tag color="green">Approved</Tag>
        }
      }
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      width: '360px',
      render (text, record) {
        if (!record.active) {
          return (
            <div style={{ color: 'red' }}>
              <div>Description: {text}</div>
              <div>Memo: {record.memo}</div>
            </div>
          )
        }
        return (
          <div>
            <div>Reference: {record.reference}</div>
            <div>Description: {text}</div>
          </div>
        )
      }
    },
    {
      title: 'Status',
      dataIndex: 'active',
      key: 'active',
      width: '100px',
      render (text, record) {
        if (text) {
          return <Tag color="green">Active</Tag>
        }
        return <Tag color="red" title={record.memo}>Cancelled</Tag>
      }
    }
  ]

  return (
    <div>
      <Table {...tableProps}
        bordered
        columns={columns}
        pagination={false}
        simple
        scroll={{ x: 1000 }}
        rowKey={record => record.id}
        footer={() => (
          <div>
            {`Remain: ${tableProps.dataSource ? numberFormatter(getTotal(tableProps.dataSource)) : 0}`}
          </div>
        )}
      />
    </div>
  )
}

List.propTypes = {
  editItem: PropTypes.func,
  deleteItem: PropTypes.func
}

export default List
