import { Form, Input } from 'antd'

const FormItem = Form.Item

const Filter = ({
  form: {
    getFieldDecorator
  }
}) => {
  return (
    <Form layout="inline">
      <FormItem label="Search">
        {getFieldDecorator('q')(
          <Input />
        )}
      </FormItem>
    </Form>
  )
}

export default Form.create()(Filter)
