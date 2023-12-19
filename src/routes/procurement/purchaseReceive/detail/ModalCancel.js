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
  item = {},
  data,
  form: { getFieldDecorator, validateFields, getFieldsValue, resetFields },
  ...modalProps
}) => {
  let defaultRole = (lstorage.getStorageKey('udi')[3] || '')
  const handleOk = () => {
    if (defaultRole === 'CSH' || defaultRole === 'HKS') return
    validateFields((errors) => {
      if (errors) return
      const record = {
        id: item ? item.id : '',
        transNo: data ? data.transNo : '',
        storeId: data ? data.storeId : '',
        ...getFieldsValue()
      }
      Modal.confirm({
        title: `Void ${data.transNo}'s payment`,
        content: 'Are you sure ?',
        onOk () {
          onOk(record)
        }
      })
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
        <Button key="submit" onClick={() => handleOk()} type="primary" >Process</Button>
      ]}
    >
      <Form>
        <FormItem label="No" {...formItemLayout}>
          <Input value={data ? data.transNo : ''} />
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
