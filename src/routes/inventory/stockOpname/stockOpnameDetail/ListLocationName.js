import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'
import styles from '../../../../themes/index.less'
import Filter from './Filter'


const List = ({ editList, ...tableProps }) => {
  const handleMenuClick = (record) => {
    editList(record)
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      className: styles.alignCenter,
      width: '100px'
    },
    {
      title: 'Product Name',
      dataIndex: 'productName',
      key: 'productName',
      width: '200px'
    },
    {
      title: 'Location Name',
      dataIndex: 'locationName',
      key: 'locationName',
      width: '200px'
    },
    {
      title: 'Quantity Location',
      dataIndex: 'qtyLocation',
      key: 'qtyLocation',
      width: '100px'
    },
    {
      title: 'Quantity',
      dataIndex: 'qty',
      key: 'qty',
      width: '100px'
    }
  ]

  return (
    <div>
      <Filter {...tableProps} />
      <Table {...tableProps}
        bordered={false}
        scroll={{ x: 500 }}
        columns={columns}
        simple
        rowKey={record => record.id}
        onRowClick={record => handleMenuClick(record)}
      />
    </div>
  )
}

List.propTypes = {
  editList: PropTypes.func
}

export default List
