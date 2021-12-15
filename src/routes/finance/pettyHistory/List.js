import React from 'react'
import PropTypes from 'prop-types'
import { Tag, Table } from 'antd'

const List = ({ ...tableProps }) => {
  const columns = [
    {
      title: 'Code',
      dataIndex: 'transNo',
      key: 'transNo'
    },
    {
      title: 'Date',
      dataIndex: 'transDate',
      key: 'transDate'
    },
    {
      title: 'In',
      dataIndex: 'depositTotal',
      key: 'depositTotal',
      render (text, record) {
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
        return {
          props: {
            style: { background: record.color }
          },
          children: <div>{(text || '-').toLocaleString()}</div>
        }
      }
    },
    {
      title: 'PIC',
      dataIndex: 'cashEntryId',
      key: 'cashEntryId',
      render (text) {
        if (text) {
          return <Tag color="green">Finance</Tag>
        }
        return <Tag color="yellow">Cashier</Tag>
      }
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description'
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
      />
    </div>
  )
}

List.propTypes = {
  editItem: PropTypes.func,
  deleteItem: PropTypes.func
}

export default List
