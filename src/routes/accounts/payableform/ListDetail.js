import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'
import styles from '../../../themes/index.less'

const Browse = ({
  handleModalShowList,
  listItem,
  ...purchaseProps
}) => {
  const columns = [
    {
      title: 'No',
      dataIndex: 'no',
      key: 'no'
    },
    {
      title: 'Trans No',
      dataIndex: 'transNo',
      key: 'transNo'
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      className: styles.alignRight,
      render: text => (text || '-').toLocaleString()
    },
    {
      title: 'Discount',
      dataIndex: 'discount',
      key: 'discount',
      className: styles.alignRight,
      render: text => (text || '-').toLocaleString()
    },
    {
      title: 'Discount',
      dataIndex: 'discountAccount.label',
      key: 'discountAccount.label',
      className: styles.alignRight,
      render: text => (text || '-').toLocaleString()
    },
    {
      title: 'Must Paid',
      dataIndex: 'paymentTotal',
      key: 'paymentTotal',
      className: styles.alignRight,
      render: text => (text || '-').toLocaleString()
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
      footer={() => (
        <div>
          <div>Subtotal : {listItem.reduce((cnt, o) => cnt + (o.amount > 0 ? o.amount : 0), 0).toLocaleString()}</div>
          <div>P.Return : {listItem.reduce((cnt, o) => cnt + (o.amount < 0 ? o.amount : 0), 0).toLocaleString()}</div>
          <div>Total : {listItem.reduce((cnt, o) => cnt + parseFloat(o.amount || 0), 0).toLocaleString()}</div>
        </div>)
      }
    />
  )
}

Browse.propTypes = {
  modalShow: PropTypes.func
}

export default Browse
