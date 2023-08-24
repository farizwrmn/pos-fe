import { Form, Input } from 'antd'

const FormItem = Form.Item

const formItemProps = {
  labelCol: {
    xs: 12,
    sm: 12,
    md: 8,
    lg: 8,
    xl: 6
  },
  wrapperCol: {
    xs: 12,
    sm: 12,
    md: 16,
    lg: 16,
    xl: 18
  }
}

const Filter = ({
  location,
  onSearch,
  form: {
    getFieldDecorator,
    getFieldsValue,
    validateFields
  }
}) => {
  const handleSearch = () => {
    validateFields((error) => {
      if (error) return

      const data = {
        ...getFieldsValue()
      }

      onSearch(data.q)
    })
  }

  return (
    <Form layout="horizontal" style={{ minWidth: '400px' }}>
      <FormItem label="Search" {...formItemProps}>
        {getFieldDecorator('q', {
          initialValue: (location && location.query && location.query.q) ? location.query.q : undefined
        })(
          <Input onPressEnter={handleSearch} />
        )}
      </FormItem>
    </Form>
  )
}

export default Form.create()(Filter)
