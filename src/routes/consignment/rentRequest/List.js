import React from 'react'
import { Table } from 'antd'

const List = () => {
  const columns = [
    {
      title: 'Code',
      dataIndex: 'accountCode',
      key: 'accountCode'
    },
    {
      title: 'Name',
      dataIndex: 'accountName',
      key: 'accountName'
    },
    {
      title: 'Parent',
      dataIndex: 'accountParentId',
      key: 'accountParentId'
    }
  ]

  return (
    <div>
      <Table
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
}

export default List
