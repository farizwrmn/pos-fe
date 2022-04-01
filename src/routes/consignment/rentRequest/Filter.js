import React from 'react'
import PropTypes from 'prop-types'
import { Form, Select, Row, Col, Input } from 'antd'

const Search = Input.Search
const { Option } = Select
const FormItem = Form.Item

const searchBarLayout = {
  sm: { span: 24 },
  md: { span: 24 },
  lg: { span: 12 },
  xl: { span: 12 }
}

const Filter = ({
  onFilterChange,
  form: {
    getFieldDecorator,
    getFieldsValue
  }
}) => {
  const handleSubmit = (status) => {
    let field = getFieldsValue()
    if (status) {
      field.status = status
    }
    if (field.counterName === undefined || field.counterName === '') delete field.counterName
    onFilterChange(field)
  }

  return (
    <Row>
      <Col span={12}>
        <FormItem >
          {getFieldDecorator('status', {
            initialValue: 'pending'
          })(
            <Select defaultValue="pending" style={{ width: 120 }} onChange={value => handleSubmit(value)}>
              <Option value="pending">Pending</Option>
              <Option value="approved">Approved</Option>
              <Option value="canceled">Canceled</Option>
              <Option value="rejected">Rejected</Option>
            </Select>
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
  )
}

Filter.propTypes = {
  form: PropTypes.object,
  onFilterChange: PropTypes.func
}

export default Form.create()(Filter)
