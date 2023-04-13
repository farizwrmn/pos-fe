import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, Button } from 'antd'
import { formatBox, formatPack, formatDimension } from 'utils/dimension'

const FormItem = Form.Item

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 14 }
}

class ModalAddProduct extends Component {
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
      onCancel,
      onOk,
      form: { getFieldDecorator, validateFields, getFieldsValue, getFieldValue, resetFields },
      ...formEditProps
    } = this.props
    const handleOk = () => {
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
            onOk(data, resetFields)
          }
        })
      })
    }
    const handleCancel = () => {
      onCancel()
    }
    const modalOpts = {
      ...formEditProps,
      onOk: handleOk
    }

    return (
      <Modal
        onCancel={onCancel}
        {...modalOpts}
        footer={[
          <Button size="large" key="back" onClick={handleCancel}>Cancel</Button>,
          <Button size="large" key="submit" type="primary" onClick={handleOk}>
            Ok
          </Button>
        ]}
      >
        <Form layout="horizontal">
          <FormItem label="Product Code" hasFeedback {...formItemLayout}>
            {getFieldDecorator('productCode', {
              rules: [
                {
                  required: true,
                  pattern: /^[a-z0-9/-]{3,30}$/i,
                  message: 'a-Z & 0-9'
                }
              ]
            })(<Input maxLength={30} autoFocus />)}
          </FormItem>
          <FormItem label="Product Name" hasFeedback {...formItemLayout}>
            {getFieldDecorator('productName', {
              rules: [
                {
                  required: true,
                  message: 'a-Z & 0-9',
                  pattern: /^[A-Za-z0-9-.,%'"=><$#@^&*!() _/]{3,85}$/i
                }
              ]
            })(<Input maxLength={85} onChange={this.changeName} />)}
          </FormItem>
          <FormItem label="Barcode 1" hasFeedback {...formItemLayout}>
            {getFieldDecorator('barCode01', {
              initialValue: getFieldValue('productCode')
            })(<Input />)}
          </FormItem>
          <FormItem label="Dimension" {...formItemLayout}>
            {getFieldDecorator('dimension', {
              initialValue: formatDimension(getFieldValue('productName')),
              rules: [
                {
                  required: true,
                  message: 'Required when product image is filled'
                }
              ]
            })(<Input maxLength={30} />)}
          </FormItem>
          <FormItem label="Per Box" {...formItemLayout} help="Isi Dalam 1 Karton Pengiriman">
            {getFieldDecorator('dimensionBox', {
              initialValue: formatBox(formatDimension(getFieldValue('productName'))),
              rules: [
                {
                  required: true,
                  pattern: /^([0-9]{1,5})$/,
                  message: 'Required when product image is filled'
                }
              ]
            })(<Input maxLength={25} />)}
          </FormItem>
          <FormItem label="Per Pack" {...formItemLayout} help="Isi Dalam 1 Produk">
            {getFieldDecorator('dimensionPack', {
              initialValue: formatPack(formatDimension(getFieldValue('productName'))),
              rules: [
                {
                  required: true,
                  pattern: /^([0-9]{1,5})$/,
                  message: 'Required when product image is filled'
                }
              ]
            })(<Input maxLength={25} />)}
          </FormItem>
        </Form>
      </Modal>
    )
  }
}

ModalAddProduct.propTypes = {
  form: PropTypes.object.isRequired,
  onOk: PropTypes.func
}

export default Form.create()(ModalAddProduct)
