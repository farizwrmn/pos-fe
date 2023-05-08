import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'
import styles from '../../../../themes/index.less'

const List = (tableProps) => {
  const columns = [
    {
      title: 'Product',
      dataIndex: 'product',
      key: 'product',
      width: '350px',
      render (text, record) {
        return (
          <div>
            <div><b>{record.productCode}</b></div>
            <div>{record.productName}</div>
            <div>D: {record.dimension} P: {record.dimensionPack} B: {record.dimensionBox}</div>
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
        scroll={{ x: 500, y: 270 }}
        columns={columns}
        simple
        rowKey={record => record.id}
      />
    </div>
  )
}

List.propTypes = {
  editList: PropTypes.func
}

export default List
