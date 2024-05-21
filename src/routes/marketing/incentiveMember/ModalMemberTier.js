import React from 'react'
import { Modal, Form, InputNumber } from 'antd'

const FormItem = Form.Item

const formItemLayout = {
  labelCol: {
    xs: { span: 8 },
    sm: { span: 8 },
    md: { span: 7 }
  },
  wrapperCol: {
    xs: { span: 16 },
    sm: { span: 14 },
    md: { span: 14 }
  }
}

const ModalMemberTier = ({
  item,
  form: {
    getFieldDecorator,
    getFieldsValue,
    validateFields,
    resetFields
  },
  ...modalProps
}) => {
  const handleSubmit = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue()
      }
      Modal.confirm({
        title: 'Do you want to save this item?',
        onOk () {
          if (modalProps.modalType === 'add') {
            modalProps.onAdd(data, resetFields)
          } else {
            modalProps.onEdit(data, resetFields)
          }
        },
        onCancel () { }
      })
    })
  }

  return (
    <Modal
      {...modalProps}
      onOk={() => handleSubmit()}
    >
      <Form layout="horizontal">
        <FormItem label="Tier Number" hasFeedback {...formItemLayout}>
          {getFieldDecorator('tierNumber', {
            initialValue: item.tierNumber || 1,
            rules: [
              {
                required: true
              }
            ]
          })(<InputNumber min={1} max={999999999} style={{ width: '100%' }} />)}
        </FormItem>
        <FormItem label="Reward" hasFeedback {...formItemLayout}>
          {getFieldDecorator('tierReward', {
            initialValue: item.tierReward || 1,
            rules: [
              {
                required: true
              }
            ]
          })(<InputNumber min={1} max={999999999} style={{ width: '100%' }} />)}
        </FormItem>
        <FormItem label="Min New Member" hasFeedback {...formItemLayout}>
          {getFieldDecorator('minNewMember', {
            initialValue: item.minNewMember || 1,
            rules: [
              {
                required: true
              }
            ]
          })(<InputNumber min={1} max={999999999} style={{ width: '100%' }} />)}
        </FormItem>
        <FormItem label="Max New Member" hasFeedback {...formItemLayout}>
          {getFieldDecorator('maxNewMember', {
            initialValue: item.maxNewMember || 1,
            rules: [
              {
                required: true
              }
            ]
          })(<InputNumber min={1} max={999999999} style={{ width: '100%' }} />)}
        </FormItem>
      </Form>
    </Modal>
  )
}

export default Form.create()(ModalMemberTier)
