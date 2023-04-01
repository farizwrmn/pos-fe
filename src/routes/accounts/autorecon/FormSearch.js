import React from 'react'
import { Form, Input } from 'antd'

const FormItem = Form.Item

const FormSearch = ({
  searchQuery,
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
    })
    const fields = getFieldsValue()
    searchQuery(fields)
  }

  return (
    <Form>
      <FormItem label="Search" hasFeedback>
        {getFieldDecorator('q')(
          <Input placeholder="Cari Faktur Penjualan" onPressEnter={handleSubmit} />
        )}
      </FormItem>
    </Form>
  )
}

export default Form.create()(FormSearch)
