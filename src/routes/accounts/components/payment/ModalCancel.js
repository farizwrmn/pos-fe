import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, Button } from 'antd'
import { lstorage } from 'utils'

const FormItem = Form.Item
const { TextArea } = Input

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 14 }
}

const ModalEntry = ({
  onOk,
  invoiceCancel,
  form: { getFieldDecorator, validateFields, getFieldsValue },
  ...modalProps
}) => {
  let defaultRole = (lstorage.getStorageKey('udi')[3] || '')
  const handleOk = () => {
    if (defaultRole === 'CSH') return

    validateFields((errors) => {
      if (errors) return
      const data = {
        ...getFieldsValue(),
        transNo: invoiceCancel
      }
      Modal.confirm({
        title: `Void ${invoiceCancel}'s payment`,
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
                pattern: /^[a-z0-9/\n _-]{20,100}$/i,
                message: 'At least 20 character'
              }
            ]
          })(<TextArea maxLength={100} autosize={{ minRows: 2, maxRows: 3 }} />)}
        </FormItem>
      </Form>
    </Modal>
  )
}

ModalEntry.propTypes = {
  form: PropTypes.object.isRequired,
  location: PropTypes.object,
  onOk: PropTypes.func,
  invoiceCancel: PropTypes.object
}

export default Form.create()(ModalEntry)
