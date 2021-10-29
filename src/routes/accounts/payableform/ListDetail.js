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
      render: (text) => {
        let totalDiscount = 0
        if (text && text.length > 0) {
          totalDiscount = text.reduce((prev, next) => prev + next, 0)
        }
        return (totalDiscount || '-').toLocaleString()
      }
    },
    {
      title: 'Discount Account',
      dataIndex: 'discountAccount',
      key: 'discountAccount',
      className: styles.alignRight,
      render: (text) => {
        let discount = ''
        if (text && text.length > 0) {
          for (let key in text) {
            let item = text[key]
            if (item && item.label) {
              discount += `${item.label}, `
            }
          }
        }
        return (discount || '-').toLocaleString()
      }
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
      footer={() => {
        const discount = listItem.reduce((cnt, o) => cnt + (o.discount && o.discount.length > 0 ? o.discount.reduce((prev, next) => prev + next, 0) : 0), 0) || 0
        const subtotal = listItem.reduce((cnt, o) => cnt + (o.amount > 0 ? o.amount : 0), 0)
        const returnTotal = listItem.reduce((cnt, o) => cnt + (o.amount < 0 ? o.amount : 0), 0)
        const total = listItem.reduce((cnt, o) => cnt + parseFloat(o.amount || 0), 0) - discount
        return (
          <div>
            <div>Subtotal : {subtotal.toLocaleString()}</div>
            <div>P.Return : {returnTotal.toLocaleString()}</div>
            <div>Discount : {discount.toLocaleString()}</div>
            <div>Total : {total.toLocaleString()}</div>
          </div>)
      }
      }
    />
  )
}

Browse.propTypes = {
  modalShow: PropTypes.func
}

export default Browse
