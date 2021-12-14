import React, { Component } from 'react'
import { Modal, InputNumber, Form, Input, Button } from 'antd'

const FormItem = Form.Item
const { TextArea } = Input

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 14 }
}

class ModalCashRegister extends Component {
  componentDidMount () {
    setTimeout(() => {
      const selector = document.getElementById('expenseTotal')
      if (selector) {
        selector.focus()
        selector.select()
      }
    }, 300)
  }

  render () {
    const {
      form: {
        getFieldDecorator,
        validateFields,
        getFieldsValue,
        resetFields
      },
      onOk,
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
        onCancel={onCancel}
        footer={[
          <Button size="large" key="back" onClick={onCancel}>Cancel</Button>,
          <Button size="large" key="submit" type="primary" onClick={handleOk}>Ok</Button>
        ]}
      >
        <Form layout="horizontal">
          <FormItem label="Expense" hasFeedback {...formItemLayout}>
            {getFieldDecorator('expenseTotal', {
              initialValue: 0,
              rules: [{
                required: true
              }]
            })(
              <InputNumber
                style={{ width: '100%' }}
                value={0}
                min={0}
                autoFocus
                onKeyDown={(e) => {
                  if (e.keyCode === 13) {
                    handleOk()
                  }
                }}
              />
            )}
          </FormItem>

          <FormItem label="Description" hasFeedback {...formItemLayout}>
            {getFieldDecorator('description', {
              rules: [{
                required: true,
                pattern: /^[A-Za-z0-9-.,;:?() _/]{20,255}$/i,
                message: 'a-Z & 0-9, min: 20, max: 255'
              }]
            })(<TextArea maxLength={255} autosize={{ minRows: 2, maxRows: 6 }} />)}
          </FormItem>
        </Form>
      </Modal>
    )
  }
}

export default Form.create()(ModalCashRegister)
