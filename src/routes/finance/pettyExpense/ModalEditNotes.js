import React, { Component } from 'react'
import { Modal, Form, Input, InputNumber, Button } from 'antd'
import { lstorage } from 'utils'

const FormItem = Form.Item
const { TextArea } = Input

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 14 }
}

class ModalCashRegister extends Component {
  componentDidMount () {
    setTimeout(() => {
      const selector = document.getElementById('description')
      if (selector) {
        selector.focus()
        selector.select()
      }
    }, 300)
  }

  render () {
    const {
      loading,
      form: {
        getFieldDecorator,
        validateFields,
        getFieldsValue,
        resetFields
      },
      onOk,
      item,
      onCancel,
      ...modalProps
    } = this.props

    const handleOk = () => {
      validateFields((errors) => {
        if (errors) {
          return
        }

        const data = {
          ...getFieldsValue()
        }
        data.storeId = lstorage.getCurrentUserStore()
        data.id = item.id
        onOk(data, resetFields)
      })
    }

    const modalOpts = {
      ...modalProps,
      onOk: handleOk
    }

    return (
      <Modal
        {...modalOpts}
        title="Add More Cash/Discount"
        onCancel={onCancel}
        footer={[
          <Button disabled={loading} size="large" key="back" onClick={onCancel}>Cancel</Button>,
          <Button disabled={loading} size="large" key="submit" type="primary" onClick={handleOk}>Ok</Button>
        ]}
      >
        <Form layout="horizontal">
          <FormItem label="Expense" hasFeedback {...formItemLayout}>
            {getFieldDecorator('expenseTotal', {
              initialValue: item.expenseTotal,
              rules: [{
                required: true
              }]
            })(<InputNumber min={0} autoFocus style={{ width: 285 }} />)}
          </FormItem>
          <FormItem label="Discount" hasFeedback {...formItemLayout}>
            {getFieldDecorator('discount', {
              initialValue: item.discount,
              rules: [{
                required: true
              }]
            })(<InputNumber min={0} autoFocus style={{ width: 285 }} />)}
          </FormItem>
          <FormItem label="Reference" hasFeedback {...formItemLayout}>
            {getFieldDecorator('reference', {
              initialValue: item.reference,
              rules: [{
                required: true,
                pattern: /^[A-Za-z0-9-.,;:?()@= _/]{5,40}$/i,
                message: 'a-Z & 0-9, min: 5, max: 40'
              }]
            })(<Input maxLength={40} autoFocus />)}
          </FormItem>
          <FormItem label="Description" hasFeedback {...formItemLayout}>
            {getFieldDecorator('description', {
              initialValue: item.description,
              rules: [{
                required: true,
                pattern: /^[A-Za-z0-9-.,;:?()@= _/]{20,99999}$/i,
                message: 'a-Z & 0-9, min: 20, max: 99999'
              }]
            })(<TextArea maxLength={99999} autosize={{ minRows: 2, maxRows: 6 }} />)}
          </FormItem>
        </Form>
      </Modal>
    )
  }
}

export default Form.create()(ModalCashRegister)
