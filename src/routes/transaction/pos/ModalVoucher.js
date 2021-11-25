import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, Button } from 'antd'

const FormItem = Form.Item

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 14 }
}

class ModalVoucher extends Component {
  componentDidMount () {
    setTimeout(() => {
      const selector = document.getElementById('code')
      if (selector) {
        selector.focus()
        selector.select()
      }
    }, 300)
  }
  render () {
    const {
      onOk,
      data,
      form: { getFieldDecorator, validateFields, getFieldsValue, resetFields },
      ...modalProps
    } = this.props
    const handleOk = () => {
      validateFields((errors) => {
        if (errors) return
        const record = {
          ...getFieldsValue()
        }
        onOk(record, resetFields)
      })
    }
    const modalOpts = {
      ...modalProps,
      onOk: handleOk
    }

    return (
      <Modal {...modalOpts}
        footer={[
          <Button key="submit" onClick={() => handleOk()} type="primary" >Process</Button>
        ]}
      >
        <Form>
          <FormItem label="Voucher Code (Scan)" {...formItemLayout}>
            {getFieldDecorator('code', {
              rules: [
                {
                  required: true,
                  pattern: /^[a-z0-9/\n _-]{5,100}$/i,
                  message: 'Required'
                }
              ]
            })(<Input
              onPressEnter={() => {
                handleOk()
              }}
              autoFocus
              maxLength={255}
            />)}
          </FormItem>
        </Form>
      </Modal>
    )
  }
}

ModalVoucher.propTypes = {
  form: PropTypes.object.isRequired,
  location: PropTypes.object,
  onOk: PropTypes.func,
  invoiceCancel: PropTypes.object
}

export default Form.create()(ModalVoucher)
