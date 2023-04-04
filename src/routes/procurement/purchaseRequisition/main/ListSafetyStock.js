import React from 'react'
import { Table, Row, Col, Button, Checkbox, Select, Form } from 'antd'

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
  onFilterChange,
  updateSelectedKey,
  selectedRowKeysSafety,
  handleSubmitAll,
  loading,
  form: { getFieldDecorator, getFieldsValue },
  ...otherProps
}) => {
  const columns = [
    {
      title: 'Name',
      dataIndex: 'product.productName',
      key: 'product.productName',
      width: '220px',
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

  const listSupplier = listSafetySupplier.map(item => (<Option title={`${item.supplierName} (code: ${item.supplierCode})`} value={item.id} key={item.id}>{`${item.supplierName} (count: ${item.countItem})`}</Option>))
  const listBrand = listSafetyBrand.map(item => (<Option title={`${item.brandName} (code: ${item.brandCode})`} value={item.id} key={item.id}>{`${item.brandName} (count: ${item.countItem})`}</Option>))
  const listCategory = listSafetyCategory.map(item => (<Option title={`${item.categoryName} (code: ${item.categoryCode})`} value={item.id} key={item.id}>{`${item.categoryName} (count: ${item.countItem})`}</Option>))

  const onFilter = (field, value) => {
    const data = { ...getFieldsValue() }
    if (field === 'desiredSupplierId') {
      if (value && value.length > 0) {
        data.desiredSupplierId = data.desiredSupplierId && typeof data.desiredSupplierId === 'object' ? data.desiredSupplierId.concat(value) : value
      } else {
        data.desiredSupplierId = []
      }
    }
    if (field === 'brandId' && value && value.length > 0) {
      if (value && value.length > 0) {
        data.brandId = data.brandId && typeof data.brandId === 'object' ? data.brandId.concat(value) : value
      } else {
        data.brandId = []
      }
    }
    if (field === 'categoryId' && value && value.length > 0) {
      if (value && value.length > 0) {
        data.categoryId = data.categoryId && typeof data.categoryId === 'object' ? data.categoryId.concat(value) : value
      } else {
        data.categoryId = []
      }
    }
    if (field === 'notFinishedGeneral') {
      data.notFinishedGeneral = Number(value)
    } else {
      data.notFinishedGeneral = Number(data.notFinishedGeneral)
    }
    onFilterChange(data)
  }

  const rowSelection = {
    selectedRowKeys: selectedRowKeysSafety,
    hideDefaultSelections: false,
    onChange: (selectedRowKeys) => {
      updateSelectedKey(selectedRowKeys)
    }
  }

  const filterOption = (input, option) => option.props.children.toLowerCase().indexOf(input.toString().toLowerCase()) >= 0

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
              <Select filterOption={filterOption} onChange={value => onFilter('desiredSupplierId', value)} style={{ width: '100%' }} mode="multiple" allowClear size="large">
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
              <Select filterOption={filterOption} onChange={value => onFilter('brandId', value)} style={{ width: '100%' }} mode="multiple" allowClear size="large">
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
              <Select filterOption={filterOption} onChange={value => onFilter('categoryId', value)} style={{ width: '100%' }} mode="multiple" allowClear size="large">
                {listCategory}
              </Select>
            )}
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col md={24} lg={12}>
          <FormItem label="Recommended To Buy" {...formItemLayout}>
            {getFieldDecorator('notFinishedGeneral', {
              valuePropName: 'checked'
            })(<Checkbox onChange={e => onFilter('notFinishedGeneral', e.target.checked)}>Show All</Checkbox>)}
          </FormItem>
        </Col>
        <Col md={24} lg={12} />
      </Row>
      <div>
        <Table
          {...otherProps}
          rowSelection={rowSelection}
          bordered
          columns={columns}
          scroll={{ x: 1030 }}
          simple
          loading={loading}
          rowKey={record => record.id}
        />
      </div>
      {selectedRowKeysSafety && selectedRowKeysSafety.length > 0 ? (
        <FormItem>
          <Button disabled={loading} size="small" type="primary" onClick={handleSubmitAll}>{`Add ${selectedRowKeysSafety.length} Selected`}</Button>
        </FormItem>
      ) : null}
    </div>
  )
}

export default Form.create()(ListSafetyStock)
