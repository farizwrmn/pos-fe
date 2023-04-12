import { Form, Input } from 'antd'

const FormItem = Form.Item

const FilterForm = ({
  handleSearch,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue
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
    <Form layout="vertical">
      <FormItem>
        {getFieldDecorator('q')(
          <Input placeholder="Cari merchant di sini" onPressEnter={handleSubmit} size="default" />
        )}
      </FormItem>
    </Form>
  )
}

export default Form.create()(FilterForm)
