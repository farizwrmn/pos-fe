import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'
import styles from '../../../themes/index.less'

const Browse = ({
  handleModalShowList, ...purchaseProps }) => {
  const columns = [
    {
      title: 'No',
      dataIndex: 'no',
      key: 'no'
    },
    {
      title: 'Type',
      dataIndex: 'accountName',
      key: 'accountName'
    },
    {
      title: 'Debit',
      dataIndex: 'amountIn',
      key: 'amountIn',
      className: styles.alignRight,
      render: text => (text || 0).toLocaleString()
    },
    {
      title: 'Credit',
      dataIndex: 'amountOut',
      key: 'amountOut',
      className: styles.alignRight,
      render: text => (text || 0).toLocaleString()
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description'
    }
  ]

  const hdlModalShow = (record) => {
    handleModalShowList(record)
  }

  return (
    <Table
      {...purchaseProps}
      bordered={false}
      scroll={{ x: 1000 }}
      columns={columns}
      simple
      size="small"
      pagination={{ pageSize: 5 }}
      onRowClick={_record => hdlModalShow(_record)}
    />
  )
}

Browse.propTypes = {
  modalShow: PropTypes.func
}

export default Browse
