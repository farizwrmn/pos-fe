import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Button, Row, Col } from 'antd'

const FormItem = Form.Item

const FormCounter = ({
  onSubmit,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    resetFields
  }
}) => {
  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(getFieldsValue())
    resetFields()
    validateFields((err, values) => {
      if (!err) {
        console.log('Form values:', values)
        // Dispatch/save logic here
      }
    })
  }


  return (
    <Form layout="vertical" onSubmit={handleSubmit} style={{ marginTop: 24 }}>
      <Row gutter={16}>
        <Col span={12}>
          <FormItem label="Supplier Name">
            {getFieldDecorator('supplierName', {
              rules: [{ required: true, message: 'Please input supplier name' }]
            })(<Input placeholder="Supplier Name" />)}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem label="Payment Tempo">
            {getFieldDecorator('paymentTempo')(<Input placeholder="e.g., 30 days" />)}
          </FormItem>
        </Col>

        <Col span={24}>
          <FormItem label="Address 1">
            {getFieldDecorator('address1')(<Input placeholder="Address Line 1" />)}
          </FormItem>
        </Col>
        <Col span={24}>
          <FormItem label="Address 2">
            {getFieldDecorator('address2')(<Input placeholder="Address Line 2" />)}
          </FormItem>
        </Col>

        <Col span={8}>
          <FormItem label="City">
            {getFieldDecorator('city')(<Input placeholder="City" />)}
          </FormItem>
        </Col>
        <Col span={8}>
          <FormItem label="Province">
            {getFieldDecorator('province')(<Input placeholder="Province" />)}
          </FormItem>
        </Col>
        <Col span={8}>
          <FormItem label="Post Code">
            {getFieldDecorator('postCode')(<Input placeholder="Post Code" />)}
          </FormItem>
        </Col>

        <Col span={12}>
          <FormItem label="Tax ID">
            {getFieldDecorator('taxId')(<Input placeholder="Tax Identification Number" />)}
          </FormItem>
        </Col>
        <Col span={6}>
          <FormItem label="Phone">
            {getFieldDecorator('phone')(<Input placeholder="Phone Number" />)}
          </FormItem>
        </Col>
        <Col span={6}>
          <FormItem label="Mobile Phone">
            {getFieldDecorator('mobilePhone')(<Input placeholder="Mobile Number" />)}
          </FormItem>
        </Col>
      </Row>

      <FormItem style={{ textAlign: 'right' }}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </FormItem>
    </Form>

  )
}

FormCounter.propTypes = {
  form: PropTypes.object.isRequired,
  onSubmit: PropTypes.func
}

export default Form.create()(FormCounter)
