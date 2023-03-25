import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Modal, Input } from 'antd'

const FormItem = Form.Item

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 14 }
}

class ModalBookmark extends Component {
  componentDidMount () {
    setTimeout(() => {
      const selector = document.getElementById('shortcutCode')
      if (selector) {
        selector.focus()
        selector.select()
      }
    }, 300)
  }

  render () {
    const {
      item,
      onSubmit,
      form: { getFieldDecorator, validateFields, getFieldsValue },
      ...modalProps
    } = this.props

    const handleOk = () => {
      validateFields((errors) => {
        if (errors) return
        const record = {
          ...getFieldsValue()
        }
        Modal.confirm({
          title: `Applying ${record.shortcutCode}`,
          content: 'Are you sure ?',
          onOk () {
            record.id = item.id
            record.groupId = item.groupId
            record.productId = item.productId
            record.type = item.type
            onSubmit(record)
          }
        })
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
        footer={null}
      >
        <Form>
          <FormItem label="Shortcut Code" help="input 3 nomor shortcut yang tersedia" {...formItemLayout}>
            {getFieldDecorator('shortcutCode', {
              initialValue: item.shortcutCode,
              rules: [
                {
                  required: true,
                  message: 'Shortcut must be 3 characters',
                  pattern: /^[0-9]{3}$/
                }
              ]
            })(<Input maxLength={10} placeholder="Shortcut Code" onKeyDown={e => hdlClickKeyDown(e)} />)}
          </FormItem>
        </Form>
      </Modal>
    )
  }
}

ModalBookmark.propTypes = {
  form: PropTypes.object.isRequired,
  location: PropTypes.object,
  onOk: PropTypes.func,
  invoiceCancel: PropTypes.object
}

export default Form.create()(ModalBookmark)
