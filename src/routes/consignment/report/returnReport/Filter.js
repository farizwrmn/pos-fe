import React from 'react'
import PropTypes from 'prop-types'
import { Form, Select, DatePicker, Button, Col, Spin } from 'antd'

const Option = Select.Option
const RangePicker = DatePicker.RangePicker

let searchTimeOut

const columnProps = {
  xs: 24,
  sm: 24,
  md: 6,
  lg: 6
}

const tailColumnProps = {
  xs: 24,
  sm: 24,
  md: 2,
  lg: 2
}


const Filter = ({
  vendorList,
  selectVendor,
  selectedVendor,
  loadingSearchVendor,
  dateRange,
  getData,
  searchVendor,
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

      getData()
    })
  }

  const selectVendorSearch = (value) => {
    clearVendorList()
    if (value.length > 0) {
      if (searchTimeOut) {
        clearTimeout(searchTimeOut)
        searchTimeOut = null
      }

      if (value !== '') {
        searchTimeOut = setTimeout(() => {
          searchVendor(value)
        }, 1000)
      }
    }
  }

  const onChangeDate = (value) => {
    updateDateRange(value)
  }

  const vendorOption = vendorList.length > 0 ? vendorList.map(record => ((<Option key={record.id} value={record.id}>{record.vendor_code} - {record.name}</Option>))) : []

  return (
    <Col span={24} style={{ marginBottom: '10px' }}>
      <Col {...columnProps}>
        <Select
          style={{
            width: '95%',
            marginBottom: '10px'
          }}
          showSearch
          placeholder="Select Vendor"
          onChange={(value) => { selectVendor(value) }}
          onSearch={selectVendorSearch}
          filterOption={false}
          notFoundContent={loadingSearchVendor ? <Spin size="small" /> : null}
          value={selectedVendor.id ? `${selectedVendor.vendor_code} - ${selectedVendor.name}` : undefined}
        >
          {vendorOption}
        </Select>
      </Col>
      <Col {...columnProps}>
        <RangePicker
          style={{
            width: '95%',
            marginBottom: '10px'
          }}
          onChange={onChangeDate}
          value={dateRange}
        />
      </Col>
      <Col {...tailColumnProps}>
        <Button type="primary" style={{ width: '95%', marginBottom: '10px' }} onClick={() => handleSubmit()} disabled={!dateRange.length > 0}>Cari</Button>
      </Col>
    </Col>
  )
}

Filter.propTypes = {
  form: PropTypes.object
}

export default Form.create()(Filter)
