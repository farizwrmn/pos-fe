/* eslint-disable no-plusplus */
/* eslint-disable jsx-a11y/label-has-for */
import React from 'react'
import PropTypes from 'prop-types'
import { Button, Modal, Form, Input, Row, Col, InputNumber, message } from 'antd'
import { lstorage } from 'utils'
import moment from 'moment'
import ListItem from './ListItem'

const FormItem = Form.Item

const formItemLayout = {
  labelCol: {
    xs: { span: 8 },
    sm: { span: 8 },
    md: { span: 7 }
  },
  wrapperCol: {
    xs: { span: 16 },
    sm: { span: 14 },
    md: { span: 14 }
  }
}

const column = {
  md: { span: 24 },
  lg: { span: 18 }
}

const FormCounter = ({
  item = {},
  listItemProps,
  onSubmit,
  loading,
  form: {
    getFieldDecorator,
    resetFields,
    validateFields,
    getFieldValue,
    getFieldsValue
  }
}) => {
  const handleSubmit = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...item,
        storeId: lstorage.getCurrentUserStore(),
        ...getFieldsValue()
      }
      const total = listItemProps.listItem.reduce((prev, next) => prev + next.total, 0)
      if (total !== data.invoiceTotal) {
        message.error('Invoice Total is not equal to Final Total')
        return
      }
      Modal.confirm({
        title: 'Do you want to save this item?',
        onOk () {
          onSubmit(data, resetFields)
        },
        onCancel () { }
      })
    })
  }

  return (
    <Form layout="horizontal">
      <Row>
        <Col {...column}>
          <FormItem label="No. Transaction" hasFeedback {...formItemLayout}>
            {getFieldDecorator('transNo', {
              initialValue: item.transNo,
              rules: [
                {
                  required: true
                }
              ]
            })(<Input disabled maxLength={60} />)}
          </FormItem>
          <FormItem label="Deadline Receive" {...formItemLayout}>
            {getFieldDecorator('expectedArrival', {
              initialValue: item.expectedArrival,
              rules: [{
                required: true,
                message: 'Required'
              }]
            })(<Input disabled />)}
          </FormItem>
          <FormItem label="Reference" hasFeedback {...formItemLayout}>
            {getFieldDecorator('reference', {
              rules: [{
                required: true,
                message: 'Required'
              }]
            })(<Input maxLength={30} />)}
          </FormItem>
          <FormItem label="Tempo" hasFeedback {...formItemLayout}>
            {getFieldDecorator('tempo', {
              initialValue: 30,
              rules: [{
                required: true,
                message: 'Required',
                pattern: /^\d+$/gi
              }]
            })(<InputNumber min={0} style={{ width: '100%' }} />)}
          </FormItem>
          <FormItem label="Due Date" hasFeedback {...formItemLayout}>
            {getFieldDecorator('dueDate', {
              initialValue: moment().add(getFieldValue('tempo'), 'days').format('YYYY-MM-DD')
            })(<Input disabled />)}
          </FormItem>
          <FormItem label="Invoice Total" {...formItemLayout}>
            {getFieldDecorator('invoiceTotal', {
              rules: [{
                required: true,
                message: 'Required'
              }]
            })(<InputNumber min={0} style={{ width: '100%' }} />)}
          </FormItem>
          <FormItem label="Delivery Fee" {...formItemLayout}>
            {getFieldDecorator('deliveryFee', {
              rules: [{
                required: true,
                message: 'Required'
              }]
            })(<InputNumber min={0} style={{ width: '100%' }} />)}
          </FormItem>
        </Col>
        <Col {...column} />
      </Row>
      <ListItem {...listItemProps} />
      <Button type="primary" onClick={handleSubmit} disabled={loading} style={{ float: 'right', marginTop: '10px' }}>Save</Button>
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
