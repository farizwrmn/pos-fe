import React, { Component } from 'react'
import { Modal, Form, Button, InputNumber } from 'antd'

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
      const selector = document.getElementById('minDisplay')
      if (selector) {
        selector.focus()
        selector.select()
      }
    }, 100)
  }

  render () {
    const {
      item,
      loading,
      form: {
        getFieldDecorator,
        getFieldsValue,
        validateFields,
        resetFields
      },
      onOk,
      ...modalProps
    } = this.props

    const handleSubmit = () => {
      validateFields((errors) => {
        if (errors) {
          return
        }
        const data = {
          id: item.id,
          ...getFieldsValue()
        }
        onOk(data, resetFields)
      })
    }

    return (
      <Modal
        {...modalProps}
        onOk={() => handleSubmit()}
        footer={[
          <Button disabled={loading} size="large" key="back" onClick={modalProps.onCancel}>Cancel</Button>,
          <Button disabled={loading} size="large" key="submit" type="primary" onClick={() => handleSubmit()}>Edit</Button>
        ]}
      >
        <Form layout="horizontal">
          <FormItem label="Min Display" hasFeedback {...formItemLayout}>
            {getFieldDecorator('minDisplay', {
              initialValue: item.minDisplay || 1,
              rules: [
                {
                  required: true
                }
              ]
            })(<InputNumber
              min={0}
              max={999999999}
              onKeyDown={(e) => {
                if (e.keyCode === 13) {
                  handleSubmit()
                }
              }}
              style={{ width: '100%' }}
            />)}
          </FormItem>
        </Form>
      </Modal>
    )
  }
}

export default Form.create()(ModalMemberTier)
