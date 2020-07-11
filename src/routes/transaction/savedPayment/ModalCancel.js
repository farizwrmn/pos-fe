import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, Button } from 'antd'

const FormItem = Form.Item
const { TextArea } = Input

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 14 }
}

const modal = ({
  onOk,
  invoiceCancel,
  form: { getFieldDecorator, validateFields, getFieldsValue },
  ...modalProps
}) => {
  const handleOk = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue(),
        transNo: invoiceCancel
      }
      onOk(data)
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
        <FormItem label="No" {...formItemLayout}>
          <Input value={invoiceCancel} />
        </FormItem>
        <FormItem label="Memo" {...formItemLayout}>
          {getFieldDecorator('memo', {
            rules: [
              {
                required: true,
                message: 'At least 20 character'
              }
            ]
          })(<TextArea maxLength={100} autosize={{ minRows: 2, maxRows: 3 }} />)}
        </FormItem>
      </Form>
    </Modal>
  )
}

modal.propTypes = {
  form: PropTypes.object.isRequired,
  location: PropTypes.object,
  onOk: PropTypes.func,
  invoiceCancel: PropTypes.object
}

export default Form.create()(modal)
