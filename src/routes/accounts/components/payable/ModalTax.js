import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, Button } from 'antd'

const FormItem = Form.Item

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 14 }
}

const ModalTax = ({
  onOk,
  currentItem,
  loading,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue
  },
  ...modalProps
}) => {
  const handleOk = () => {
    validateFields((errors) => {
      if (errors) return
      const data = {
        ...getFieldsValue(),
        id: currentItem.id
      }
      Modal.confirm({
        title: 'Add Tax',
        content: 'Are you sure ?',
        onOk () {
          onOk(data)
        }
      })
    })
  }

  const modalOpts = {
    ...modalProps,
    onOk: handleOk
  }

  return (
    <Modal {...modalOpts}
      footer={[
        <Button key="submit" disabled={loading.effects['accountPayment/queryPurchase']} type="primary" size="large" onClick={() => handleOk()}>Submit</Button>
      ]}
    >
      <Form>
        <FormItem label="taxInvoiceNo" {...formItemLayout}>
          {getFieldDecorator('taxInvoiceNo', {
            rules: [{
              required: true
            }]
          })(<Input />)}
        </FormItem>
      </Form>
    </Modal>
  )
}

ModalTax.propTypes = {
  form: PropTypes.object.isRequired,
  location: PropTypes.object,
  onOk: PropTypes.func,
  invoiceCancel: PropTypes.object
}

export default Form.create()(ModalTax)
