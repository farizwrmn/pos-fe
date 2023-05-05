import React from 'react'
import PropTypes from 'prop-types'
import { Form, Select, DatePicker, Row, Col, Input } from 'antd'
import moment from 'moment'

const Search = Input.Search
const FormItem = Form.Item
const { RangePicker } = DatePicker
const { Option } = Select

const searchBarLayout = {
  sm: { span: 24 },
  md: { span: 24 },
  lg: { span: 12 },
  xl: { span: 12 }
}

const Filter = ({
  from,
  to,
  onFilterChange,
  location,
  supplierId,
  listSupplier,
  form: {
    getFieldDecorator,
    getFieldsValue
  }
}) => {
  const handleSubmit = () => {
    let field = getFieldsValue()
    if (field.counterName === undefined || field.counterName === '') delete field.counterName
    onFilterChange(field)
  }

  const onDateChange = (rangePicker) => {
    onFilterChange({
      ...location.query,
      from: rangePicker[0].format('YYYY-MM-DD'),
      to: rangePicker[1].format('YYYY-MM-DD')
    })
  }

  const onSupplierChange = (selectedValue) => {
    console.log('selectedValue', selectedValue)
    onFilterChange({
      ...location.query,
      supplierId: selectedValue
    })
  }

  const supplierData = (listSupplier || []).length > 0 ?
    listSupplier.map(b => <Option value={b.id} key={b.id}>{b.supplierName}</Option>)
    : []

  return (
    <div>
      <Row>
        <Col span={12}>
          <FormItem required label="Supplier">
            {getFieldDecorator('supplierId', {
              initialValue: supplierId ? Number(supplierId) : undefined,
              rules: [
                {
                  required: true
                }
              ]
            })(<Select
              showSearch
              allowClear
              optionFilterProp="children"
              style={{ width: '100%' }}
              onChange={onSupplierChange}
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toString().toLowerCase()) >= 0}
            >
              {supplierData}
            </Select>)}
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <FormItem>
            {getFieldDecorator('rangeDate', {
              initialValue: from && to ? [moment.utc(from), moment.utc(to)] : undefined,
              rules: [
                { required: true }
              ]
            })(
              <RangePicker allowClear={false} onChange={onDateChange} size="large" format="DD-MMM-YYYY" />
            )}
          </FormItem>
        </Col>
        <Col {...searchBarLayout} >
          <FormItem >
            {getFieldDecorator('q')(
              <Search
                placeholder="Search"
                onSearch={() => handleSubmit()}
              />
            )}
          </FormItem>
        </Col>
      </Row>
    </div >
  )
}

Filter.propTypes = {
  form: PropTypes.object,
  onFilterChange: PropTypes.func
}

export default Form.create()(Filter)
