import React from 'react'
import { Form, Row, Col, Input, DatePicker, Button, Modal } from 'antd'
import moment from 'moment'

const FormItem = Form.Item
const { TextArea } = Input
const formItemLayout = {
  labelCol: {
    xs: { span: 7 },
    sm: { span: 4 },
    md: { span: 4 },
    lg: { span: 3 }
  },
  wrapperCol: {
    xs: { span: 12 },
    sm: { span: 10 },
    md: { span: 10 },
    lg: { span: 10 }
  }
}

const textAreaLayout = {
  labelCol: {
    xs: { span: 7 },
    sm: { span: 4 },
    md: { span: 4 },
    lg: { span: 3 }
  },
  wrapperCol: {
    xs: { span: 15 },
    sm: { span: 12 },
    md: { span: 12 },
    lg: { span: 12 }
  }
}

const leftColumn = {
  xs: 24,
  sm: 16,
  md: 16,
  lg: 16,
  style: {
    marginBottom: 10
  }
}

const tailFormItemLayout = {
  wrapperCol: {
    span: 24,
    xs: { offset: 18 },
    sm: { offset: 13 },
    md: { offset: 13 },
    lg: { offset: 13 }
  }
}

const FormRequest = ({
  item,
  submitRequest,
  form: {
    getFieldDecorator,
    getFieldsValue,
    validateFields
  }
}) => {
  const saveRequest = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue()
      }
      const request = {
        storeId: item.storeId,
        problemDesc: data.problemDesc,
        actionDesc: data.actionDesc
      }
      Modal.confirm({
        title: 'Do you want to save this item?',
        onOk () {
          submitRequest(item.id, request)
        },
        onCancel () { }
      })
    })
  }

  return (
    <Form layout="horizontal">
      <Row>
        <Col {...leftColumn}>
          <FormItem label="Trans No" hasFeedback {...formItemLayout}>
            {getFieldDecorator('transNo', {
              initialValue: item.transNo
            })(<Input disabled />)}
          </FormItem>
          <FormItem label="Trans Date" hasFeedback {...formItemLayout}>
            {getFieldDecorator('transDate', {
              initialValue: item.transDate ? moment(item.transDate) : null
            })(<DatePicker placeholder="" style={{ width: '100%' }} disabled />)}
          </FormItem>
          <FormItem help={item ? <div><span style={{ float: 'left', fontWeight: 'bold' }}>{item.shiftName}</span><span style={{ float: 'right', fontWeight: 'bold' }}>{item.counterName}</span></div> : ''} label="Cashier Id" hasFeedback {...formItemLayout}>
            {getFieldDecorator('cashierId', {
              initialValue: item.cashierId
            })(<Input disabled />)}
          </FormItem>
          <FormItem label="Open Period" hasFeedback {...formItemLayout}>
            {getFieldDecorator('period', {
              initialValue: item.period ? moment(item.period) : null
            })(<DatePicker style={{ width: '100%' }} disabled />)}
          </FormItem>
          <FormItem label="Problem" hasFeedback {...textAreaLayout}>
            {getFieldDecorator('problemDesc', {
              initialValue: item.problemDisc,
              rules: [
                { required: true }
              ]
            })(<TextArea rows={3} placeholder="input problem identification" />)}
          </FormItem>
          <FormItem label="Action" hasFeedback {...textAreaLayout}>
            {getFieldDecorator('actionDesc', {
              initialValue: item.actionDisc,
              rules: [
                { required: true }
              ]
            })(<TextArea rows={3} placeholder="input corrective action" />)}
          </FormItem>
          {!item.transNo &&
            <FormItem {...tailFormItemLayout}>
              <Button type="primary" onClick={() => saveRequest()}>Save</Button>
            </FormItem>
          }
        </Col>
      </Row>
    </Form>
  )
}

export default Form.create()(FormRequest)
