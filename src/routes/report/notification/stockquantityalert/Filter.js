import React from 'react'
import PropTypes from 'prop-types'
import { Form, Row, Col, Input, Button, Icon } from 'antd'
import PrintPDF from './PrintPDF'
import PrintXLS from './PrintXLS'

const Search = Input.Search

const Filter = ({
  ...printProps,
  onSearchProduct,
  onResetClick,
  form: {
    getFieldDecorator,
    getFieldsValue,
    resetFields
  }
}) => {
  const handleReset = () => {
    resetFields()
    onResetClick()
  }

  const searchProps = {
    placeholder: 'Search Name',
    size: 'large',
    onSearch () {
      let fields = getFieldsValue()
      onSearchProduct(fields)
    }
  }

  return (
    <Row>
      <Col lg={10} md={24}>
        {getFieldDecorator('productName')(<Search {...searchProps} />)}
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
  form: PropTypes.object
}

export default Form.create()(Filter)
