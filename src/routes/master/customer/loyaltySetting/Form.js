import React from 'react'
import PropTypes from 'prop-types'
import { Form, Button, Row, Col, Checkbox, InputNumber, DatePicker, Modal } from 'antd'
import moment from 'moment'

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
  sm: { span: 24 },
  md: { span: 24 },
  lg: { span: 12 },
  xl: { span: 12 }
}

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
    resetFields,
    getFieldValue,
    setFieldsValue
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
      if (modalType === 'edit') data.id = item.id
      Modal.confirm({
        title: 'Do you want to save this item?',
        onOk () {
          onSubmit(data)
          // setTimeout(() => {
          resetFields()
          // }, 500)
        },
        onCancel () { }
      })
    })
  }

  const disabledDate = (current) => {
    return current < moment(new Date()).add('-1', 'days')
  }

  const disabledDateStartFrom = (current) => {
    if (getFieldValue('startDate')) {
      return current < moment(getFieldValue('startDate'))
    }
    return true
  }

  const changeStartDate = () => {
    setFieldsValue({
      expirationDate: null
    })
  }

  return (
    <Form layout="horizontal">
      <h1>Point / Cashback</h1>
      <Row>
        <Col {...column}>
          <FormItem
            label="Active"
            {...formItemLayout}
          >
            {getFieldDecorator('active', {
              valuePropName: 'checked',
              initialValue: item.active === undefined ? true : item.active
            })(<Checkbox>Active</Checkbox>)}
          </FormItem>
          <FormItem
            label="Spending (%)"
            help="Percentage Cashback given by Sales Netto"
            hasFeedback
            {...formItemLayout}
          >
            {getFieldDecorator('setValue', {
              initialValue: item.setValue,
              rules: [
                {
                  required: true
                }
              ]
            })(<InputNumber min={0} max={100} autoFocus />)}
          </FormItem>
          <FormItem
            label="New Member"
            help="Cashback given for new customer"
            hasFeedback
            {...formItemLayout}
          >
            {getFieldDecorator('newMember', {
              initialValue: item.newMember,
              rules: [
                {
                  required: true
                }
              ]
            })(<InputNumber min={0} />)}
          </FormItem>
        </Col>
      </Row>
      <h1>Advanced</h1>
      <Row>
        <Col {...column}>
          <FormItem label="Start From" hasFeedback {...formItemLayout}>
            {getFieldDecorator('startDate', {
              initialValue: item.startDate ? moment(item.startDate) : null,
              rules: [
                {
                  required: true
                }
              ]
            })(<DatePicker onChange={changeStartDate} disabledDate={disabledDate} />)}
          </FormItem>
          <FormItem label="Expiration Date" hasFeedback {...formItemLayout}>
            {getFieldDecorator('expirationDate', {
              initialValue: item.expirationDate ? moment(item.expirationDate) : null,
              rules: [
                {
                  required: true
                }
              ]
            })(<DatePicker disabledDate={disabledDateStartFrom} />)}
          </FormItem>
        </Col>
      </Row>
      <h1>Reward</h1>
      <Row>
        <Col {...column}>
          <FormItem
            label="Minimum"
            help="Minimum payment to get cashback"
            hasFeedback
            {...formItemLayout}
          >
            {getFieldDecorator('minPayment', {
              initialValue: item.minPayment,
              rules: [
                {
                  required: true
                }
              ]
            })(<InputNumber placeholder="Payment" min={0} />)}
          </FormItem>
          <FormItem
            label="Maximum"
            help="Maximum Cashback use in 1 transaction"
            hasFeedback
            {...formItemLayout}
          >
            {getFieldDecorator('maxDiscount', {
              initialValue: item.maxDiscount,
              rules: [
                {
                  required: true
                }
              ]
            })(<InputNumber placeholder="Discount" min={0} />)}
          </FormItem>
        </Col>
      </Row>
      <Button style={{ float: 'right' }} type="primary" onClick={handleSubmit}>{button}</Button>
      {modalType === 'edit' && <Button type="danger" style={{ float: 'right', margin: '0 10px' }} onClick={handleCancel}>Cancel</Button>}
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
