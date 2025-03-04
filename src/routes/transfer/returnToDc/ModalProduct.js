import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal } from 'antd'
import ListProduct from './ListProduct'

const FormItem = Form.Item

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 14 }
}

class ModalProduct extends Component {
  componentDidMount () {
    setTimeout(() => {
      const selector = document.getElementById('searchText')
      if (selector) {
        selector.focus()
      }
    }, 300)
  }

  render () {
    const {
      onOk,
      item = {},
      data,
      onSearchProduct,
      disableConfirm,
      listProductProps,
      form: { getFieldDecorator, validateFields, getFieldsValue, resetFields },
      ...modalProps
    } = this.props
    const handleOk = () => {
      validateFields((errors) => {
        if (errors) {
          return
        }
        const record = {
          id: item ? item.id : '',
          transNo: data.length > 0 ? data[0].transNo : '',
          storeId: data.length > 0 ? data[0].storeId : '',
          ...getFieldsValue()
        }
        onOk(record)
        resetFields()
      })
    }
    const modalOpts = {
      ...modalProps,
      onOk: handleOk
    }
    return (
      <Modal
        width={700}
        {...modalOpts}
        footer={null}
      >
        <Form>
          <FormItem label="Search" {...formItemLayout}>
            {getFieldDecorator('searchText', {
              rules: [
                {
                  required: true,
                  pattern: /^[a-z0-9/\n _-]{2,100}$/i,
                  message: 'At least 2 character'
                }
              ]
            })(<Input
              maxLength={200}
              onKeyDown={
                (e) => {
                  if (e.keyCode === 13) {
                    onSearchProduct(e.target.value)
                  }
                }
              }
            />)}
          </FormItem>
        </Form>
        <ListProduct {...listProductProps} />
      </Modal>
    )
  }
}

ModalProduct.propTypes = {
  form: PropTypes.object.isRequired,
  location: PropTypes.object,
  onOk: PropTypes.func,
  invoiceCancel: PropTypes.object
}

export default Form.create()(ModalProduct)
