import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Input, Form, InputNumber } from 'antd'

const FormItem = Form.Item

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 }
}

const ModalList = ({
  editModalItem,
  item,
  form: { resetFields, getFieldDecorator, validateFields, getFieldsValue },
  ...modalProps }) => {
  const handleClick = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...item,
        ...getFieldsValue()
      }
      editModalItem(data)
      resetFields()
    })
  }

  const modalOpts = {
    ...modalProps,
    onOk: handleClick
  }

  return (
    <Modal {...modalOpts}>
      <Form>
        <FormItem {...formItemLayout} label="Amount In">
          {getFieldDecorator('amount', {
            initialValue: item.amount,
            rules: [{
              required: true,
              pattern: /^([0-9.]{0,19})$/i,
              message: 'Quantity is not define'
            }]
          })(<InputNumber
            min={0}
            max={item.paymentTotal}
            style={{ width: '100%' }}
          />)}
        </FormItem>
        <FormItem {...formItemLayout} label="Description">
          {getFieldDecorator('description', {
            initialValue: item.description
          })(<Input />)}
        </FormItem>
      </Form>
    </Modal>
  )
}

ModalList.propTypes = {
  form: PropTypes.isRequired,
  pos: PropTypes.isRequired,
  item: PropTypes.isRequired,
  onDelete: PropTypes.func.isRequired,
  modalPurchaseVisible: PropTypes.isRequired
}
export default Form.create()(ModalList)
