import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'
import styles from '../../../../themes/index.less'

const List = ({ materialRequest, editList, ...tableProps }) => {
  const handleMenuClick = (record) => {
    editList(record)
  }

  const columns = [
    {
      title: 'No',
      dataIndex: 'no',
      key: 'no',
      width: 40
    },
    {
      title: 'Product',
      dataIndex: 'productName',
      key: 'productName',
      width: 100
    },
    {
      title: 'Qty',
      dataIndex: 'qty',
      key: 'qty',
      width: 120,
      className: styles.alignRight
    }
  ]

  return (
    <div>
      <Table {...tableProps}
        scroll={{ x: 500, y: 270 }}
        pagination={false}
        columns={columns}
        simple
        rowKey={record => record.no}
        onRowClick={record => handleMenuClick(record)}
      />
    </div>
  )
}

List.propTypes = {
  editList: PropTypes.func
}

export default List
