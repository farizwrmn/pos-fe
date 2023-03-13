import React from 'react'
import PropTypes from 'prop-types'
import { Form, Row, Col, Input, Select, Spin, Button } from 'antd'

const Search = Input.Search
const FormItem = Form.Item
const Option = Select.Option

let searchTimeOut

const searchBarLayout = {
  xs: { span: 24 },
  sm: { span: 24 },
  md: { span: 8 },
  lg: { span: 6 },
  xl: { span: 6 }
}

const vendorLayout = {
  xs: { span: 24 },
  sm: { span: 24 },
  md: { span: 16 },
  lg: { span: 18 },
  xl: { span: 18 }
}

const Filter = ({
  q,
  selectedVendor,
  vendorList,
  loadingSearchVendor,
  loading,
  onFilterChange,
  searchVendor,
  onSelectVendor,
  getData,
  clearVendorList,
  form: {
    getFieldDecorator,
    getFieldsValue,
    setFieldsValue
  }
}) => {
  const handleSubmit = () => {
    let field = getFieldsValue().q
    onFilterChange(field)
  }

  const handleSearch = (value) => {
    clearVendorList()
    if (value !== '') {
      if (searchTimeOut) {
        clearTimeout(searchTimeOut)
        searchTimeOut = null
      }

      searchTimeOut = setTimeout(() => searchVendor(value), 1000)
    }
  }

  const handleChange = (value) => {
    if (value !== '') {
      setFieldsValue({
        q: ''
      })
      onSelectVendor(value)
    }
  }

  const vendorOption = vendorList ? vendorList.map(record => <Option key={record.id} value={record.id}>{record.name}</Option>) : []

  let vendorFields = {}
  if (selectedVendor && selectedVendor.name) {
    vendorFields.initialValue = selectedVendor.name
  }

  let qFields = {}
  if (q) {
    qFields.initialValue = q
  }

  return (
    <Row>
      <Col {...vendorLayout}>
        <Col>
          <Select
            style={{
              width: 200,
              margin: '0 10px 10px 0'
            }}
            placeholder="Select Vendor"
            showSearch
            onSearch={handleSearch}
            filterOption={false}
            onChange={handleChange}
            value={selectedVendor.id ? `${selectedVendor.vendor_code} - ${selectedVendor.name}` : undefined}
            notFoundContent={loadingSearchVendor ? <Spin size="small" /> : null}
          >
            {vendorOption}
          </Select>
          <Button type="primary" style={{ width: 100, margin: '0 0 10px 0' }} onClick={() => getData()} loading={loading}>
            Cari
          </Button>
        </Col>
      </Col>
      <Col {...searchBarLayout} >
        <Form layout="horizontal">
          <FormItem >
            {getFieldDecorator('q', qFields)(
              <Search
                placeholder="Cari nama produk / kode produk"
                onSearch={() => handleSubmit()}
              />
            )}
          </FormItem>
        </Form>
      </Col>
    </Row>
  )
}

Filter.propTypes = {
  form: PropTypes.object,
  onFilterChange: PropTypes.func
}

export default Form.create()(Filter)
