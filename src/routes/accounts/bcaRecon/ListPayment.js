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
          return text
        }
        return (
          <div style={{ color: '#55a756' }} onClick={() => openModalInputMdrAmount(record)}>{text}</div>
        )
      }
    },
    {
      title: 'Date',
      dataIndex: 'transDate',
      key: 'transDate',
      className: styles.alignRight,
      render: text => moment(text).format('YYYY-MM-DD HH:mm:ss')
    },
    {
      title: 'Batch Number',
      dataIndex: 'batchNumber',
      key: 'batchNumber',
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
        rowKey={record => record.id}
        pagination={false}
      />
    </div>
  )
}

// ListPayment.propTypes = {
//   editItem: PropTypes.func,
//   deleteItem: PropTypes.func
// }

export default ListPayment
