import React from 'react'
import { Table } from 'antd'

const ListItem = ({
  listItem,
  loading,
  item,
  onModalVisible,
  ...otherProps
}) => {
  const columns = [
    {
      title: 'No',
      dataIndex: 'no',
      key: 'no',
      width: '50px',
      render: (text, record) => <div style={{ color: record.qty !== record.receivedQty ? 'red' : 'initial' }}>{(text || '').toLocaleString()}</div>
    },
    {
      title: 'Product',
      dataIndex: 'productName',
      key: 'productName',
      width: '300px',
      render: (text, record) => {
        return (
          <div style={{ color: record.qty !== record.receivedQty ? 'red' : 'initial' }}>
            <div><b>{record.product.productCode}</b>{` ${record.product.productName}`}</div>
            <div>D: {record.product.dimension} P: {record.product.dimensionPack} B: {record.product.dimensionBox}</div>
          </div>
        )
      }
    },
    {
      title: 'Qty',
      dataIndex: 'qty',
      key: 'qty',
      width: '100px',
      render: (text, record) => <div style={{ color: record.qty !== record.receivedQty ? 'red' : 'initial' }}>{(text || '').toLocaleString()}</div>
    },
    {
      title: 'Received',
      dataIndex: 'receivedQty',
      key: 'receivedQty',
      width: '100px',
      render: (text, record) => <div style={{ color: record.qty !== record.receivedQty ? 'red' : 'initial' }}>{(text || '').toLocaleString()}</div>
    }
  ]

  return (
    <div>
      <div><h1>Items</h1></div>
      <div>
        <Table
          {...otherProps}
          loading={loading}
          bordered
          columns={columns}
          scroll={{ x: 1000 }}
          simple
          onRowClick={record => onModalVisible(record)}
          rowKey={record => record.id}
          footer={() => (
            <div style={{ textAlign: 'right' }}>
              <div>Qty: {listItem.reduce((prev, next) => {
                return prev + next.qty
              }, 0).toLocaleString()}</div>
              <div>Total: Rp {listItem.reduce((prev, next) => {
                return prev + next.total
              }, 0).toLocaleString()}</div>
              <div>Delivery Fee: Rp {(item.deliveryFee || 0).toLocaleString()}</div>
              <div>Total: Rp {(listItem.reduce((prev, next) => {
                return prev + next.total
              }, 0) + item.deliveryFee).toLocaleString()}</div>
            </div>)
          }
        />
      </div>
    </div>
  )
}

export default ListItem
