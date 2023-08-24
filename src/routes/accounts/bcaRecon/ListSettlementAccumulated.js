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
      className: styles.alignRight,
      render: text => moment(text).format('YYYY-MM-DD HH:mm:ss')
    },
    {
      title: 'Amount',
      dataIndex: 'grossAmount',
      key: 'grossAmount',
      className: styles.alignRight
    },
    {
      title: 'Account Unreal',
      dataIndex: 'accountUnreal',
      key: 'accountUnreal',
      className: styles.alignRight
    },
    {
      title: 'Account Real',
      dataIndex: 'accountReal',
      key: 'accountReal',
      className: styles.alignRight
    }
  ]

  return (
    <div>
      <Table {...tableProps}
        bordered
        columns={columns}
        simple
        pagination={false}
      />
    </div>
  )
}

export default ListAccumulatedAmount
