import React from 'react'
import PropTypes from 'prop-types'
import { Form, Select, Button, DatePicker } from 'antd'

const FormItem = Form.Item
const RangePicker = DatePicker.RangePicker
const Option = Select.Option

const Filter = ({
  vendorList,
  selectedVendor,
  dateRange,
  getData,
  changeVendor,
  changeTime,
  onSearchVendor,
  form: {
    getFieldDecorator
  }
}) => {
  console.log('vendorList', vendorList)
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

  let vendorProps = {
    rules: [
      {
        required: true
      }
    ]
  }
  console.log('selectedVendor', selectedVendor)
  if (selectedVendor && selectedVendor.id) {
    vendorProps = {
      ...vendorProps,
      initialValue: `${selectedVendor.vendor_code} - ${selectedVendor.name}`
    }
  }

  let dateRangeProps = {
    rules: [
      {
        required: true
      }
    ]
  }
  if (dateRange && dateRange.length > 0) {
    dateRangeProps = {
      ...dateRangeProps,
      initialValue: dateRange
    }
  }


  return (
    <Form layout="inline">
      <FormItem>
        {getFieldDecorator('vendor', vendorProps)(
          <Select
            placeholder="Pilih Vendor"
            style={{ marginBottom: '10px', minWidth: '200px' }}
            onChange={changeVendor}
            filterOption={false}
            showSearch
            onSearch={handleSearchVendor}
          >
            {vendorOption}
          </Select>
        )}
      </FormItem>
      <FormItem>
        {getFieldDecorator('date', dateRangeProps)(
          <RangePicker onChange={changeTime} />
        )}
      </FormItem>
      <FormItem>
        <Button type="primary" onClick={() => getData()}>Cari</Button>
      </FormItem>
    </Form>
  )
}

Filter.propTypes = {
  form: PropTypes.object
}

export default Form.create()(Filter)
