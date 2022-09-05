import React from 'react'
import PropTypes from 'prop-types'
import { Form, Row, Col, Input, DatePicker } from 'antd'

const Search = Input.Search
const FormItem = Form.Item
const { RangePicker } = DatePicker

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 }
  }
}

const searchBarLayout = {
  xs: { span: 15 },
  sm: { span: 7 },
  md: { span: 7 },
  lg: { span: 6 }
}

const Filter = ({
  onFilterChange,
  form: {
    getFieldDecorator,
    getFieldsValue
  }
}) => {
  const handleSubmit = () => {
    let field = getFieldsValue()
    if (field.counterName === undefined || field.counterName === '') delete field.counterName
    console.log('field', field)
    if (field.date && field.date[0]) {
      const from = field.date[0].format('YYYY-MM-DD')
      const to = field.date[1].format('YYYY-MM-DD')
      field.from = from
      field.to = to
    } else {
      field.from = undefined
      field.to = undefined
    }
    onFilterChange(field)
  }

  const handleChange = (value) => {
    let field = getFieldsValue()
    if (value && value[0]) {
      const from = value[0].format('YYYY-MM-DD')
      const to = value[1].format('YYYY-MM-DD')
      field.from = from
      field.to = to
    } else {
      field.from = undefined
      field.to = undefined
    }
    onFilterChange(field)
  }

  return (
    <Row>
      <Col xs={9} sm={17} md={17} lg={18}>
        <FormItem label="Trans Date" {...formItemLayout}>
          {getFieldDecorator('date', {
            rules: [
              { required: false }
            ]
          })(
            <RangePicker onChange={handleChange} size="large" format="DD-MMM-YYYY" />
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
