import React from 'react'
import PropTypes from 'prop-types'
import { Form, Select, DatePicker, Button, Col } from 'antd'

const Option = Select.Option
const RangePicker = DatePicker.RangePicker

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
  getData,
  searchVendor,
  dateRange,
  updateDateRange,
  loading,
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

  let searchTimeOut
  const selectVendorSearch = (value) => {
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
            width: '95%'
          }}
          showSearch
          placeholder="Select vendor"
          onChange={(value) => { selectVendor(value) }}
          onSearch={selectVendorSearch}
          filterOption={false}
          value={selectedVendor.id ? `${selectedVendor.vendor_code} - ${selectedVendor.name}` : undefined}
        >
          {vendorOption}
        </Select>
      </Col>
      <Col {...columnProps}>
        <RangePicker
          style={{
            width: '95%'
          }}
          disabled={!selectedVendor.id}
          onChange={onChangeDate}
          value={dateRange.length > 0 ? dateRange : []}
        />
      </Col>
      <Col {...tailColumnProps}>
        <Button
          style={{
            width: '95%'
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
