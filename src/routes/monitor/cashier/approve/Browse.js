import React from 'react'
import { Table, Checkbox } from 'antd'
import moment from 'moment'
import { numberFormat } from 'utils'
import styles from '../../../../themes/index.less'

const { formatNumberIndonesia } = numberFormat
const Browse = ({ ...tableProps, checkRequestedCashRegister, currentItem }) => {
  const columns = [
    {
      title: 'App',
      render: (text, record) => {
        return (<Checkbox onChange={e => checkRequestedCashRegister(e.target.checked, record)} checked={currentItem.id === record.id} />)
      }
    },
    {
      title: 'Store',
      dataIndex: 'storeName',
      key: 'storeName'
    },
    {
      title: 'Cashier',
      dataIndex: 'cashierId',
      key: 'cashierId'
    },
    {
      title: 'Trans Date',
      dataIndex: 'period',
      key: 'period',
      render: _text => moment(_text).format('LL')
    },
    {
      title: 'Shift',
      dataIndex: 'shiftName',
      key: 'shiftName'
    },
    {
      title: 'Kassa',
      dataIndex: 'counterName',
      key: 'counterName'
    },
    {
      title: 'Opening',
      dataIndex: 'openingBalance',
      key: 'openingBalance',
      className: styles.alignRight,
      render: text => formatNumberIndonesia(text)
    },
    {
      title: 'Debit',
      dataIndex: 'cashIn',
      key: 'cashIn',
      className: styles.alignRight,
      render: text => formatNumberIndonesia(text)
    },
    {
      title: 'Credit',
      dataIndex: 'cashOut',
      key: 'cashOut',
      className: styles.alignRight,
      render: text => formatNumberIndonesia(text)
    },
    {
      title: 'Closing',
      dataIndex: 'closingBalance',
      key: 'closingBalance',
      className: styles.alignRight,
      render: text => formatNumberIndonesia(text)
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: () => 'Request'
    }
  ]
  return (
    <Table {...tableProps}
      bordered
      columns={columns}
      simple
      scroll={{ x: 1000 }}
      rowKey={record => record.id}
    />
  )
}

export default Browse
