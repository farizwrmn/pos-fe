import { Button, DatePicker, Form } from 'antd'

const FormItem = Form.Item
const RangePicker = DatePicker.RangePicker

const Filter = ({
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue
  }
}) => {
  const handleSubmit = () => {
    validateFields((error) => {
      if (error) return error

      const data = {
        ...getFieldsValue()
      }

      console.log('data', data)
    })
  }

  return (
    <Form inline>
      <FormItem>
        {getFieldDecorator('rangeDate', {
          rules: [
            {
              required: true,
              message: 'Required!'
            }
          ]
        })(
          <RangePicker />
        )}
      </FormItem>
      <FormItem>
        <Button type="primary" onClick={handleSubmit}>Filter</Button>
      </FormItem>
    </Form>
  )
}

export default Form.create()(Filter)
