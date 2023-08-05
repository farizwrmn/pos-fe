import { Col, Form, Input } from 'antd'

const FormItem = Form.Item
const formItemLayout = {
  labelCol: {
    xs: 8,
    sm: 8,
    md: 4,
    lg: 4,
    xl: 2
  },
  wrapperCol: {
    xs: 16,
    sm: 16,
    md: 8,
    lg: 8,
    xl: 4
  }
}

const FormClosing = ({
  form: {
    getFieldDecorator
  }
}) => {
  return (
    <Col span={24}>
      <Form layout="horizontal">
        <FormItem label="name" hasFeedback {...formItemLayout}>
          {getFieldDecorator('name')(
            <Input />
          )}
        </FormItem>
      </Form>
    </Col>
  )
}

export default Form.create()(FormClosing)
