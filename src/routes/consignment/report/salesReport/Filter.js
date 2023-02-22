import React from 'react'
import PropTypes from 'prop-types'
import { Form, Select, DatePicker, Button } from 'antd'

const FormItem = Form.Item
const Option = Select.Option
const RangePicker = DatePicker.RangePicker

const Filter = ({
  vendorList,
  selectedVendor,
  selectVendor,
  getData,
  searchVendor,
  dateRange,
  updateDateRange,
  form: {
    getFieldDecorator,
    getFieldsValue,
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

  let vendorProps = {
    rules: [
      {
        required: true
      }
    ]
  }
  if (selectedVendor.id) {
    vendorProps = {
      initialValue: `${selectedVendor.vendor_code} - ${selectedVendor.name}`
    }
  }

  let dateProps = {
    rules: [
      {
        required: true
      }
    ]
  }
  if (dateRange) {
    dateProps = {
      initialValue: dateRange
    }
  }

  return (
    <Form layout="inline">
      <FormItem >
        {getFieldDecorator('vendor', vendorProps)(
          <Select
            style={{
              width: '200px'
            }}
            value={selectedVendor.id}
            showSearch
            placeholder="Select vendor"
            onChange={(value) => { selectVendor(value) }}
            onSearch={selectVendorSearch}
            filterOption={false}
          >
            {vendorOption}
          </Select>
        )}
      </FormItem>
      <FormItem>
        {getFieldDecorator('dateRange', dateProps)(
          <RangePicker
            style={{
              width: '100%'
            }}
            disabled={!getFieldsValue().vendor}
            onChange={onChangeDate}
          />
        )}
      </FormItem>
      <FormItem>
        <Button type="primary" onClick={() => handleSubmit()} disabled={!getFieldsValue().dateRange}>
          CARI
        </Button>
      </FormItem>
    </Form>
  )
}

Filter.propTypes = {
  form: PropTypes.object
}

export default Form.create()(Filter)
