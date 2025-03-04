import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, Button } from 'antd'

const FormItem = Form.Item

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 14 }
}

class ModalExpressCode extends Component {
  componentDidMount () {
    setTimeout(() => {
      const selector = document.getElementById('shortOrderNumber')
      if (selector) {
        selector.focus()
        selector.select()
      }
    }, 300)
  }

  render () {
    const {
      onSubmit,
      loading,
      form: { getFieldDecorator, validateFields, getFieldsValue, resetFields },
      ...modalProps
    } = this.props

    const handleOk = () => {
      validateFields((errors) => {
        if (errors) return
        const record = {
          ...getFieldsValue()
        }
        Modal.confirm({
          title: `Applying ${record.shortOrderNumber}`,
          content: 'Are you sure ?',
          onOk () {
            onSubmit(record)
          }
        })
        resetFields()
      })
    }
    const hdlClickKeyDown = (e) => {
      if (e.keyCode === 13) {
        handleOk()
      }
    }
    const modalOpts = {
      ...modalProps,
      onOk: handleOk
    }
    return (
      <Modal {...modalOpts}
        footer={[
          <Button key="submit" disabled={loading} onClick={() => handleOk()} type="primary" >Process</Button>
        ]}
      >
        <Form>
          <FormItem label="Invoice Code" help="input 3 nomor dari KX-123, contohnya: 123 atau 123F" {...formItemLayout}>
            {getFieldDecorator('shortOrderNumber', {
              rules: [
                {
                  required: true,
                  message: 'Required',
                  pattern: /^[A-Z0-9]+$/i
                }
              ]
            })(<Input maxLength={10} placeholder="123 or 123F" onKeyDown={e => hdlClickKeyDown(e)} />)}
          </FormItem>
        </Form>
      </Modal>
    )
  }
}

ModalExpressCode.propTypes = {
  form: PropTypes.object.isRequired,
  location: PropTypes.object,
  onOk: PropTypes.func,
  invoiceCancel: PropTypes.object
}

export default Form.create()(ModalExpressCode)
