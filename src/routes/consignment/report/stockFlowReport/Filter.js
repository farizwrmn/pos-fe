import React from 'react'
import { Form, Select, Button, DatePicker, Col, Spin } from 'antd'

const Option = Select.Option

let searchTimeOut

const selectColumnProps = {
  xs: 24,
  sm: 24,
  md: 6,
  lg: 6,
  xl: 6
}

const tailColumnProps = {
  xs: 24,
  sm: 24,
  md: 2,
  lg: 2
}

const Filter = ({
  vendorList,
  selectedVendor,
  selectedVendorProduct,
  selectedProduct,
  dateRange,
  loadingSearchVendor,
  loading,
  getStockFlowByProduct,
  updateSelectedProduct,
  searchVendor,
  onSelectVendor,
  updateDateRange,
  clearVendorList,
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

  const onSearchVendor = (value) => {
    clearVendorList()
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
    <Col span={24}>
      <Form layout="inline" style={{ marginBottom: '10px' }}>
        <Col {...selectColumnProps}>
          <Select
            style={{
              width: '100%',
              marginBottom: '10px',
              paddingRight: '10px'
            }}
            value={selectedVendor.id ? `${selectedVendor.vendor_code} - ${selectedVendor.name}` : undefined}
            showSearch
            placeholder="Select vendor"
            optionFilterProp="children"
            onChange={(value) => {
              onSelectVendor(value)
            }}
            onSearch={onSearchVendor}
            filterOption={false}
            notFoundContent={loadingSearchVendor ? <Spin size="small" /> : null}
          >
            {vendorOption}
          </Select>
        </Col>
        <Col {...selectColumnProps}>
          <Select
            style={{
              width: '100%',
              marginBottom: '10px',
              paddingRight: '10px'
            }}
            value={selectedProduct.id ? `${selectedProduct.product_code} - ${selectedProduct.product_name}` : undefined}
            disabled={!selectedVendor.id}
            showSearch
            placeholder="Select Product"
            optionFilterProp="children"
            onChange={(value) => {
              updateSelectedProduct(value)
            }}
            filterOption={(input, option) => {
              return (
                option.props.children[0].toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
                option.props.children[2].toLowerCase().indexOf(input.toLowerCase()) >= 0
              )
            }}
          >
            {productOption}
          </Select>
        </Col>
        <Col {...selectColumnProps}>
          <DatePicker.RangePicker
            disabled={!selectedProduct.id}
            onChange={handleDateRange}
            style={{
              marginBottom: '10px',
              width: '100%',
              paddingRight: '10px'
            }}
            value={dateRange.length > 0 ? dateRange : []}
          />
        </Col>
        <Col {...tailColumnProps}>
          <Button type="primary" onClick={() => handleSubmit()} disabled={!dateRange.length > 0} loading={loading}>
            Cari
          </Button>
        </Col>
      </Form>
    </Col>
  )
}

export default Form.create()(Filter)
