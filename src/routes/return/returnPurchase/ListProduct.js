import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'
import styles from 'themes/index.less'

const ListProduct = ({ onChooseItem, loadingProduct, ...tableProps }) => {
  const handleMenuClick = (record) => {
    onChooseItem(record)
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      render: text => (text || '-').toLocaleString()
    },
    {
      title: 'Product Code',
      dataIndex: 'productCode',
      key: 'productCode'
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
      className: styles.alignRight
    },
    {
      title: 'Price',
      dataIndex: 'dpp',
      key: 'dpp',
      className: styles.alignRight,
      render: (text, record) => (parseFloat(text) / (parseFloat(record.qty)) || '-').toLocaleString()
    }
  ]

  return (
    <Table
      {...tableProps}
      bordered
      loading={loadingProduct.effects['pos/getProducts'] || loadingProduct.effects['pos/checkQuantityNewProduct'] || loadingProduct.effects['pos/checkQuantityEditProduct']}
      columns={columns}
      simple
      size="small"
      rowKey={record => record.productCode}
      onRowClick={record => handleMenuClick(record)}
    />
  )
}

ListProduct.propTypes = {
  onChooseItem: PropTypes.func,
  location: PropTypes.object,
  pos: PropTypes.object,
  dispatch: PropTypes.func
}

export default ListProduct
