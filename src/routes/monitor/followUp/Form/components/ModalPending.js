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


const ModalPending = ({
  ...modalProps,
  onSubmitPending,
  form: {
    getFieldDecorator,
    getFieldsValue,
    validateFields
  }
}) => {
  const submitPending = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      let data = getFieldsValue()
      let nextCall
      if (data.nextCall) nextCall = moment(data.nextCall).format('YYYY-MM-DD')
      data = { nextCall, pendingReason: data.pendingReason }
      onSubmitPending(data)
    })
  }

  return (
    <Modal {...modalProps} onOk={submitPending}>
      <Form>
        <FormItem label="Reason" {...formItemLayout}>
          {getFieldDecorator('pendingReason', {
            rules: [
              { required: true }
            ]
          })(<TextArea rows={3} />)}
        </FormItem>
        <FormItem label="Next Call" hasFeedback {...formItemLayout}>
          {getFieldDecorator('nextCall')(<DatePicker format="DD-MMM-YYYY" />)}
        </FormItem>
      </Form>
      <p>* Pending for next call</p>
    </Modal>
  )
}

export default Form.create()(ModalPending)
