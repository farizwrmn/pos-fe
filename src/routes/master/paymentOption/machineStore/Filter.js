import { Form, Input } from 'antd'

const FormItem = Form.Item

const formItemLayout = {
  labelCol: {
    span: 6
  },
  wrapperCol: {
    span: 18
  }
}

const Filter = ({
  location,
  onSubmit,
  form: {
    getFieldDecorator,
    getFieldsValue,
    validateFields
  }
}) => {
  const handleSubmit = () => {
    validateFields((error) => {
      if (error) {
        return error
      }
      const fields = getFieldsValue()
      onSubmit(fields.q)
    })
  }

  return (
    <Form layout="horizontal">
      <FormItem label="Search" {...formItemLayout}>
        {getFieldDecorator('q', {
          initialValue: location && location.query && (location.query.q || undefined)
        })(
          <Input placeholder="Cari nama" onPressEnter={handleSubmit} style={{ width: '100%' }} />
        )}
      </FormItem>
    </Form>
  )
}

export default Form.create()(Filter)
