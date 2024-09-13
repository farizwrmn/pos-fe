
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button, Form, InputNumber, Modal } from 'antd'

const FormItem = Form.Item

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 14 }
}

class ModalEditPkm extends Component {
  componentDidMount () {
    setTimeout(() => {
      const selector = document.getElementById('mpkm')
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
      form: { getFieldDecorator, validateFields, getFieldsValue },
      ...modalProps
    } = this.props

    const handleOk = () => {
      validateFields((errors) => {
        if (errors) {
          return
        }
        const record = {
          ...getFieldsValue(),
          minor: item.minor,
          pkm: item.pkm
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
          <Button type="primary" onClick={() => handleOk()}>Submit</Button>
        ]}
      >
        <Form>
          <FormItem label="MPKM" {...formItemLayout}>
            {getFieldDecorator('mpkm', {
              initialValue: item.mpkm,
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
          <FormItem label="N+" {...formItemLayout}>
            {getFieldDecorator('nPlus', {
              initialValue: item.nPlus,
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
          <FormItem label="Nx" {...formItemLayout}>
            {getFieldDecorator('nCross', {
              initialValue: item.nCross,
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
        </Form>
      </Modal>
    )
  }
}

ModalEditPkm.propTypes = {
  form: PropTypes.object.isRequired,
  location: PropTypes.object,
  onOk: PropTypes.func,
  invoiceCancel: PropTypes.object
}

export default Form.create()(ModalEditPkm)
