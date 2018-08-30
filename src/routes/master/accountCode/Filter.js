import React from 'react'
import PropTypes from 'prop-types'
import { Form, Row, Col, Input } from 'antd'

const Search = Input.Search
const FormItem = Form.Item

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
    if (field.q === undefined || field.q === '') delete field.q
    onFilterChange(field)
  }

  return (
    <Row>
      <Col xs={9} sm={17} md={17} lg={18} />
      <Col {...searchBarLayout} >
        <FormItem >
          {getFieldDecorator('q')(
            <Search
              placeholder="Search Name"
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
