import React from 'react'
import { Table } from 'antd'
import styles from '../../../themes/index.less'

const TransDetail = ({ onEditItem, ...tableProps }) => {
  const handleMenuClick = (record) => {
    onEditItem(record)
  }

  const columns = [
    {
      title: 'No',
      dataIndex: 'no',
      key: 'no',
      render (text, record) {
        return {
          props: {
            style: { background: record.color }
          },
          children: <div>{text}</div>
        }
      }
    },
    {
      title: 'Store Name',
      dataIndex: 'storeName',
      key: 'storeName',
      render (text, record) {
        return {
          props: {
            style: { background: record.color }
          },
          children: <div>{text}</div>
        }
      }
    },
    {
      title: 'Deposit Total',
      dataIndex: 'depositTotal',
      key: 'depositTotal',
      className: styles.alignRight,
      // render: text => (text || '-').toLocaleString()
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
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render (text, record) {
        return {
          props: {
            style: { background: record.color }
          },
          children: <div>{text}</div>
        }
      }
    }
  ]

  return (
    <div>
      <Table
        {...tableProps}
        pagination={false}
        bordered
        columns={columns}
        simple
        size="small"
        scroll={{ x: 1000 }}
        rowKey={record => record.no}
        onRowClick={item => handleMenuClick(item)}
      />
    </div>
  )
}

export default TransDetail
