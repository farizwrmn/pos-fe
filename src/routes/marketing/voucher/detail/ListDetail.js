import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'
import { numberFormat } from 'utils'
import styles from '../../../../themes/index.less'

const formatNumberIndonesia = numberFormat.formatNumberIndonesia

const List = ({ ...tableProps, editList }) => {
  const handleMenuClick = (record) => {
    editList(record)
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 40
    },
    {
      title: 'Account Code',
      dataIndex: 'accountCode.accountCode',
      key: 'accountCode.accountCode',
      width: 100
    },
    {
      title: 'Account Name',
      dataIndex: 'accountCode.accountName',
      key: 'accountCode.accountName',
      width: 200
    },
    {
      title: 'Debit',
      dataIndex: 'amountIn',
      key: 'amountIn',
      width: 120,
      className: styles.alignRight,
      render: text => formatNumberIndonesia(text || 0)
    },
    {
      title: 'Credit',
      dataIndex: 'amountOut',
      key: 'amountOut',
      width: 120,
      className: styles.alignRight,
      render: text => formatNumberIndonesia(text || 0)
    }
  ]

  return (
    <div>
      <Table {...tableProps}
        pagination={false}
        bordered={false}
        scroll={{ x: 500, y: 270 }}
        columns={columns}
        simple
        rowKey={record => record.no}
        onRowClick={record => handleMenuClick(record)}
      />
    </div>
  )
}

List.propTypes = {
  editList: PropTypes.func
}

export default List
