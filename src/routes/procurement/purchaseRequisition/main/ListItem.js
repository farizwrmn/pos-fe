import React from 'react'
import { Table } from 'antd'
import {
  getRecommendedQtyToBuy,
  getRecommendedBoxToBuy
} from 'utils/safetyStockUtils'

const ListItem = ({
  listItem,
  ...otherProps
}) => {
  const columns = [
    {
      title: 'Name',
      dataIndex: 'product.productName',
      key: 'product.productName',
      width: '230px',
      render: (text, record) => {
        return (
          <div>
            <div><b>{record.product.productCode}</b></div>
            <div>{record.product.productName}</div>
            <div>D: {record.product.dimension} P: {record.product.dimensionPack} B: {record.product.dimensionBox}</div>
          </div>
        )
      }
    },
    {
      title: 'Desired Supplier',
      dataIndex: 'desiredSupplier.supplierName',
      key: 'desiredSupplier.supplierName',
      width: '100px',
      render: (text, record) => {
        return (
          <div>
            <div><b>{record.desiredSupplier.supplierCode}</b></div>
            <div>{record.desiredSupplier.supplierName}</div>
          </div>
        )
      }
    },
    {
      title: 'Brand',
      dataIndex: 'record.product.brand.brandCode',
      key: 'record.product.brand.brandCode',
      width: '100px',
      render: (text, record) => {
        return (
          <div>
            <div><b>{record.product.brand.brandCode}</b></div>
            <div>{record.product.brand.brandName}</div>
          </div>
        )
      }
    },
    {
      title: 'Category',
      dataIndex: 'record.product.category.categoryCode',
      key: 'record.product.category.categoryCode',
      width: '100px',
      render: (text, record) => {
        return (
          <div>
            <div><b>{record.product.category.categoryCode}</b></div>
            <div>{record.product.category.categoryName}</div>
          </div>
        )
      }
    },
    {
      title: 'Safety Stock',
      dataIndex: 'safetyStock',
      key: 'safetyStock',
      width: '150px',
      render: (text, record) => {
        return (
          <div>
            <div>Safety Stock: {record.safetyStock}</div>
            <div><b>Recommended: </b>{record.greasleyStock}</div>
            <div>Stock All Related Store: {record.stock}</div>
          </div>
        )
      }
    },
    {
      title: 'Recommended To Buy',
      dataIndex: 'qty',
      key: 'qty',
      width: '100px',
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

        if (boxToBuy > 0) {
          return (
            <div>
              <div>Buy: {qtyToBuy} Pcs</div>
              <div>{boxToBuy} Boxes</div>
            </div>
          )
        }
        return (
          <div>
            <div>Buy: {qtyToBuy} Pcs</div>
          </div>
        )
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
            <div>
              <div>Qty : {listItem.reduce((prev, next) => {
                return prev + next.qty
              }, 0).toLocaleString()}</div>
              <div>Credit : {listItem.reduce((cnt, o) => cnt + parseFloat(o.amountOut || 0), 0).toLocaleString()}</div>
            </div>)
          }
        />
      </div>
    </div>
  )
}

export default ListItem
