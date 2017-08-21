import React from 'react'
import PropTypes from 'prop-types'
import {Button, Input, Form, Select} from 'antd'

const FormItem = Form.Item

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 10 },
}

const PaymentList = ({ onChooseItem, item, form: { getFieldDecorator, validateFields, getFieldsValue }, ...modalPaymentProps }) => {
  const handleClick = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue(),
      }
      console.log('data paymentList:', data)
      onChooseItem(data)
    })
  }
  return (
    <Form>
      <FormItem {...formItemLayout} label="Record">
        {getFieldDecorator('Record', {
          initialValue: item.no,
          rules: [{
            required: true,
            message: 'Required',
          }],
        })(
          <Input disabled />
        )
        }
      </FormItem>
      <FormItem {...formItemLayout} label="Payment">
        {getFieldDecorator('Payment', {
          rules: [{
            required: true,
            message: 'Required',
          }],
        })(
          <Select defaultValue="lucy" style={{width: 120}}>
            <Option value="discount">Discount Nominal</Option>
            <Option value="disc1">Disc 1(%)</Option>
            <Option value="disc2">Disc 2(%)</Option>
            <Option value="disc3">Disc 3(%)</Option>
            <Option value="quantity">Quantity</Option>
          </Select>
        )
        }
      </FormItem>
      <FormItem {...formItemLayout} label="VALUE">
        {getFieldDecorator('VALUE', {
          rules: [{
            required: true,
            message: 'Required',
          }],
        })(
          <Input />
        )}
      </FormItem>
      <div>
        <Button onClick={handleClick}> Change </Button>
      </div>
    </Form>
  )
}

PaymentList.propTypes = {
  form: PropTypes.object.isRequired,
  pos: PropTypes.object,
  item: PropTypes.object,
  onChooseItem: PropTypes.func
}
export default Form.create()(PaymentList)
