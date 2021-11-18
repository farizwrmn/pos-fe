import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'
import { DropOption } from 'components'

const List = ({ ...tableProps, editList }) => {
  const handleMenuClick = (record) => {
    editList(record)
  }

  const columns = [
    {
      title: 'NO',
      dataIndex: 'no',
      key: 'no',
      width: 70
    },
    {
      title: 'Voucher Code',
      dataIndex: 'generatedCode',
      key: 'generatedCode',
      width: 200
    },
    {
      title: 'Payment Date',
      dataIndex: 'paymentDate',
      key: 'paymentDate',
      width: 150
    },
    {
      title: 'Payment Description',
      dataIndex: 'paymentDescription',
      key: 'paymentDescription',
      width: 300
    },
    {
      title: 'Usage Date',
      dataIndex: 'usageDate',
      key: 'usageDate',
      width: 150
    },
    {
      title: 'Usage Description',
      dataIndex: 'usageDescription',
      key: 'usageDescription',
      width: 300
    },
    {
      title: 'Operation',
      key: 'operation',
      width: 100,
      fixed: 'right',
      render: (text, record) => {
        return <DropOption onMenuClick={e => handleMenuClick(record, e)} menuOptions={[{ key: '1', name: 'Payment' }]} />
      }
    }
  ]

  return (
    <div>
      <Table {...tableProps}
        bordered
        scroll={{ x: 500, y: 270 }}
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
