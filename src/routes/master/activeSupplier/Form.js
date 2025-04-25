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
  listCity,
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
      if (data.id) {
        Modal.confirm({
          title: 'Do you want to save this item?',
          onOk () {
            onSubmit(data.id, data)
            // setTimeout(() => {
            resetFields()
            // }, 500)
          },
          onCancel () { }
        })
      } else {
        message.warning("Supplier Code can't be null")
      }
    })
  }

  const cities = listCity.length > 0 ? listCity.map(c => <Option value={c.id} key={c.id}>{c.cityName}</Option>) : []

  return (
    <Form layout="vertical" style={{ marginTop: 24 }}>
      <Row gutter={16}>
        <Col span={6}>
          <FormItem label="ID" hasFeedback >
            {getFieldDecorator('id', {
              initialValue: item.id,
              rules: [{ required: true, message: 'Please input supplier id' }]
            })(<Input placeholder="Supplier ID" />)}
          </FormItem>
        </Col>

        <Col span={6}>
          <FormItem label="Payment Tempo" hasFeedback >
            {getFieldDecorator('paymentTempo', {
              initialValue: item.paymentTempo
            })(<Input placeholder="e.g., 30 days" />)}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem label="Supplier Name" hasFeedback >
            {getFieldDecorator('supplierName', {
              initialValue: item.supplierName,
              rules: [{ required: true, message: 'Please input supplier name' }]
            })(<Input placeholder="Supplier Name" />)}
          </FormItem>
        </Col>

        <Col span={24}>
          <FormItem label="Address 1" hasFeedback >
            {getFieldDecorator('address1', {
              initialValue: item.address1
            })(<Input placeholder="Address Line 1" />)}
          </FormItem>
        </Col>
        <Col span={24}>
          <FormItem label="Address 2" hasFeedback >
            {getFieldDecorator('address2', {
              initialValue: item.address2
            })(<Input placeholder="Address Line 2" />)}
          </FormItem>
        </Col>

        <Col span={8}>
          <FormItem label="City" hasFeedback >
            {getFieldDecorator('city', {
              initialValue: item.city
            })(<Input placeholder="City" />)}
          </FormItem>
        </Col>
        <Col span={8}>
          <FormItem label="Province" hasFeedback >
            {getFieldDecorator('province', {
              initialValue: item.province
            })(<Input placeholder="Province" />)}
          </FormItem>
        </Col>
        <Col span={8}>
          <FormItem label="Post Code" hasFeedback >
            {getFieldDecorator('postCode', {
              initialValue: item.postCode
            })(<Input placeholder="Post Code" />)}
          </FormItem>
        </Col>

        <Col span={12}>
          <FormItem label="Tax ID" hasFeedback >
            {getFieldDecorator('taxId', {
              initialValue: item.taxId
            })(<Input placeholder="Tax Identification Number" />)}
          </FormItem>
        </Col>
        <Col span={6}>
          <FormItem label="Phone" hasFeedback >
            {getFieldDecorator('phone', {
              initialValue: item.phone
            })(<Input placeholder="Phone Number" />)}
          </FormItem>
        </Col>
        <Col span={6}>
          <FormItem label="Mobile Phone" hasFeedback >
            {getFieldDecorator('mobilePhone', {
              initialValue: item.mobilePhone
            })(<Input placeholder="Mobile Number" />)}
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
  listCity: PropTypes.object,
  disabled: PropTypes.string,
  item: PropTypes.object,
  onSubmit: PropTypes.func,
  button: PropTypes.string
}

export default Form.create()(FormCounter)
