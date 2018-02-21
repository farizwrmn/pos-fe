import React from 'react'
import { Table } from 'antd'

// const gridStyle = {
//   width: '60%',
//   textAlign: 'center'
// }
const Browse = ({
  modalShow, dataBrowse }) => {
  const columns = [
    {
      title: 'No',
      dataIndex: 'no',
      key: 'no'
    },
    {
      title: 'Product Code',
      dataIndex: 'code',
      key: 'code'
    },
    {
      title: 'Product Name',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Cost',
      dataIndex: 'price',
      key: 'price'
    },
    {
      title: 'In',
      dataIndex: 'In',
      key: 'In'
    },
    {
      title: 'Out',
      dataIndex: 'Out',
      key: 'Out'
    }
  ]

  const hdlModalShow = (record) => {
    modalShow(record)
  }

  return (
    <Table
      scroll={{ x: 800 }}
      columns={columns}
      simple
      bordered
      pagination={{ pageSize: 5 }}
      size="small"
      dataSource={dataBrowse}
      onRowClick={record => hdlModalShow(record)}
    />
  )
}

Browse.propTyps = {
}

export default Browse
