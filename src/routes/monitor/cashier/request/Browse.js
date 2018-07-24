import React from 'react'
import { Table, Icon } from 'antd'
import moment from 'moment'
import { numberFormat } from 'utils'
import styles from '../../../../themes/index.less'

const { formatNumberIndonesia } = numberFormat
const Browse = ({ ...tableProps, requestToOpenCashRegister }) => {
  const columns = [
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
      render: () => 'Closed'
    },
    {
      title: <Icon type="setting" />,
      key: 'operation',
      width: 70,
      fixed: 'right',
      render: (record) => {
        return <a onClick={() => requestToOpenCashRegister(record)}>Request</a>
      }
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
