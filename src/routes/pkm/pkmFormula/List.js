import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'

const List = (tableProps) => {
  const columns = [
    {
      title: 'ID',
      dataIndex: 'productId',
      key: 'productId'
    },
    {
      title: 'CODE',
      dataIndex: 'productCode',
      key: 'productCode'
    },
    {
      title: 'NAME',
      dataIndex: 'productName',
      key: 'productName'
    },
    {
      title: 'TAG',
      dataIndex: 'productTag',
      key: 'productTag'
    },
    {
      title: 'Min Dis',
      dataIndex: 'minDisp',
      key: 'minDisp'
    },
    {
      title: 'Minor',
      dataIndex: 'minor',
      key: 'minor'
    },
    {
      title: 'Sales',
      children: [
        {
          title: 'ini',
          dataIndex: 'salesCurrentMonth',
          key: 'salesCurrentMonth'
        },
        {
          title: '-1',
          dataIndex: 'salesTwoMonth',
          key: 'salesTwoMonth'
        },
        {
          title: '-2',
          dataIndex: 'salesThreeMonth',
          key: 'salesThreeMonth'
        }
      ]
    }
  ]

  return (
    <div>
      <Table {...tableProps}
        bordered
        columns={columns}
        simple
        scroll={{ x: 1000 }}
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
