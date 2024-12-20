import React from 'react'
import { Table } from 'antd'
import styles from '../../../../themes/index.less'
import Filter from './Filter'


const List = ({ onRowClick, ...listProps }) => {
  const handleMenuClick = (record) => {
    onRowClick(record)
  }


  const columns = [
    {
      title: 'Product Code',
      dataIndex: 'productCode',
      key: 'productCode',
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
      title: 'Quantity',
      dataIndex: 'qty',
      key: 'qty',
      className: styles.alignCenter,
      width: '100px'
    }
  ]

  // const formattedData = columns.map((item, index) => ({
  //   key: index,
  //   locationName: item.locationName
  // }))

  return (
    <div>
      <Filter {...listProps} />
      <Table {...listProps}
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

export default List
