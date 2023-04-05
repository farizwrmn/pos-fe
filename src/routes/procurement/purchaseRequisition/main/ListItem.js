import React from 'react'
import { Table, Button, Modal, Icon } from 'antd'
import {
  getRecommendedQtyToBuy,
  getRecommendedBoxToBuy
} from 'utils/safetyStockUtils'

const confirm = Modal.confirm

const ListItem = ({
  listItem,
  onShowModalEditSupplier,
  onShowModalEditQty,
  onShowModalStock,
  onShowModalEditCost,
  deleteItem,
  loading,
  ...otherProps
}) => {
  const onDeleteItem = (record) => {
    confirm({
      title: 'Are you sure to delete this record ?',
      onOk () {
        deleteItem(record)
      }
    })
  }

  const columns = [
    {
      title: 'Name',
      dataIndex: 'no',
      key: 'no',
      width: '50px'
    },
    {
      title: 'Name',
      dataIndex: 'product.productName',
      key: 'product.productName',
      width: '300px',
      render: (text, record) => {
        let qtyToBuy = getRecommendedQtyToBuy({
          stock: record.stock,
          orderedQty: record.orderedQty,
          safetyStock: record.safetyStock
        })
        return (
          <div>
            <div><b>{record.product.productCode}</b>{` ${record.product.productName}`}</div>
            <div style={{ color: record.qty > qtyToBuy ? 'red' : 'initial' }}>D: {record.product.dimension} P: {record.product.dimensionPack} B: {record.product.dimensionBox}</div>
            <div onClick={() => onShowModalEditSupplier(record)} style={{ color: 'green' }}>{record.storeSupplier.supplierName} <Icon type="edit" /></div>
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
            <div onClick={() => onShowModalStock(record)} style={{ color: 'green' }}>Stock All Related Store: {(record.stock || 0).toLocaleString()} <Icon type="eye-o" /></div>
            <div onClick={() => onShowModalStock(record)} style={{ color: qtyToBuy > 0 ? 'green' : 'initial' }}>Buy: {(qtyToBuy || 0).toLocaleString()} Pcs</div>
            {boxToBuy > 0 ? <div onClick={() => onShowModalStock(record)} style={{ color: qtyToBuy > 0 ? 'green' : 'initial' }}>{(boxToBuy || 0).toLocaleString()} Boxes</div> : null}
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
            <div onClick={() => onShowModalEditQty(record)} style={{ color: record.qty > qtyToBuy ? 'red' : 'initial' }}>Qty: {(record.qty || 0).toLocaleString()} Pcs {record.qty > qtyToBuy ? `(Over ${record.qty - qtyToBuy}) ` : ''}<Icon type="edit" style={{ fontSize: '12px' }} /></div>
            {record.notFulfilledQtyMemo ? <div><pre>Memo: {record.notFulfilledQtyMemo}</pre></div> : null}
            {boxToBuy > 0 ? <div>Box: {(boxToBuy || 0).toLocaleString()} Boxes</div> : null}
            <div onClick={() => onShowModalEditCost(record)} style={{ color: 'green' }}>Cost: Rp {(record
              && record.purchasePrice > 0
              ? record.purchasePrice : 0).toLocaleString()
            } <Icon type="edit" style={{ fontSize: '12px' }} /></div>
            {record.changingCostMemo ? <div><pre>Memo: {record.changingCostMemo}</pre></div> : null}
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
        return <Button disabled={loading} icon="delete" type="danger" onClick={() => onDeleteItem(record)}>Delete</Button >
      }
    }
  ]

  return (
    <div>
      <div><h1>Requisition Item</h1></div>
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
