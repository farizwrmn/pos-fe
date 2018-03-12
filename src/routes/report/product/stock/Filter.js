import React from 'react'
import PropTypes from 'prop-types'
import { Form, Row, Col, Input, Button, Icon } from 'antd'
import PrintPDF from './PrintPDF'
import PrintXLS from './PrintXLS'

const Search = Input.Search

const Filter = ({
  ...printProps,
  onFilterChange,
  form: {
    getFieldDecorator,
    getFieldsValue,
    resetFields
  }
}) => {
  const handleSubmit = () => {
    let fields = getFieldsValue()
    onFilterChange(fields)
  }

  const handleReset = () => {
    resetFields()
  }

  return (
    <Row>
      <Col lg={10} md={24}>
        {getFieldDecorator('searchName')(<Search placeholder="Search Name" size="large" onSearch={handleSubmit} />)}
      </Col>
      <Col lg={14} md={24} style={{ textAlign: 'right' }}>
        <Button type="dashed"
          size="large"
          className="button-width02 button-extra-large bgcolor-lightgrey"
          onClick={() => handleReset()}
        >
          <Icon type="rollback" className="icon-large" />
        </Button>
        <PrintPDF {...printProps} />
        <PrintXLS {...printProps} />
      </Col>
    </Row>
  )
}

Filter.propTypes = {
  form: PropTypes.object,
  onFilterChange: PropTypes.func
}

export default Form.create()(Filter)
