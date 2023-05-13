import { Form, Input } from 'antd'

const FormItem = Form.Item

const Filter = ({
  q,
  handleSearch,
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
      handleSearch(fields.q)
    })
  }

  return (
    <Form layout="inline">
      <FormItem label="Search">
        {getFieldDecorator('q', {
          initialValue: q
        })(
          <Input onPressEnter={handleSubmit} />
        )}
      </FormItem>
    </Form>
  )
}

export default Form.create()(Filter)
