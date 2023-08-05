import { Button, Col, Form, Input } from 'antd'

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
    xs: 12,
    sm: 12,
    md: 6,
    lg: 6,
    xl: 3
  }
}

const tailFormItemLayout = {
  wrapperCol: {
    span: 24,
    xs: {
      offset: 19
    },
    sm: {
      offset: 19
    },
    md: {
      offset: 9
    },
    lg: {
      offset: 9
    },
    xl: {
      offset: 4
    }
  }
}

const BalanceCurrentForm = ({
  form: {
    getFieldDecorator
  }
}) => {
  return (
    <Col span={24}>
      <Form layout="horizontal">
        <FormItem label="Shift" {...formItemLayout} hasFeedback>
          {getFieldDecorator('Shift', {
            rules: [
              {
                required: true,
                message: 'Required'
              }
            ]
          })(
            <Input />
          )}
        </FormItem>
        <FormItem label="Memo" {...formItemLayout} hasFeedback>
          {getFieldDecorator('memo')(
            <Input />
          )}
        </FormItem>
        <FormItem {...tailFormItemLayout}>
          <Button type="primary">Open</Button>
        </FormItem>
      </Form>
    </Col>
  )
}

export default Form.create()(BalanceCurrentForm)
