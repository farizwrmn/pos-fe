import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'
import styles from '../../../../themes/index.less'

const List = ({ editList, ...tableProps }) => {
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
      title: 'Product',
      dataIndex: 'accountCode.accountCode',
      key: 'accountCode.accountCode',
      width: '350px',
      render (text, record) {
        return (
          <div>
            <div><b>{record.product.productCode}</b></div>
            <div>{record.product.productName}</div>
            <div>D: {record.product.dimension} P: {record.product.dimensionPack} B: {record.product.dimensionBox}</div>
          </div>
        )
      }
    },
    {
      title: 'Qty',
      dataIndex: 'qty',
      key: 'qty',
      width: '70px',
      className: styles.alignRight,
      // render: text => (text || '-').toLocaleString()
      render: text => <div>{(text || '-').toLocaleString()}</div>
    },
    {
      title: 'Price',
      dataIndex: 'purchasePrice',
      key: 'purchasePrice',
      width: '120px',
      className: styles.alignRight,
      // render: text => (text || '-').toLocaleString()
      render: text => <div>{(text || '-').toLocaleString()}</div>
    },
    {
      title: 'Discount',
      dataIndex: 'discount',
      key: 'discount',
      width: '120px',
      className: styles.alignRight,
      // render: text => (text || '-').toLocaleString()
      render: (text, data) => <div>{(((data.qty * data.purchasePrice) - (data.DPP + data.PPN)) || '-').toLocaleString()}</div>
    },
    {
      title: 'Subtotal',
      dataIndex: 'subtotal',
      key: 'subtotal',
      width: '120px',
      className: styles.alignRight,
      // render: text => (text || '-').toLocaleString()
      render: (text, data) => <div>{((data.DPP + data.PPN) || '-').toLocaleString()}</div>
    }
  ]

  return (
    <div>
      <Table {...tableProps}
        bordered={false}
        scroll={{ x: 500, y: '100%' }}
        columns={columns}
        simple
        rowKey={record => record.no}
        onRowClick={record => handleMenuClick(record)}
        footer={() => {
          return (
            <div>
              <div>Total: {(tableProps && tableProps.dataSource ? tableProps.dataSource.reduce((prev, next) => prev + next.DPP + next.PPN, 0) : 0).toLocaleString()}</div>
            </div>
          )
        }}
      />
    </div>
  )
}

List.propTypes = {
  editList: PropTypes.func
}

export default List
