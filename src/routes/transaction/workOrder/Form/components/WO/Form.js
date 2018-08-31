import React from 'react'
import { Form, Button, DatePicker, Select, Checkbox } from 'antd'

const FormItem = Form.Item
const Option = Select.Option

const formItemLayout = {
  labelCol: {
    xs: { span: 7 },
    sm: { span: 6 },
    md: { span: 6 },
    lg: { span: 7 }
  },
  wrapperCol: {
    xs: { span: 17 },
    sm: { span: 14 },
    md: { span: 14 },
    lg: { span: 14 }
  }
}

const FormWO = ({
  form: {
    getFieldDecorator
  }
}) => {
  return (
    <Form layout="horizontal">
      <FormItem label="Customer" hasFeedback {...formItemLayout}>
        {getFieldDecorator('memberId', {
          rules: [{ required: true }]
        })(<Select
          allowClear
          optionFilterProp="children"
          filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
        >
          <Option key={1}>hello</Option>
        </Select>)}
      </FormItem>
      <FormItem label="Asset" hasFeedback {...formItemLayout}>
        {getFieldDecorator('policeNoId', {
          rules: [{ required: true }]
        })(<Select
          allowClear
          optionFilterProp="children"
          filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
        >
          <Option key={1}>hello123</Option>
        </Select>)}
      </FormItem>
      <FormItem label="Time In" hasFeedback {...formItemLayout}>
        {getFieldDecorator('timeIn')(
          <DatePicker />)}
      </FormItem>
      <FormItem label="Take Away" {...formItemLayout}>
        {getFieldDecorator('takeAway')(<Checkbox />)}
      </FormItem>
    </Form>
  )
}

export default Form.create()(FormWO)
