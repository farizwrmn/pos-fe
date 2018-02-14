import React from 'react'
import PropTypes from 'prop-types'
import { Table, Tag } from 'antd'

const List = ({ ...tableProps, editList }) => {
  const handleMenuClick = (record) => {
    editList(record)
  }

  const columns = [
    {
      title: 'No',
      dataIndex: 'no',
      key: 'no'
    },
    {
      title: 'Type',
      dataIndex: 'typeCode',
      key: 'typeCode',
      render: text =>
        (<span>
          <Tag color={text === 'P' ? 'blue' : 'green'}>
            {text === 'P' ? 'Product' : 'Service'}
          </Tag>
        </span>)
    },
    {
      title: 'Product Code',
      dataIndex: 'productCode',
      key: 'productCode',
      render: (text, record) => (record.productCode || record.serviceCode)
    },
    {
      title: 'Product Name',
      dataIndex: 'productName',
      key: 'productName',
      render: (text, record) => (record.productName || record.serviceName)
    },
    {
      title: 'Total Price',
      dataIndex: 'price',
      key: 'price',
      render: (text, record) => (<p style={{ textAlign: 'right' }}>{record.qty * record.sellingPrice}</p>)
    },
    {
      title: 'Total Disc',
      dataIndex: 'discount',
      key: 'discount',
      render: (text, record) => (<p style={{ textAlign: 'right' }}>{(record.qty * record.sellingPrice) - (((record.qty * record.sellingPrice) * (1 - (record.disc1 / 100)) * (1 - (record.disc2 / 100)) * (1 - (record.disc3 / 100))) - record.discount)}</p>)
    },
    {
      title: 'Netto',
      dataIndex: 'transNo',
      key: 'transNo',
      render: (text, record) => (<p style={{ textAlign: 'right' }}>{((record.qty * record.sellingPrice) * (1 - (record.disc1 / 100)) * (1 - (record.disc2 / 100)) * (1 - (record.disc3 / 100))) - record.discount}</p>)
    }

  ]

  return (
    <div>
      <Table {...tableProps}
        bordered={false}
        scroll={{ x: 500, y: 700 }}
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
