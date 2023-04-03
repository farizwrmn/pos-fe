import React from 'react'
import { Table, Row, Col, Select, Form } from 'antd'

const FormItem = Form.Item
const { Option } = Select

const formItemLayout = {
  labelCol: {
    md: { span: 24 },
    lg: { span: 8 }
  },
  wrapperCol: {
    md: { span: 24 },
    lg: { span: 16 }
  }
}

const ListSafetyStock = ({
  listSafetySupplier,
  listSafetyBrand,
  listSafetyCategory,
  form: { getFieldDecorator },
  ...otherProps
}) => {
  const columns = [
    {
      title: 'Name',
      dataIndex: 'product.productName',
      key: 'product.productName',
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
      render: (text, record) => {
        const minimumBuyingQty = record.product.dimensionBox
        let qtyToBuy = 0
        let boxToBuy = 0
        if (record.stock >= record.safetyStock) {
          qtyToBuy = 0
        } else {
          qtyToBuy = record.safetyStock - record.stock
        }
        if (Number(minimumBuyingQty) > 1) {
          boxToBuy = Math.ceil(qtyToBuy / minimumBuyingQty)
        }
        if (boxToBuy > 0) {
          return (
            <div>
              <div>Buy: {qtyToBuy} Pcs or {boxToBuy} Boxes</div>
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

  const listSupplier = listSafetySupplier.map(item => (<Option title={`${item.supplierName} (code: ${item.supplierCode})`} value={item.id} key={item.id}>{`${item.supplierName} (count: ${item.countItem})`}</Option>))
  const listBrand = listSafetyBrand.map(item => (<Option title={`${item.brandName} (code: ${item.brandCode})`} value={item.id} key={item.id}>{`${item.brandName} (count: ${item.countItem})`}</Option>))
  const listCategory = listSafetyCategory.map(item => (<Option title={`${item.categoryName} (code: ${item.categoryCode})`} value={item.id} key={item.id}>{`${item.categoryName} (count: ${item.countItem})`}</Option>))

  return (
    <div>
      <div><h1>Safety Stock</h1></div>
      <Row>
        <Col md={24} lg={8}>
          <FormItem label="Supplier" {...formItemLayout}>
            {getFieldDecorator('desiredSupplierId', {
              rules: [{
                required: false
              }]
            })(
              <Select style={{ width: '100%' }} mode="multiple" allowClear size="large">
                {listSupplier}
              </Select>
            )}
          </FormItem>
        </Col>
        <Col md={24} lg={8}>
          <FormItem label="Brand" {...formItemLayout}>
            {getFieldDecorator('brandId', {
              rules: [{
                required: false
              }]
            })(
              <Select style={{ width: '100%' }} mode="multiple" allowClear size="large">
                {listBrand}
              </Select>
            )}
          </FormItem>
        </Col>
        <Col md={24} lg={8}>
          <FormItem label="Category" {...formItemLayout}>
            {getFieldDecorator('categoryId', {
              rules: [{
                required: false
              }]
            })(
              <Select style={{ width: '100%' }} mode="multiple" allowClear size="large">
                {listCategory}
              </Select>
            )}
          </FormItem>
        </Col>
      </Row>
      <div>
        <Table
          {...otherProps}
          bordered
          columns={columns}
          simple
          rowKey={record => record.id}
        />
      </div>
    </div>
  )
}

export default Form.create()(ListSafetyStock)
