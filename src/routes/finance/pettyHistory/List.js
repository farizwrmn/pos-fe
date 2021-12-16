import React from 'react'
import PropTypes from 'prop-types'
import { Tag, Table } from 'antd'
import { numberFormatter } from 'utils/string'

const List = ({ ...tableProps }) => {
  const columns = [
    {
      title: 'Code',
      dataIndex: 'transNo',
      key: 'transNo',
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
      render (text, record) {
        if (record.cashEntryId > 0) {
          return <Tag color="green">Approved</Tag>
        }
        if (record.journalEntryId > 0) {
          return <Tag color="green">Approved</Tag>
        }
        if (record.entryType === 'D' && record.cashEntryId === null && record.journalEntryId === null) {
          return <Tag color="green">Approved</Tag>
        }
      }
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render (text, record) {
        if (!record.active) {
          return <div style={{ color: 'red' }}>{text}</div>
        }
        return text
      }
    },
    {
      title: 'Status',
      dataIndex: 'active',
      key: 'active',
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
        simple
        scroll={{ x: 1000 }}
        rowKey={record => record.id}
        footer={() => (
          <div>
            {`Remain: ${tableProps.dataSource ? numberFormatter(tableProps.dataSource
              .filter(filtered => filtered.active)
              .reduce((prev, next) => (prev + (next.depositTotal || 0)) - (next.expenseTotal || 0), 0)) : 0}`}
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
