import { Form, Input } from 'antd'

const FormItem = Form.Item

const formItemColumnProps = {
  labelCol: {
    xs: {
      span: 6
    },
    sm: {
      span: 6
    },
    md: {
      span: 6
    },
    lg: {
      span: 6
    },
    xl: {
      span: 6
    }
  },
  wrapperCol: {
    xs: {
      span: 18
    },
    sm: {
      span: 18
    },
    md: {
      span: 18
    },
    lg: {
      span: 18
    },
    xl: {
      span: 18
    }
  }
}

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
    <Form layout="horizontal">
      <FormItem label="Search" {...formItemColumnProps}>
        {getFieldDecorator('q')(
          <Input placeholder="Cari merchant di sini" onPressEnter={handleSubmit} size="default" />
        )}
      </FormItem>
    </Form>
  )
}

export default Form.create()(FilterForm)
