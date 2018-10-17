import React from 'react'
import PropTypes from 'prop-types'
import { Form, InputNumber, Modal, Row, Col } from 'antd'

const FormItem = Form.Item

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 10 }
}

const ModalPoint = ({
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
        point: item.point ? item.point : 0,
        id: item.id,
        memberTypeName: item.memberTypeName,
        memberTypeId: item.memberTypeId,
        memberSellPrice: item.memberSellPrice,
        memberPendingPayment: item.memberPendingPayment,
        gender: item.gender,
        phone: item.mobileNumber === '' ? item.phoneNumber : item.mobileNumber
      }
      if (item.point > 0 && data.usePoint <= item.point) {
        newItem.usePoint = data.usePoint
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
        <FormItem label="Point" hasFeedback {...formItemLayout}>
          <Row>
            <Col lg={10} md={24}>
              {getFieldDecorator('usePoint', {
                initialValue: item.usePoint || 0,
                rules: [
                  {
                    required: true,
                    pattern: /^[0-9]+$/i,
                    message: 'Cannot fill by decimal'
                  }
                ]
              })(<InputNumber min={0} max={item.point || 0} />)}
            </Col>
            <Col lg={14}>
              <h2>/ {item.point || 0} points</h2>
            </Col>
          </Row>

        </FormItem>
      </Form>
    </Modal>
  )
}

ModalPoint.propTypes = {
  form: PropTypes.object.isRequired,
  memberInformation: PropTypes.object.isRequired,
  type: PropTypes.string,
  item: PropTypes.object,
  onOk: PropTypes.func
}

export default Form.create()(ModalPoint)
