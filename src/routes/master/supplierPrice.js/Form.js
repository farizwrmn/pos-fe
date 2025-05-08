import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Button, Row, Col, message, Modal, InputNumber } from 'antd'

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
        <Col span={8}>
          <FormItem label="Supplier ID">
            {getFieldDecorator('supplierId', {
              initialValue: item.supplierId,
              rules: [{ required: true, message: 'Please input Supplier ID' }]
            })(<Input placeholder="Supplier ID" />)}
          </FormItem>
        </Col>
        <Col span={8}>
          <FormItem label="Product ID">
            {getFieldDecorator('productId', {
              initialValue: item.productId,
              rules: [{ required: true, message: 'Please input Product ID' }]
            })(<Input placeholder="Product ID" />)}
          </FormItem>
        </Col>
        <Col span={8}>
          <FormItem label="Store ID">
            {getFieldDecorator('storeId', {
              initialValue: item.storeId,
              rules: [{ required: true, message: 'Please input Store ID' }]
            })(<Input placeholder="Store ID" />)}
          </FormItem>
        </Col>

        <Col span={8}>
          <FormItem label="Price">
            {getFieldDecorator('price', {
              initialValue: item.price,
              rules: [{ required: true, message: 'Please input Price' }]
            })(<InputNumber style={{ width: '100%' }} min={0} placeholder="0.00" />)}
          </FormItem>
        </Col>

        <Col span={4}>
          <FormItem label="Disc 1 (%)">
            {getFieldDecorator('disc1', {
              initialValue: item.disc1
            })(<InputNumber style={{ width: '100%' }} min={0} max={100} placeholder="0" />)}
          </FormItem>
        </Col>
        <Col span={4}>
          <FormItem label="Disc 2 (%)">
            {getFieldDecorator('disc2', {
              initialValue: item.disc2
            })(<InputNumber style={{ width: '100%' }} min={0} max={100} placeholder="0" />)}
          </FormItem>
        </Col>
        <Col span={4}>
          <FormItem label="Disc 3 (%)">
            {getFieldDecorator('disc3', {
              initialValue: item.disc3
            })(<InputNumber style={{ width: '100%' }} min={0} max={100} placeholder="0" />)}
          </FormItem>
        </Col>
        <Col span={4}>
          <FormItem label="Disc 4 (%)">
            {getFieldDecorator('disc4', {
              initialValue: item.disc4
            })(<InputNumber style={{ width: '100%' }} min={0} max={100} placeholder="0" />)}
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
