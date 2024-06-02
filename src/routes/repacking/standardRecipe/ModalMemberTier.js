import React, { Component } from 'react'
import { Modal, Form, Input, InputNumber } from 'antd'

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

class ModalMemberTier extends Component {
  componentDidMount () {
    setTimeout(() => {
      const selector = document.getElementById('productCode')
      if (selector) {
        selector.focus()
        selector.select()
      }
    }, 100)
  }

  render () {
    const {
      item,
      form: {
        getFieldDecorator,
        getFieldsValue,
        validateFields,
        resetFields
      },
      ...modalProps
    } = this.props

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
          <FormItem label="Product Code" hasFeedback {...formItemLayout}>
            {getFieldDecorator('productCode', {
              initialValue: item.productCode,
              rules: [
                {
                  required: true,
                  message: 'a-Z & 0-9'
                }
              ]
            })(<Input maxLength={30} autoFocus />)}
          </FormItem>
          <FormItem label="Qty" hasFeedback {...formItemLayout}>
            {getFieldDecorator('qty', {
              initialValue: item.qty || 1,
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
}

export default Form.create()(ModalMemberTier)
