import React from 'react'
import moment from 'moment'
import { Form, Modal, Input, DatePicker } from 'antd'

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


const ModalAcceptOffer = ({
  ...modalProps,
  onSubmitAcceptOffer,
  form: {
    getFieldDecorator,
    getFieldsValue,
    validateFields
  }
}) => {
  const submitAcceptOffering = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      let data = getFieldsValue()
      let acceptOfferingDate
      if (data.acceptOfferingDate) acceptOfferingDate = moment(data.acceptOfferingDate).format('YYYY-MM-DD')
      data = { acceptOfferingDate, acceptOfferingReason: data.acceptOfferingReason }
      onSubmitAcceptOffer(data)
    })
  }

  return (
    <Modal {...modalProps} onOk={submitAcceptOffering}>
      <Form>
        <FormItem label="Reason" {...formItemLayout}>
          {getFieldDecorator('acceptOfferingReason', {
            rules: [
              { required: true }
            ]
          })(<TextArea rows={3} />)}
        </FormItem>
        <FormItem label="Next Service" hasFeedback {...formItemLayout}>
          {getFieldDecorator('acceptOfferingDate')(<DatePicker format="DD-MMM-YYYY" />)}
        </FormItem>
      </Form>
      <p>* Keep customer reason to keep improve product quality</p>
    </Modal>
  )
}

export default Form.create()(ModalAcceptOffer)
