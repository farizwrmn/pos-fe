import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'

const List = ({ ...tableProps }) => {
  const columns = [
    {
      title: 'Product Code',
      dataIndex: 'productCode',
      key: 'productCode',
      width: 100
    },
    {
      title: 'Product Name',
      dataIndex: 'productName',
      key: 'productName',
      width: 150
    },
    {
      title: 'Category',
      dataIndex: 'grabCategoryName',
      key: 'grabCategoryName',
      width: 100
    },
    {
      title: 'Barcode',
      dataIndex: 'barcode',
      key: 'barcode',
      width: 100
    },
    {
      title: 'Qty',
      dataIndex: 'qty',
      key: 'qty',
      width: 100
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      width: 100
    },
    {
      title: 'Commission',
      dataIndex: 'commission',
      key: 'commission',
      width: 100
    }
  ]

  return (
    <div>
      <Table {...tableProps}
        bordered
        size="small"
        columns={columns}
        simple
        scroll={{ x: 1000 }}
        pagination={false}
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
