import React from 'react'
import moment from 'moment'
import { Table, Button } from 'antd'
import styles from '../../../themes/index.less'

const List = ({ ...tableProps, printInvoice }) => {
  const printPurchaseHistory = (record) => {
    printInvoice(record.transNo)
  }
  const columns = [
    {
      title: 'Date',
      dataIndex: 'transDate',
      key: 'transDate',
      render: (text) => {
        return moment(text).format('DD MMMM YYYY')
      }
    },
    {
      title: 'No',
      dataIndex: 'transNo',
      key: 'transNo'
    },
    {
      title: 'Supplier',
      dataIndex: 'supplierName',
      key: 'supplierName'
    },
    {
      title: 'Disc(%)',
      dataIndex: 'discInvoicePercent',
      key: 'discInvoicePercent',
      className: styles.alignRight,
      render: text => text.toLocaleString()
    },
    {
      title: 'Disc(N)',
      dataIndex: 'discInvoiceNominal',
      key: 'discInvoiceNominal',
      className: styles.alignRight,
      render: text => text.toLocaleString()
    },
    {
      title: 'Term',
      dataIndex: 'tempo',
      key: 'tempo',
      render: text => `${text} day(s)`
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      key: 'dueDate',
      render: (text) => {
        return moment(text).format('DD MMMM YYYY')
      }
    },
    {
      title: 'Operation',
      key: 'operation',
      width: 70,
      fixed: 'right',
      render: (record) => {
        return <Button type="primary" onClick={() => printPurchaseHistory(record)}>Print</Button>
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

export default List
