import React from 'react'
import { Table } from 'antd'
import moment from 'moment'
import styles from '../../../themes/index.less'

const ListAccumulatedAmount = ({ openModalInputMdrAmount, ...tableProps }) => {
  const columns = [
    {
      title: 'Date',
      dataIndex: 'merchantPaymentDate',
      key: 'merchantPaymentDate',
      width: 120,
      className: styles.alignRight,
      render: text => moment(text).format('YYYY-MM-DD')
    },
    {
      title: 'Source',
      dataIndex: 'recordSource',
      key: 'recordSource',
      width: 120,
      render: (text) => {
        if (text === 'AC') {
          return 'Kredit'
        }
        if (text === 'AD') {
          return 'Debit'
        }
        if (text === 'AS') {
          return 'QRIS'
        }
        return ''
      }
    },
    {
      title: 'Gross',
      dataIndex: 'grossAmount',
      key: 'grossAmount',
      width: 120,
      className: styles.alignRight,
      render: (text) => {
        return text ? text.toLocaleString() : ''
      }
    },
    {
      title: 'Biaya',
      dataIndex: 'mdrAmount',
      key: 'mdrAmount',
      width: 120,
      className: styles.alignRight,
      render: (text, record) => {
        return text ? `${text.toLocaleString()}  (${parseFloat(((record.grossAmount - record.nettAmount) / record.grossAmount) * 100).toFixed(2)} %)` : ''
      }
    },
    {
      title: 'Amount',
      dataIndex: 'nettAmount',
      key: 'nettAmount',
      width: 120,
      className: styles.alignRight,
      render: (text) => {
        return text ? text.toLocaleString() : ''
      }
    },
    {
      title: 'Account Unreal',
      dataIndex: 'accountUnreal',
      key: 'accountUnreal',
      width: 200,
      className: styles.alignRight
    },
    {
      title: 'Account Real',
      dataIndex: 'accountReal',
      key: 'accountReal',
      width: 200,
      className: styles.alignRight
    }
  ]

  return (
    <div>
      <Table {...tableProps}
        scroll={{ x: 1000 }}
        bordered
        columns={columns}
        simple
        pagination={false}
      />
    </div>
  )
}

export default ListAccumulatedAmount
