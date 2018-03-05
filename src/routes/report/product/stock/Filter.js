import React from 'react'
import PropTypes from 'prop-types'
import { Form, Row, Col, Input } from 'antd'

const Search = Input.Search

const ColProps = {
  xs: 24,
  sm: 12,
  style: {
    marginBottom: 16
  }
}

const Filter = ({
  onFilterChange,
  form: {
    getFieldDecorator,
    getFieldsValue
  }
}) => {
  const handleSubmit = () => {
    let fields = getFieldsValue()
    onFilterChange(fields)
  }

  return (
    <Row gutter={24}>
      <Col {...ColProps} xl={{ span: 4 }} md={{ span: 8 }}>
        {getFieldDecorator('searchName')(<Search placeholder="Search Name" size="large" onSearch={handleSubmit} />)}
      </Col>
    </Row>
  )
}

Filter.propTypes = {
  form: PropTypes.object,
  onFilterChange: PropTypes.func
}

export default Form.create()(Filter)
