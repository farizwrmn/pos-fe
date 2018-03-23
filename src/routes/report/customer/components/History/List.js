import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'
import moment from 'moment'
import styles from '../../../../../themes/index.less'

const List = ({ ...tableProps, dataSource }) => {
  const columns = [
    {
      title: 'Member Code',
      dataIndex: 'memberCode',
      key: 'memberCode'
    },
    {
      title: 'Member Name',
      dataIndex: 'memberName',
      key: 'memberName'
    },
    {
      title: 'Police No',
      dataIndex: 'policeNo',
      key: 'policeNo'
    },
    {
      title: 'Product Name',
      dataIndex: 'productName',
      key: 'productName'
    },
    {
      title: 'Qty',
      dataIndex: 'qty',
      key: 'qty',
      className: styles.alignRight,
      render: text => text.toLocaleString()
    },
    {
      title: 'Transaction No',
      dataIndex: 'transNo',
      key: 'transNo'
    },
    {
      title: 'Transaction Date',
      dataIndex: 'transDate',
      key: 'transDate',
      render: (text) => {
        return moment(text).format('MMMM, Do YYYY')
      }
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      className: styles.alignRight,
      render: text => text.toLocaleString()
    },
    {
      title: 'Total Discount',
      dataIndex: 'totalDiscount',
      key: 'totalDiscount',
      className: styles.alignRight,
      render: text => text.toLocaleString()
    },
    {
      title: 'Netto Total',
      dataIndex: 'nettoTotal',
      key: 'nettoTotal',
      className: styles.alignRight,
      render: text => text.toLocaleString()
    }
  ]

  const totalPrice = dataSource.reduce((cnt, o) => cnt + parseFloat(o.nettoTotal), 0)

  return (
    <div>
      <Table {...tableProps}
        bordered
        scroll={{ x: 1500 }}
        columns={columns}
        simple
        footer={() => `Total: ${totalPrice.toLocaleString(['ban', 'id'], { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`}
        rowKey={record => record.id}
      />
    </div>
  )
}

List.propTypes = {
  dataSource: PropTypes.array
}

export default List

