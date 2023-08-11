import React from 'react'
import { Table } from 'antd'
import moment from 'moment'
import styles from '../../../themes/index.less'

const ListAccumulatedAmount = ({ openModalInputMdrAmount, ...tableProps }) => {
  const columns = [
    {
      title: 'Date',
      dataIndex: 'queryDate',
      key: 'queryDate',
      className: styles.alignRight,
      render: text => moment(text).format('YYYY-MM-DD HH:mm:ss')
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      className: styles.alignRight
    },
    {
      title: 'Account Unreal',
      dataIndex: 'accountIdReal',
      key: 'accountIdReal',
      className: styles.alignRight
    },
    {
      title: 'Account Real',
      dataIndex: 'accountIdUnreal',
      key: 'accountIdUnreal',
      className: styles.alignRight
    }
  ]

  return (
    <div>
      <Table {...tableProps}
        bordered
        columns={columns}
        simple
        rowKey={record => record.id}
        pagination={false}
      />
    </div>
  )
}

export default ListAccumulatedAmount
