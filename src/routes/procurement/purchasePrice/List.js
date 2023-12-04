import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal } from 'antd'
import { DropOption } from 'components'
import { formatNumberQty } from 'utils/numberFormat'

const confirm = Modal.confirm

const List = ({ editItem, deleteItem, ...tableProps }) => {
  const handleMenuClick = (record, e) => {
    if (e.key === '1') {
      editItem(record)
    } else if (e.key === '2') {
      confirm({
        title: 'Are you sure to delete this record ?',
        onOk () {
          deleteItem(record.id)
        }
      })
    }
  }

  const columns = [
    {
      title: 'Store',
      dataIndex: 'storeId',
      key: 'storeId',
      render: (text, record) => {
        if (record.store) {
          return (
            <div>
              <div><b>{record.store.id}</b></div>
              <div>{record.store.storeName}</div>
            </div>
          )
        }
        return text
      }
    },
    {
      title: 'Product',
      dataIndex: 'productId',
      key: 'productId',
      render: (text, record) => {
        if (record.product) {
          return (
            <div>
              <div><b>{record.product.id}</b></div>
              <div><b>{record.product.productCode}</b></div>
              <div>{record.product.productName}</div>
            </div>
          )
        }
        return text
      }
    },
    {
      title: 'Supplier',
      dataIndex: 'supplierId',
      key: 'supplierId',
      render: (text, record) => {
        if (record.supplier) {
          return (
            <div>
              <div><b>{record.supplier.id}</b></div>
              <div><b>{record.supplier.supplierCode}</b></div>
              <div>{record.supplier.supplierName}</div>
            </div>
          )
        }
        return text
      }
    },
    {
      title: 'Price',
      dataIndex: 'qty',
      key: 'qty',
      render: (text, record) => {
        return (
          <div>
            <div>Purchase Price: {formatNumberQty(record.purchasePrice)}</div>
            <div>Disc 1 (%): {formatNumberQty(record.discPercent)}</div>
            <div>Disc 2 (%): {formatNumberQty(record.discPercent02)}</div>
            <div>Disc 3 (%): {formatNumberQty(record.discPercent03)}</div>
            <div>Disc (N): {formatNumberQty(record.discNominal)}</div>
          </div>
        )
      }
    },
    {
      title: 'Tax Type',
      dataIndex: 'taxType',
      key: 'taxType',
      render: (text, record) => {
        if (record.taxType === 'E') {
          return <div>Non Tax</div>
        }
        if (record.taxType === 'S') {
          return <div>Include Tax</div>
        }
        if (record.taxType === 'I') {
          return <div>Exclude Tax</div>
        }
        return text
      }
    },
    {
      title: 'Operation',
      key: 'operation',
      width: 100,
      fixed: 'right',
      render: (text, record) => {
        return <DropOption onMenuClick={e => handleMenuClick(record, e)} menuOptions={[{ key: '1', name: 'Edit' }, { key: '2', name: 'Delete' }]} />
      }
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
