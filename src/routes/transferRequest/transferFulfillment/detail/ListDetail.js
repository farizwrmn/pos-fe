import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'
import { numberFormat } from 'utils'
import styles from '../../../../themes/index.less'

const formatNumberIndonesia = numberFormat.formatNumberIndonesia

const ListDetail = ({ ...tableProps, editList }) => {
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
      dataIndex: 'accountCode',
      key: 'accountCode',
      width: 100
    },
    {
      title: 'Account Name',
      dataIndex: 'accountCode',
      key: 'accountCode',
      width: 200
    },
    {
      title: 'Total',
      dataIndex: 'amountIn',
      key: 'amountIn',
      width: 120,
      className: styles.alignRight,
      render: text => formatNumberIndonesia(text || 0)
    }
  ]

  return (
    <div>
      <Table {...tableProps}
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

ListDetail.propTypes = {
  editList: PropTypes.func
}

export default ListDetail
