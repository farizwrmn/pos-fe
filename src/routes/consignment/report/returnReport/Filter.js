import React from 'react'
import PropTypes from 'prop-types'
import { Form, Select, DatePicker, Button } from 'antd'

const FormItem = Form.Item
const Option = Select.Option
const RangePicker = DatePicker.RangePicker

const Filter = ({
  vendorList,
  selectVendor,
  range,
  getData,
  searchVendor,
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

  const onChangeDate = (value) => {
    updateDateRange(value)
  }

  const vendorOption = vendorList.length > 0 ? vendorList.map(record => ((<Option key={record.id} value={record.id}>{record.vendor_code} - {record.name}</Option>))) : []

  return (
    <Form layout="inline">
      <FormItem >
        {getFieldDecorator('vendor')(
          <Select
            style={{
              width: '200px'
            }}
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
        {getFieldDecorator('dateRange', {
          initialValue: range
        })(
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
        <Button type="primary" onClick={() => handleSubmit()}>CARI</Button>
      </FormItem>
    </Form>
  )
}

Filter.propTypes = {
  form: PropTypes.object
}

export default Form.create()(Filter)
