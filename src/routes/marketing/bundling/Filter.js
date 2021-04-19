import React from 'react'
import PropTypes from 'prop-types'
import { Form, Row, Col, Input } from 'antd'

const Search = Input.Search
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
  const handleSubmit = () => {
    let field = getFieldsValue()
    if (field.counterName === undefined || field.counterName === '') delete field.counterName
    onFilterChange(field)
  }

  return (
    <Row>
      <Col span={12} />
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
