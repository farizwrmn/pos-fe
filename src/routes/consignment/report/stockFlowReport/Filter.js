import React from 'react'
import { Form, Select, Button, DatePicker, Col } from 'antd'

const FormItem = Form.Item
const Option = Select.Option

const selectColumnProps = {
  xs: 24,
  sm: 24,
  md: 6,
  lg: 6,
  xl: 6
}

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

  return (
    <Form layout="inline" style={{ marginBottom: '10px' }}>
      <Col {...selectColumnProps}>
        <Select
          size="large"
          style={{
            width: '100%',
            marginBottom: '10px',
            paddingRight: '10px'
          }}
          showSearch
          placeholder="Select vendor"
          optionFilterProp="children"
          onChange={(value) => {
            onSelectVendor(value)
          }}
          onSearch={onSearchVendor}
          filterOption={false}
        >
          {vendorOption}
        </Select>
      </Col>
      <Col {...selectColumnProps}>
        <Select
          size="large"
          style={{
            width: '100%',
            marginBottom: '10px',
            paddingRight: '10px'
          }}
          disabled={!selectedVendor}
          showSearch
          placeholder="Select Product"
          optionFilterProp="children"
          onChange={(value) => {
            updateSelectedProduct(value)
          }}
          filterOption={false}
        >
          {productOption}
        </Select>
      </Col>
      <Col {...selectColumnProps}>
        <DatePicker.RangePicker
          disabled={!selectedProduct}
          size="large"
          onChange={handleDateRange}
          style={{
            marginBottom: '10px',
            width: '100%',
            paddingRight: '10px'
          }}
        />
      </Col>
      <FormItem>
        <Button type="primary" onClick={() => handleSubmit()}>
          CARI
        </Button>
      </FormItem>
    </Form>
  )
}

export default Form.create()(Filter)
