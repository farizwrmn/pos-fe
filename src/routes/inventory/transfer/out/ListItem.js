import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'

const ListItem = ({ ...tableProps, onModalVisible }) => {
  const handleMenuClick = (record) => {
    onModalVisible(record)
  }

  const columns = [
    {
      title: 'No',
      dataIndex: 'no',
      key: 'no'
    },
    {
      title: 'Code',
      dataIndex: 'productCode',
      key: 'productCode'
    },
    {
      title: 'Name',
      dataIndex: 'productName',
      key: 'productName'
    },
    {
      title: 'Qty',
      dataIndex: 'qty',
      key: 'qty'
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description'
    }
  ]

  return (
    <div>
      <Table {...tableProps}
        bordered
        columns={columns}
        simple
        size="small"
        scroll={{ x: 1000 }}
        rowKey={record => record.no}
        onRowClick={item => handleMenuClick(item)}
      />
    </div>
  )
}

ListItem.propTypes = {
  editItem: PropTypes.func,
  deleteItem: PropTypes.func
}

export default ListItem
