import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'
import styles from '../../../themes/index.less'

const List = ({ ...tableProps }) => {
  const columns = [
    {
      title: 'ID',
      dataIndex: 'merchantId',
      key: 'merchantId'
    },
    {
      title: 'mdr',
      dataIndex: 'mdr',
      key: 'mdr'
    },
    {
      title: 'Edc Batch Number',
      dataIndex: 'edcBatchNumber',
      key: 'edcBatchNumber'
    },
    {
      title: 'merchantName',
      dataIndex: 'merchantName',
      key: 'merchantName'
    },
    {
      title: 'processEffectiveDate',
      dataIndex: 'processEffectiveDate',
      key: 'processEffectiveDate'
    },
    {
      title: 'merchantPaymentDate',
      dataIndex: 'merchantPaymentDate',
      key: 'merchantPaymentDate'
    },
    {
      title: 'recordSource',
      dataIndex: 'recordSource',
      key: 'recordSource'
    },
    {
      title: 'nettAmount',
      dataIndex: 'nettAmount',
      key: 'nettAmount',
      className: styles.alignRight
    },
    {
      title: 'originalAmount',
      dataIndex: 'originalAmount',
      key: 'originalAmount',
      className: styles.alignRight
    },
    {
      title: 'redeemAmount',
      dataIndex: 'redeemAmount',
      key: 'redeemAmount',
      className: styles.alignRight
    },
    {
      title: 'rewardAmount',
      dataIndex: 'rewardAmount',
      key: 'rewardAmount',
      className: styles.alignRight
    },
    {
      title: 'mdrAmount',
      dataIndex: 'mdrAmount',
      key: 'mdrAmount',
      className: styles.alignRight
    },
    {
      title: 'merchantPaymentStatus',
      dataIndex: 'merchantPaymentStatus',
      key: 'merchantPaymentStatus'
    },
    {
      title: 'transactionDate',
      dataIndex: 'transactionDate',
      key: 'transactionDate'
    },
    {
      title: 'transactionTime',
      dataIndex: 'transactionTime',
      key: 'transactionTime'
    },
    {
      title: 'Created',
      dataIndex: 'createdBy',
      key: 'createdBy'
    }
  ]

  return (
    <div>
      <Table {...tableProps}
        bordered
        columns={columns}
        simple
        scroll={{ x: 1200 }}
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
