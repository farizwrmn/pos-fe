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
      const selector = document.getElementById('pkm')
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
          mpkm: item.mpkm
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
          <FormItem label="PKM" {...formItemLayout}>
            {getFieldDecorator('pkm', {
              initialValue: item.pkm,
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
