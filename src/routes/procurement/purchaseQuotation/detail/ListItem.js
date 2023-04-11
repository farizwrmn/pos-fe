import React from 'react'
import { Table } from 'antd'

const ListItem = ({
  listItem,
  loading,
  item,
  ...otherProps
}) => {
  const columns = [
    {
      title: 'No',
      dataIndex: 'no',
      key: 'no',
      width: '50px'
    },
    {
      title: 'Product',
      dataIndex: 'productName',
      key: 'productName',
      width: '300px',
      render: (text, record) => {
        return (
          <div>
            <div><b>{record.productCode}</b>{` ${record.productName}`}</div>
            <div>D: {record.dimension} P: {record.dimensionPack} B: {record.dimensionBox}</div>
          </div>
        )
      }
    },
    {
      title: 'Qty',
      dataIndex: 'qty',
      key: 'qty',
      width: '100px',
      render: (text, record) => {
        return (
          <div>
            <div>Qty: {(text || 0).toLocaleString()}</div>
            <div>Price: Rp {(record.purchasePrice || 0).toLocaleString()}</div>
          </div>
        )
      }
    },
    {
      title: 'Subtotal',
      dataIndex: 'total',
      key: 'total',
      width: '100px',
      render: (text, record) => {
        return (
          <div>
            <div>Total: Rp {(record.total || 0).toLocaleString()}</div>
          </div>
        )
      }
    }
  ]

  return (
    <div>
      <div><h1>{item.supplierName} Items</h1></div>
      <div>
        <Table
          {...otherProps}
          loading={loading}
          bordered
          columns={columns}
          scroll={{ x: 1000 }}
          simple
          rowKey={record => record.id}
          footer={() => (
            <div style={{ textAlign: 'right' }}>
              <div>Qty: {listItem.reduce((prev, next) => {
                return prev + next.qty
              }, 0).toLocaleString()}</div>
              <div>Total: Rp {listItem.reduce((prev, next) => {
                return prev + (next.total)
              }, 0).toLocaleString()}</div>
            </div>)
          }
        />
      </div>
    </div>
  )
}

export default ListItem
