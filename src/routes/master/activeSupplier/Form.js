import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Button, Row, Col, message, Modal } from 'antd'

const FormItem = Form.Item

const FormCounter = ({
  item = {},
  onSubmit,
  onCancel,
  modalType,
  button,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    resetFields
  }
}) => {
  const handleCancel = () => {
    onCancel()
    resetFields()
  }
  const handleSubmit = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue()
      }
      console.log("🚀 ~ validateFields ~ data:", data)
      if (data.supplierId) {
        Modal.confirm({
          title: 'Do you want to save this item?',
          onOk () {
            onSubmit(data.supplierId, data)
            // setTimeout(() => {
            resetFields()
            // }, 500)
          },
          onCancel () { }
        })
      } else {
        message.warning("Supplier ID can't be null")
      }
    })
  }

  return (
    <Form layout="vertical" style={{ marginTop: 24 }}>
      <Row gutter={16}>
        <Col span={12}>
          <FormItem label="Supplier ID" hasFeedback>
            {getFieldDecorator('supplierId', {
              initialValue: item.supplierId,
              rules: [{ required: true, message: 'Please input supplier ID' }]
            })(<Input placeholder="Supplier ID" />)}
          </FormItem>
        </Col>

        <Col span={12}>
          <FormItem label="Product ID" hasFeedback>
            {getFieldDecorator('productId', {
              initialValue: item.productId,
              rules: [{ required: true, message: 'Please input product ID' }]
            })(<Input placeholder="Product ID" />)}
          </FormItem>
        </Col>

        <Col span={12}>
          <FormItem label="Store ID" hasFeedback>
            {getFieldDecorator('storeId', {
              initialValue: item.storeId,
              rules: [{ required: true, message: 'Please input product ID' }]
            })(<Input placeholder="Store ID" />)}
          </FormItem>
        </Col>
      </Row>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 24 }}>
        <FormItem style={{ marginBottom: 0 }}>
          {modalType === 'edit' && (
            <Button type="danger" style={{ marginRight: 8 }} onClick={handleCancel}>
              Cancel
            </Button>
          )}
          <Button type="primary" onClick={handleSubmit}>
            {button}
          </Button>
        </FormItem>
      </div>
    </Form>
  )
}

FormCounter.propTypes = {
  form: PropTypes.object.isRequired,
  item: PropTypes.object,
  onSubmit: PropTypes.func,
  button: PropTypes.string
}

export default Form.create()(FormCounter)
