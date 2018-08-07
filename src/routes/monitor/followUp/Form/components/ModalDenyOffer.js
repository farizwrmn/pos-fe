import React from 'react'
import { Form, Modal, Input } from 'antd'

const FormItem = Form.Item
const { TextArea } = Input

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 10 },
    md: { span: 7 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
    md: { span: 14 }
  }
}


const ModalDenyOffer = ({
  ...modalProps,
  onSubmitDenyOffer,
  form: {
    getFieldDecorator,
    getFieldsValue,
    validateFields
  }
}) => {
  const submitDenyOffering = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      let data = getFieldsValue()
      data = { denyOfferingReason: data.denyOfferingReason }
      onSubmitDenyOffer(data)
    })
  }

  return (
    <Modal {...modalProps} onOk={submitDenyOffering}>
      <Form>
        <FormItem label="Reason" {...formItemLayout}>
          {getFieldDecorator('denyOfferingReason', {
            rules: [
              { required: true }
            ]
          })(<TextArea rows={3} />)}
        </FormItem>
      </Form>
      <p>* Keep customer reason to keep improve product quality</p>
    </Modal>
  )
}

export default Form.create()(ModalDenyOffer)
