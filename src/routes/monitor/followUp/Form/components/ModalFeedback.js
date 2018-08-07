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


const ModalFeedback = ({
  ...modalProps,
  currentFeedback,
  submitFeedbackItem,
  form: {
    getFieldDecorator,
    getFieldsValue
  }
}) => {
  const submitFeedback = () => {
    let data = getFieldsValue()
    let feedbackDetail = {}
    if (data.posDetailId !== currentFeedback.item) return false
    data.posDetailId = currentFeedback.id
    feedbackDetail = { posDetailId: data.posDetailId, customerSatisfaction: data.customerSatisfaction }
    submitFeedbackItem(feedbackDetail)
  }

  return (
    <Modal {...modalProps}
      onOk={submitFeedback}
    >
      <Form>
        <FormItem label="Item" {...formItemLayout}>
          {getFieldDecorator('posDetailId', {
            initialValue: currentFeedback.item
          })(<Input disabled />)}
        </FormItem>
        <FormItem label="Feedback" hasFeedback {...formItemLayout}>
          {getFieldDecorator('customerSatisfaction', { initialValue: currentFeedback.customerSatisfaction })(<TextArea rows={3} />)}
        </FormItem>
      </Form>
    </Modal>
  )
}

export default Form.create()(ModalFeedback)
