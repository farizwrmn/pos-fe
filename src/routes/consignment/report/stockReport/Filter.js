import React from 'react'
import PropTypes from 'prop-types'
import { Form, Row, Col, Input, Select, Spin } from 'antd'

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
  location,
  vendorList,
  loadingSearchVendor,
  onFilterChange,
  searchVendor,
  form: {
    getFieldDecorator,
    getFieldsValue
  }
}) => {
  const handleSubmit = (value) => {
    let field = {
      ...getFieldsValue()
    }
    if (value) {
      field.vendorId = value
    }
    onFilterChange(field)
  }

  const handleSearch = (value) => {
    if (value !== '') {
      if (searchTimeOut) {
        clearTimeout(searchTimeOut)
        searchTimeOut = null
      }

      searchTimeOut = setTimeout(() => searchVendor(value), 1000)
    }
  }

  const vendorOption = vendorList ? vendorList.map(record => <Option key={record.id} id={record.id} value={record.id} title={`${record.name}@(${record.vendor_code})`}>{`${record.name} | (${record.vendor_code})`}</Option>) : []

  return (
    <Form layout="horizontal">
      <Row>
        <Col {...vendorLayout}>
          <FormItem >
            {getFieldDecorator('vendorId', {
              initialValue: location.query ? Number(location.query.vendorId) : undefined
            })(
              <Select
                style={{
                  width: 200,
                  margin: '0 10px 10px 0'
                }}
                placeholder="Select Vendor"
                showSearch
                onSearch={handleSearch}
                onSelect={handleSubmit}
                filterOption={false}
                notFoundContent={loadingSearchVendor ? <Spin size="small" /> : null}
              >
                {vendorOption}
              </Select>
            )}</FormItem>
        </Col>
        <Col {...searchBarLayout} >
          <FormItem >
            {getFieldDecorator('q', {
              initialValue: location.query ? location.query.q : undefined
            })(
              <Search
                placeholder="Cari nama produk / kode produk"
                onSearch={() => handleSubmit()}
              />
            )}
          </FormItem>
        </Col>
      </Row>
    </Form>
  )
}

Filter.propTypes = {
  form: PropTypes.object,
  onFilterChange: PropTypes.func
}

export default Form.create()(Filter)
