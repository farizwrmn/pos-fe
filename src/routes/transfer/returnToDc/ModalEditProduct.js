import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button, Form, InputNumber, Input, Modal } from 'antd'

const FormItem = Form.Item

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 14 }
}

class ModalEditProduct extends Component {
  componentDidMount () {
    setTimeout(() => {
      const selector = document.getElementById('qty')
      if (selector) {
        selector.focus()
        selector.select()
      }
    }, 300)
  }
  render () {
    const {
      onOk,
      item = {},
      listProductProps,
      onDeleteItem,
      form: { getFieldDecorator, validateFields, getFieldsValue },
      ...modalProps
    } = this.props

    const handleOk = () => {
      validateFields((errors) => {
        if (errors) {
          return
        }
        const record = {
          ...getFieldsValue()
        }
        onOk(record)
      })
    }

    return (
      <Modal
        width={400}
        {...modalProps}
        title={`${item.productCode} - ${item.productName}`}
        footer={[
          <Button type="danger" onClick={() => onDeleteItem()}>Delete</Button>
        ]}
      >
        <Form>
          <FormItem label="Qty" {...formItemLayout}>
            {getFieldDecorator('qty', {
              initialValue: item.qty,
              rules: [
                {
                  required: true,
                  message: 'At least 1 character'
                }
              ]
            })(<InputNumber
              min={0}
              onKeyDown={
                (e) => {
                  if (e.keyCode === 13) {
                    handleOk()
                  }
                }
              }
            />)}
          </FormItem>
          <FormItem label="Description" {...formItemLayout}>
            {getFieldDecorator('description', {
              initialValue: item.description,
              rules: [
                {
                  required: false
                }
              ]
            })(<Input
              maxLength={200}
              onKeyDown={
                (e) => {
                  if (e.keyCode === 13) {
                    handleOk()
                  }
                }
              }
            />)}
          </FormItem>
        </Form>
      </Modal>
    )
  }
}

ModalEditProduct.propTypes = {
  form: PropTypes.object.isRequired,
  location: PropTypes.object,
  onOk: PropTypes.func,
  invoiceCancel: PropTypes.object
}

export default Form.create()(ModalEditProduct)
