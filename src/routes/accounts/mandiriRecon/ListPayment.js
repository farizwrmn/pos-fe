import React from 'react'
import { Table } from 'antd'
import moment from 'moment'
import styles from '../../../themes/index.less'

const ListPayment = ({ openModalInputMdrAmount, ...tableProps }) => {
  const columns = [
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      className: styles.alignRight,
      render: (text, record) => {
        if (record.match && !!record.editState) {
          return text ? text.toLocaleString() : ''
        }
        return (
          <div style={{ color: '#55a756' }} onClick={() => openModalInputMdrAmount(record)}>{text ? text.toLocaleString() : ''}</div>
        )
      }
    },
    {
      title: 'User',
      dataIndex: 'userName',
      key: 'userName',
      width: '90px'
    },
    {
      title: 'Date',
      dataIndex: 'transDate',
      key: 'transDate',
      render: (text, record) => moment(record.transDate).format('YYYY-MM-DD')
    },
    {
      title: 'Time',
      dataIndex: 'transTime',
      key: 'transTime',
      className: styles.alignRight,
      render: (text, record) => moment(record.transDate).format('HH:mm')
    },
    {
      title: 'Approval Code',
      dataIndex: 'batchNumber',
      key: 'batchNumber',
      className: styles.alignRight
    },
    {
      title: 'Type Code',
      dataIndex: 'typeCode',
      key: 'typeCode',
      className: styles.alignRight
    },
    {
      title: 'Trans No',
      dataIndex: 'transNo',
      key: 'transNo',
      className: styles.alignRight
    },
    {
      title: 'MDR',
      dataIndex: 'matchMdr',
      key: 'matchMdr',
      className: styles.alignRight
    },
    {
      title: 'match',
      dataIndex: 'match',
      key: 'match',
      className: styles.alignLeft,
      render: (text, record) => {
        if (!record.match) {
          return ''
        }
        return (
          <div>match</div>
        )
      }
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

export default ListPayment
