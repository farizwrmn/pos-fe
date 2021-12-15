import React, { Component } from 'react'
import { Modal, Button, Input, Form } from 'antd'

const { TextArea } = Input
const FormItem = Form.Item

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 14 }
}

class ModalCancel extends Component {
  render () {
    const {
      form: { getFieldDecorator, validateFields, getFieldsValue, resetFields },
      onOk,
      onCancel,
      item,
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
        data.id = item.id
        Modal.confirm({
          title: 'Delete this item',
          content: 'This action cannot be undone. Are you sure ?',
          onOk () {
            onOk(data, resetFields)
          }
        })
        // handleProductBrowse()
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
          <Button size="large" key="submit" type="primary" onClick={handleOk}>
            Ok
          </Button>
        ]}
      >
        <Form layout="horizontal">
          <FormItem label="Memo" {...formItemLayout}>
            {getFieldDecorator('memo', {
              rules: [
                {
                  required: true,
                  pattern: /^[a-z0-9/\n _-]{20,255}$/i,
                  message: 'At least 20 character'
                }
              ]
            })(<TextArea maxLength={255} autosize={{ minRows: 2, maxRows: 6 }} />)}
          </FormItem>
        </Form>
      </Modal>
    )
  }
}

export default Form.create()(ModalCancel)
