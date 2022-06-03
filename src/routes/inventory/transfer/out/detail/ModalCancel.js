import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, Button } from 'antd'

const FormItem = Form.Item
const { TextArea } = Input

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 14 }
}

const ModalConfirm = ({
  onOk,
  item = {},
  data,
  disableConfirm,
  form: { getFieldDecorator, validateFields, getFieldsValue, resetFields },
  ...modalProps
}) => {
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
    <Modal {...modalOpts}
      footer={[
        <Button key="submit" disabled={disableConfirm} onClick={() => handleOk()} type="primary" >Process</Button>
      ]}
    >
      <Form>
        <FormItem label="No" {...formItemLayout}>
          <Input value={data.length > 0 ? data[0].transNo : ''} />
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
          })(<TextArea maxLength={200} autosize={{ minRows: 2, maxRows: 3 }} />)}
        </FormItem>
      </Form>
    </Modal>
  )
}

ModalConfirm.propTypes = {
  form: PropTypes.object.isRequired,
  location: PropTypes.object,
  onOk: PropTypes.func,
  invoiceCancel: PropTypes.object
}

export default Form.create()(ModalConfirm)
