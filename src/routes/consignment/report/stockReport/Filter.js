import React from 'react'
import PropTypes from 'prop-types'
import { Form, Row, Col, Input, Select, Spin } from 'antd'

const Search = Input.Search
const FormItem = Form.Item
const Option = Select.Option

let searchTimeOut

const searchBarLayout = {
  sm: { span: 24 },
  md: { span: 24 },
  lg: { span: 12 },
  xl: { span: 12 }
}

const Filter = ({
  q,
  selectedVendor,
  vendorList,
  loadingSearchVendor,
  onFilterChange,
  searchVendor,
  onSelectVendor,
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
      <Col span={12} />
      <Col {...searchBarLayout} >
        <Form layout="horizontal">
          <FormItem label="Vendor">
            {getFieldDecorator('vendor', vendorFields)(
              <Select
                style={{
                  width: '100%'
                }}
                placeholder="vendor"
                showSearch
                onSearch={handleSearch}
                filterOption={false}
                onChange={handleChange}
                notFoundContent={loadingSearchVendor ? <Spin size="small" /> : null}
              >
                {vendorOption}
              </Select>
            )}
          </FormItem>
          <FormItem label="Cari Nama/Kode Produk">
            {getFieldDecorator('q', qFields)(
              <Search
                placeholder="Cari product NAME/CODE"
                onSearch={() => handleSubmit()}
                disabled={!selectedVendor.id}
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
