import React from 'react'
import PropTypes from 'prop-types'
import { Form, Select, Button, DatePicker, Col } from 'antd'

const RangePicker = DatePicker.RangePicker
const Option = Select.Option

const columnProps = {
  xs: 24,
  sm: 24,
  md: 8,
  lg: 8
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
  dateRange,
  getData,
  changeVendor,
  changeTime,
  onSearchVendor
}) => {
  let vendorOption = vendorList.length > 0 ? vendorList.map(record => (<Option key={record.id} value={record.id}>{record.vendor_code} - {record.name}</Option>)) : []

  let searchTimeOut
  const handleSearchVendor = (value) => {
    if (searchTimeOut) {
      clearTimeout(searchTimeOut)
      searchTimeOut = null
    }

    if (value !== '') {
      searchTimeOut = setTimeout(() => onSearchVendor(value), 1000)
    }
  }

  return (
    <Col span={24} style={{ marginBottom: '10px' }} >
      <Form layout="inline">
        <Col {...columnProps}>
          <Select
            placeholder="Pilih Vendor"
            style={{ width: '95%' }}
            onChange={changeVendor}
            filterOption={false}
            showSearch
            onSearch={handleSearchVendor}
          >
            {vendorOption}
          </Select>
        </Col>
        <Col {...columnProps}>
          <RangePicker onChange={changeTime} disabled={!selectedVendor} style={{ width: '95%' }} />
        </Col>
        <Col {...tailColumnProps}>
          <Button type="primary" onClick={() => getData()} disabled={!dateRange} style={{ width: '95%' }}>Cari</Button>
        </Col>
      </Form>
    </Col>
  )
}

Filter.propTypes = {
  form: PropTypes.object
}

export default Form.create()(Filter)
