import React from 'react'
import PropTypes from 'prop-types'
import { Form, Button, DatePicker } from 'antd'

const FormItem = Form.Item

const FormCounter = ({
  loading,
  onSubmit,
  form: {
    getFieldDecorator,
    getFieldsValue,
    validateFields
  }
}) => {
  const handleSumbit = () => {
    validateFields((error) => {
      if (error) {
        return error
      }
      const periodDate = getFieldsValue().periodDate
      onSubmit(periodDate)
    })
  }

  return (
    <Form layout="inline" style={{ alignSelf: 'end', flex: 1 }}>
      <FormItem label="Close Period : ">
        {getFieldDecorator('periodDate', {
          initialValue: null,
          rules: [
            {
              required: true
            }
          ]
        })(
          <DatePicker placeholder="Pilih Tanggal" />
        )}
      </FormItem>
      <FormItem >
        <Button type="primary" onClick={() => { handleSumbit() }} loading={loading} >Submit</Button>
      </FormItem>
    </Form >
  )
}

FormCounter.propTypes = {
  form: PropTypes.object.isRequired
}

export default Form.create()(FormCounter)
