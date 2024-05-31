import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'
import moment from 'moment'
import styles from '../../../../themes/index.less'

const List = ({ ...tableProps }) => {
  const columns = [
    {
      title: 'Updated At',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: text => moment(text).format('lll')
    },
    {
      title: 'ID',
      dataIndex: 'productId',
      key: 'productId'
    },
    {
      title: 'Store',
      dataIndex: 'store.storeName',
      key: 'store.storeName'
    },
    {
      title: 'Code',
      dataIndex: 'product.productCode',
      key: 'product.productCode'
    },
    {
      title: 'Name',
      dataIndex: 'product.productName',
      key: 'product.productName'
    },
    {
      title: 'Brand',
      dataIndex: 'product.brandName',
      key: 'product.brandName'
    },
    {
      title: 'Category',
      dataIndex: 'product.categoryName',
      key: 'product.categoryName'
    },
    {
      title: 'Mul Order',
      dataIndex: 'dimensionBox',
      key: 'dimensionBox',
      className: styles.alignRight
    },
    {
      title: 'Buffer (Day)',
      dataIndex: 'bufferQty',
      key: 'bufferQty',
      className: styles.alignRight
    },
    {
      title: 'Min Display',
      dataIndex: 'minDisplay',
      key: 'minDisplay',
      className: styles.alignRight
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
        scroll={{ x: 1500 }}
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
