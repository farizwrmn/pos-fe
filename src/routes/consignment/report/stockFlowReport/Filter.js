import React from 'react'
import { Form, Row, Select, Button, DatePicker } from 'antd'

const FormItem = Form.Item
const Option = Select.Option

const Filter = ({
  vendorList,
  selectedVendor,
  selectedVendorProduct,
  selectedProduct,
  getStockFlowByProduct,
  updateSelectedProduct,
  searchVendor,
  onSelectVendor,
  updateDateRange,
  form: {
    getFieldDecorator,
    getFieldsValue,
    setFieldsValue,
    validateFields
  }
}) => {
  const handleSubmit = () => {
    validateFields((error) => {
      if (error) {
        return error
      }

      getStockFlowByProduct()
    })
  }

  let searchTimeOut
  const onSearchVendor = (value) => {
    if (value.length > 0) {
      if (searchTimeOut) {
        clearTimeout(searchTimeOut)
        searchTimeOut = null
      }

      if (value !== '') {
        searchTimeOut = setTimeout(() => searchVendor(value), 1000)
      }
    }
  }

  const handleDateRange = (value) => {
    updateDateRange(value)
  }

  const vendorOption = vendorList.length > 0 ? vendorList.map(record => <Option key={record.id} value={record.id}>{`${record.vendor_code} - ${record.name}`}</Option>) : []
  const productOption = selectedVendorProduct.length > 0 ? selectedVendorProduct.map(record => <Option key={record.id} value={record.id}>{record.product_code} - {record.product_name}</Option>) : []

  let vendorprops = {
    rules: [
      {
        required: true
      }
    ]
  }
  if (selectedVendor && selectedVendor.name) {
    vendorprops.initialValue = `${selectedVendor.vendor_code} - ${selectedVendor.name}`
  }

  let productProps = {
    rules: [
      {
        required: true
      }
    ]
  }
  if (selectedProduct && selectedProduct.product_name) {
    productProps = `${selectedProduct.product_code} - ${selectedProduct.product_name}`
  }

  let dateRangeProps = {
    rules: [
      {
        required: true
      }
    ]
  }

  return (
    <Form layout="inline" style={{ marginBottom: '10px' }}>
      <Row>
        <FormItem >
          {getFieldDecorator('vendor', vendorprops)(
            <Select
              style={{
                width: '200px'
              }}
              showSearch
              placeholder="Select vendor"
              optionFilterProp="children"
              onChange={(value) => {
                setFieldsValue({
                  product: null
                })
                onSelectVendor(value)
              }}
              onSearch={onSearchVendor}
              filterOption={false}
            >
              {vendorOption}
            </Select>
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('product', productProps)(
            <Select
              style={{
                width: '200px'
              }}
              disabled={!getFieldsValue().vendor}
              showSearch
              placeholder="Select Product"
              optionFilterProp="children"
              onChange={(value) => {
                updateSelectedProduct(value)
              }}
              filterOption={(input, option) => {
                if ((option.props.children[0].toLowerCase()).includes(input.toLowerCase()) || (option.props.children[2].toLowerCase()).includes(input.toLowerCase())) {
                  return true
                }
                return false
              }}
            >
              {productOption}
            </Select>
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('dateRange', dateRangeProps)(
            <DatePicker.RangePicker disabled={!getFieldsValue().vendor} onChange={handleDateRange} />
          )}
        </FormItem>
        <FormItem>
          <Button type="primary" onClick={() => handleSubmit()}>
            CARI
          </Button>
        </FormItem>
      </Row>
    </Form>
  )
}

export default Form.create()(Filter)
