import React from 'react'
import PropTypes from 'prop-types'
import { Table, Button, Tag } from 'antd'

const List = ({ item, onPayment, onSelectAll, ...tableProps, editList }) => {
  const handleMenuClick = (record) => {
    editList(record)
  }

  let selectedRowKeysLen = 0
  if (tableProps.rowSelection) {
    selectedRowKeysLen = tableProps.rowSelection.selectedRowKeys.length
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
      dataIndex: 'voucherPayment.paymentDate',
      key: 'voucherPayment.paymentDate',
      width: 150
    },
    {
      title: 'Payment Description',
      dataIndex: 'voucherPayment.paymentDescription',
      key: 'voucherPayment.paymentDescription',
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
    }
  ]

  return (
    <div>
      <span style={{ marginLeft: 8, marginBottom: '20px' }}>
        {selectedRowKeysLen > 0 && `${selectedRowKeysLen} items were selected`}
        {tableProps.dataSource.filter(filtered => !filtered.voucherPayment).length > 0 ? <Button style={{ float: 'right' }} type="default" onClick={() => onSelectAll()}>Select all</Button>
          : <Tag style={{ float: 'right' }} color="red">Sold Out</Tag>}
        {selectedRowKeysLen > 0 && !item.onlyMember && <Button style={{ float: 'right', marginRight: '10px' }} type="primary" onClick={() => onPayment()}>Payment</Button>}
      </span>
      <Table {...tableProps}
        bordered
        style={{ marginTop: '20px' }}
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
