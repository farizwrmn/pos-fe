import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'
import styles from '../../../themes/index.less'

const ListProduct = ({ ...tableProps }) => {
  const columns = [
    {
      title: 'ID',
      dataIndex: 'productId',
      key: 'productId'
    },
    {
      title: 'Product',
      dataIndex: 'productCode',
      key: 'productCode',
      render (text, record) {
        return (
          <div>
            <div>{record.productCode} - {record.productName}</div>
          </div>
        )
      }
    },
    {
      title: (<strong>Qty</strong>),
      dataIndex: 'qty',
      key: 'qty',
      className: styles.alignRight
    }
  ]

  return (
    <div>
      <Table {...tableProps}
        pagination={false}
        bordered
        columns={columns}
        simple
        size="small"
        scroll={{ x: 600 }}
        rowKey={record => record.no}
      />
    </div>
  )
}

ListProduct.propTypes = {
  editItem: PropTypes.func,
  deleteItem: PropTypes.func
}

export default ListProduct
