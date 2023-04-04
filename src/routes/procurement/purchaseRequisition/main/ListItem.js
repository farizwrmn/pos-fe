import React from 'react'
import { Table, Modal } from 'antd'
import {
  getRecommendedQtyToBuy,
  getRecommendedBoxToBuy
} from 'utils/safetyStockUtils'
import { DropOption } from 'components'

const confirm = Modal.confirm

const ListItem = ({
  listItem,
  onShowModalEditSupplier,
  onShowModalEditQty,
  onShowModalStock,
  deleteItem,
  ...otherProps
}) => {
  const handleMenuClick = (record, e) => {
    if (e.key === '1') {
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
      title: 'Name',
      dataIndex: 'product.productName',
      key: 'product.productName',
      width: '350px',
      render: (text, record) => {
        return (
          <div>
            <div><b>{record.product.productCode}</b>{` ${record.product.productName}`}</div>
            <div>D: {record.product.dimension} P: {record.product.dimensionPack} B: {record.product.dimensionBox}</div>
            <div onClick={() => onShowModalEditSupplier(record)}>{record.desiredSupplier.supplierName}</div>
            {record.supplierChangeMemo ? <div><pre>Memo: {record.supplierChangeMemo}</pre></div> : null}
            <div>{record.product.brand.brandName}</div>
            <div>{record.product.category.categoryName}</div>
          </div>
        )
      }
    },
    {
      title: 'Recommended To Buy',
      dataIndex: 'recommendedToBuy',
      key: 'recommendedToBuy',
      width: '150px',
      render: (text, record) => {
        let qtyToBuy = getRecommendedQtyToBuy({
          stock: record.stock,
          orderedQty: record.orderedQty,
          safetyStock: record.safetyStock
        })
        let boxToBuy = getRecommendedBoxToBuy({
          dimensionBox: record.product.dimensionBox,
          stock: record.stock,
          orderedQty: record.orderedQty,
          safetyStock: record.safetyStock
        })

        return (
          <div>
            <div>Safety Stock: {(record.safetyStock || 0).toLocaleString()}</div>
            <div><b>Recommended: </b>{(record.greasleyStock || 0).toLocaleString()}</div>
            <div onClick={() => onShowModalStock(record)} style={{ color: 'green' }}>Stock All Related Store: {(record.stock || 0).toLocaleString()}</div>
            <div style={{ color: qtyToBuy > 0 ? 'green' : 'initial' }}>Buy: {(qtyToBuy || 0).toLocaleString()} Pcs</div>
            {boxToBuy > 0 ? <div style={{ color: qtyToBuy > 0 ? 'green' : 'initial' }}>{(boxToBuy || 0).toLocaleString()} Boxes</div> : null}
          </div>
        )
      }
    },
    {
      title: 'To Purchase',
      dataIndex: 'qty',
      key: 'qty',
      width: '200px',
      render: (text, record) => {
        let boxToBuy = getRecommendedBoxToBuy({
          dimensionBox: record.product.dimensionBox,
          stock: 0,
          orderedQty: 0,
          safetyStock: record.qty
        })
        let qtyToBuy = getRecommendedQtyToBuy({
          stock: record.stock,
          orderedQty: record.orderedQty,
          safetyStock: record.safetyStock
        })
        return (
          <div>
            <div onClick={() => onShowModalEditQty(record)} style={{ color: record.qty > qtyToBuy ? 'red' : 'initial' }}>Qty: {(record.qty || 0).toLocaleString()} Pcs {record.qty > qtyToBuy ? `(Over ${record.qty - qtyToBuy})` : ''}</div>
            {record.supplierChangeMemo ? <div><pre>Memo: {record.supplierChangeMemo}</pre></div> : null}
            {boxToBuy > 0 ? <div>Box: {(boxToBuy || 0).toLocaleString()} Boxes</div> : null}
            <div>Cost: Rp {(record
              && record.product
              && record.product.costPrice > 0
              ? record.product.costPrice : 0).toLocaleString()
            }</div>
            <div>Sell Price: Rp {(record
              && record.product
              && record.product.sellPrice > 0
              ? record.product.sellPrice : 0).toLocaleString()
            }</div>
          </div>
        )
      }
    },
    {
      title: 'Subtotal',
      dataIndex: 'subtotal',
      key: 'subtotal',
      width: '100px',
      render: (text, record) => {
        return (
          <div>
            <div>Subtotal: Rp {(record
              && record.product
              && record.product.costPrice > 0
              ? record.product.costPrice * record.qty : 0).toLocaleString()
            }</div>
          </div>
        )
      }
    },
    {
      title: 'Operation',
      key: 'operation',
      width: '100px',
      render: (text, record) => {
        return <DropOption onMenuClick={e => handleMenuClick(record, e)} menuOptions={[{ key: '1', name: 'Delete', disabled: false }]} />
      }
    }
  ]

  return (
    <div>
      <div><h1>Requisition Item</h1></div>
      <div>
        <Table
          {...otherProps}
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
                return prev + (next.qty * next.product.costPrice)
              }, 0).toLocaleString()}</div>
            </div>)
          }
        />
      </div>
    </div>
  )
}

export default ListItem
