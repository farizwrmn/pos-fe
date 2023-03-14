import React from 'react'
import PropTypes from 'prop-types'
import { Form, Select, DatePicker, Button, Col, Spin } from 'antd'

const Option = Select.Option
const RangePicker = DatePicker.RangePicker

let searchTimeOut

const columnProps = {
  xs: 24,
  sm: 24,
  md: 8,
  lg: 8
}

const tailColumnProps = {
  xs: 24,
  sm: 24,
  md: 3,
  lg: 3
}

const Filter = ({
  vendorList,
  selectedVendor,
  selectVendor,
  loadingSearchVendor,
  getData,
  searchVendor,
  dateRange,
  updateDateRange,
  loading,
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

  const onChangeDate = (value) => {
    updateDateRange(value)
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

  const vendorOption = vendorList.length > 0 ? (vendorList.map(record => (<Option key={record.id} value={record.id}>{record.vendor_code} - {record.name}</Option>))) : []

  return (
    <Form layout="inline">
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
          value={selectedVendor.id ? `${selectedVendor.vendor_code} - ${selectedVendor.name}` : undefined}
          notFoundContent={loadingSearchVendor ? <Spin size="small" /> : null}
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
          value={dateRange.length > 0 ? dateRange : []}
        />
      </Col>
      <Col {...tailColumnProps}>
        <Button
          style={{
            width: '95%',
            marginBottom: '10px'
          }}
          type="primary"
          onClick={() => handleSubmit()}
          disabled={!dateRange.length > 0}
          loading={loading}
        >
          Cari
        </Button>
      </Col>
    </Form>
  )
}

Filter.propTypes = {
  form: PropTypes.object
}

export default Form.create()(Filter)
