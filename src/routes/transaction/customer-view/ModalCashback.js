import React from 'react'
import PropTypes from 'prop-types'
import { Form, InputNumber, Modal, Row } from 'antd'

const FormItem = Form.Item

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 10 }
}

const ModalCashback = ({
  item = {},
  onOk,
  onCancel,
  form: { getFieldDecorator, validateFields, getFieldsValue, resetFields },
  ...modalProps
}) => {
  const handleOk = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue()
      }
      const newItem = {
        memberCode: item.memberCode,
        memberName: item.memberName,
        address01: item.address01,
        cashback: item.cashback ? item.cashback : 0,
        id: item.id,
        memberTypeName: item.memberTypeName,
        memberTypeId: item.memberTypeId,
        memberSellPrice: item.memberSellPrice,
        showAsDiscount: item.showAsDiscount,
        memberPendingPayment: item.memberPendingPayment,
        gender: item.gender,
        phone: item.mobileNumber === '' ? item.phoneNumber : item.mobileNumber
      }
      if (item.cashback > 0 && data.useLoyalty <= item.cashback) {
        newItem.useLoyalty = data.useLoyalty
      }
      onOk(newItem)
    })
  }

  const handleCancel = () => {
    resetFields()
    onCancel()
  }

  const modalOpts = {
    ...modalProps,
    onOk: handleOk,
    onCancel: handleCancel
  }

  return (
    <Modal {...modalOpts}>
      <Form layout="horizontal">
        <FormItem label="Cashback" hasFeedback {...formItemLayout}>
          <Row>
            {getFieldDecorator('useLoyalty', {
              initialValue: item.useLoyalty || 0,
              rules: [
                {
                  required: true,
                  pattern: /^[0-9]+$/i,
                  message: 'Cannot fill by decimal'
                }
              ]
            })(<InputNumber min={0} max={item.cashback || 0} />)}
          </Row>
          <h4>{(item.cashback - (item.useLoyalty || 0)) || 0} remains</h4>
        </FormItem>
      </Form>
    </Modal>
  )
}

ModalCashback.propTypes = {
  form: PropTypes.object.isRequired,
  memberInformation: PropTypes.object.isRequired,
  type: PropTypes.string,
  item: PropTypes.object,
  onOk: PropTypes.func
}

export default Form.create()(ModalCashback)
