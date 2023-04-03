import React from 'react'
import { Table } from 'antd'

const ListItem = ({
  ...otherProps
}) => {
  const columns = [
    {
      title: 'Name',
      dataIndex: 'product.productName',
      key: 'product.productName',
      width: '250px',
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
      title: 'Lead Time',
      dataIndex: 'maxLeadTime',
      key: 'maxLeadTime',
      width: '150px',
      render: (text, record) => {
        return (
          <div>
            <div>Max Lead Time: {record.maxLeadTime} Days</div>
            <div><b>Average Lead Time: </b>{record.avgLeadTime} Days</div>
          </div>
        )
      }
    },
    {
      title: 'Sales',
      dataIndex: 'avgSalesPerDay',
      key: 'avgSalesPerDay',
      width: '150px',
      render: (text, record) => {
        return (
          <div>
            <div>Max Sales Per Day: {record.maxSalesPerDay} Pcs</div>
            <div><b>Average Sales Per Day: </b>{record.avgSalesPerDay} Pcs</div>
          </div>
        )
      }
    },
    {
      title: 'Recommended To Buy',
      dataIndex: 'recommededToBuy',
      key: 'recommededToBuy',
      width: '100px',
      render: (text, record) => {
        const minimumBuyingQty = record.product.dimensionBox
        let qtyToBuy = 0
        let boxToBuy = 0
        if ((record.stock - record.orderedQty) >= record.safetyStock) {
          qtyToBuy = 0
        } else {
          qtyToBuy = record.safetyStock - record.stock - record.orderedQty
        }
        if (Number(minimumBuyingQty) > 1) {
          boxToBuy = Math.ceil(qtyToBuy / minimumBuyingQty)
        }
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
          scroll={{ x: 1200 }}
          simple
          rowKey={record => record.id}
        />
      </div>
    </div>
  )
}

export default ListItem
