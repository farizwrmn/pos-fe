import React from 'react'
import {
  Form
} from 'antd'
import FormItemFingerprint from 'components/Form/FormItemFingerprint'

const Fingerprint = ({
  form: {
    getFieldDecorator
  },
  formItemLayout,
  item,
  registerFingerprint
}) => {
  return (
    <div>
      <FormItemFingerprint
        FormItemFingerprint
        getFieldDecorator={getFieldDecorator}
        formItemLayout={formItemLayout}
        registerFingerprint={registerFingerprint}
        validationType="hris"
        item={item}
      />
    </div>
  )
}

export default Form.create()(Fingerprint)
