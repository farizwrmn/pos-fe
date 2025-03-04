import React, { Component } from 'react'
import { Modal, Form, Input } from 'antd'

const FormItem = Form.Item
const { TextArea } = Input

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 }
}

class ModalCustomerName extends Component {
  componentDidMount () {
    setTimeout(() => {
      const selector = document.getElementById('posDescription')
      if (selector) {
        selector.focus()
        selector.select()
      }
    }, 100)
  }

  render () {
    const {
      posDescription,
      onOk,
      form: {
        getFieldDecorator,
        getFieldsValue,
        validateFields
      },
      ...modalProps
    } = this.props

    const handleOk = () => {
      validateFields((errors) => {
        if (errors) {
          return
        }
        const item = {
          ...getFieldsValue()
        }
        onOk(item)
      })
    }

    return (
      <Modal {...modalProps} onOk={() => handleOk()}>
        <FormItem label="Label/Customer" hasFeedback {...formItemLayout}>
          {getFieldDecorator('posDescription', {
            initialValue: posDescription,
            rules: [
              {
                required: false
              }
            ]
          })(
            <TextArea
              maxLength={255}
            />
          )}
        </FormItem>
      </Modal>
    )
  }
}

export default Form.create()(ModalCustomerName)
