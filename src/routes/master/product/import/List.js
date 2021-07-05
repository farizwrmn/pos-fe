import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'
import { getDistPriceName } from 'utils/string'
import styles from '../../../../themes/index.less'

const List = ({ ...tableProps }) => {
  const columns = [
    {
      title: 'ID',
      dataIndex: 'productId',
      key: 'productId'
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
      title: 'Qty',
      dataIndex: 'qty',
      key: 'qty',
      className: styles.alignRight
    },
    {
      title: 'Cost',
      dataIndex: 'price',
      key: 'price',
      className: styles.alignRight
    },
    {
      title: getDistPriceName('sellPrice'),
      dataIndex: 'product.sellPrice',
      key: 'product.sellPrice',
      className: styles.alignRight,
      render: text => (text || '-').toLocaleString()
    },
    {
      title: getDistPriceName('distPrice01'),
      dataIndex: 'product.distPrice01',
      key: 'product.distPrice01',
      className: styles.alignRight,
      render: text => (text || '-').toLocaleString()
    },
    {
      title: getDistPriceName('distPrice02'),
      dataIndex: 'product.distPrice02',
      key: 'product.distPrice02',
      className: styles.alignRight,
      render: text => (text || '-').toLocaleString()
    },
    {
      title: getDistPriceName('distPrice03'),
      dataIndex: 'product.distPrice03',
      key: 'product.distPrice03',
      className: styles.alignRight,
      render: text => (text || '-').toLocaleString()
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
        scroll={{ x: 1200 }}
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
