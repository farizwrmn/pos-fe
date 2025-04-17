import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Button, Row, Col, InputNumber } from 'antd'

const FormItem = Form.Item

const FormCounter = ({
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    resetFields
  },
  dispatch
}) => {
  const handleSubmit = () => {
    validateFields(async (err) => {
      if (!err) {
        const result = await dispatch({
          type: 'supplierPrice/submitSupplierPrice',
          payload: getFieldsValue()
        })

        if (result && result.success) {
          resetFields()
        }
      }
    })
  }


  return (
    <Form layout="vertical" style={{ marginTop: 24 }}>
      <Row gutter={16}>
        <Col span={8}>
          <FormItem label="Supplier ID">
            {getFieldDecorator('supplierId', {
              rules: [{ required: true, message: 'Please input Supplier ID' }]
            })(<Input placeholder="Supplier ID" />)}
          </FormItem>
        </Col>
        <Col span={8}>
          <FormItem label="Product ID">
            {getFieldDecorator('productId', {
              rules: [{ required: true, message: 'Please input Product ID' }]
            })(<Input placeholder="Product ID" />)}
          </FormItem>
        </Col>
        <Col span={8}>
          <FormItem label="Store ID">
            {getFieldDecorator('storeId', {
              rules: [{ required: true, message: 'Please input Store ID' }]
            })(<Input placeholder="Store ID" />)}
          </FormItem>
        </Col>

        <Col span={8}>
          <FormItem label="Price">
            {getFieldDecorator('price', {
              rules: [{ required: true, message: 'Please input Price' }]
            })(<InputNumber style={{ width: '100%' }} min={0} placeholder="0.00" />)}
          </FormItem>
        </Col>

        <Col span={4}>
          <FormItem label="Disc 1 (%)">
            {getFieldDecorator('disc1')(<InputNumber style={{ width: '100%' }} min={0} max={100} placeholder="0" />)}
          </FormItem>
        </Col>
        <Col span={4}>
          <FormItem label="Disc 2 (%)">
            {getFieldDecorator('disc2')(<InputNumber style={{ width: '100%' }} min={0} max={100} placeholder="0" />)}
          </FormItem>
        </Col>
        <Col span={4}>
          <FormItem label="Disc 3 (%)">
            {getFieldDecorator('disc3')(<InputNumber style={{ width: '100%' }} min={0} max={100} placeholder="0" />)}
          </FormItem>
        </Col>
        <Col span={4}>
          <FormItem label="Disc 4 (%)">
            {getFieldDecorator('disc4')(<InputNumber style={{ width: '100%' }} min={0} max={100} placeholder="0" />)}
          </FormItem>
        </Col>
      </Row>

      <FormItem style={{ textAlign: 'right' }}>
        <Button type="primary" onClick={handleSubmit}>
          Submit
        </Button>
      </FormItem>
    </Form>


  )
}

FormCounter.propTypes = {
  form: PropTypes.object.isRequired
  // onSubmit: PropTypes.func
}

export default Form.create()(FormCounter)
