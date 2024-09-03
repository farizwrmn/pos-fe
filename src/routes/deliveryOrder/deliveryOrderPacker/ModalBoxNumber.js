import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, Button } from 'antd'

const FormItem = Form.Item

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 14 }
}

const ModalBoxNumber = ({
  onOk,
  loading,
  boxNumber = 1,
  form: { getFieldDecorator, validateFields, getFieldsValue },
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
        <Button key="submit" onClick={() => handleOk()} type="primary" disabled={loading.effects['deliveryOrderPacker/submitTransferOut']}>Process</Button>
      ]}
    >
      <Form>
        <FormItem label="Box Number" {...formItemLayout}>
          {getFieldDecorator('boxNumber', {
            initialValue: boxNumber,
            rules: [
              {
                required: true,
                pattern: /^[A-Za-z0-9/_-]{1,20}$/i,
                message: 'A-Z and numeric only'
              }
            ]
          })(<Input maxLength={20} />)}
        </FormItem>
      </Form>
    </Modal>
  )
}

ModalBoxNumber.propTypes = {
  form: PropTypes.object.isRequired,
  location: PropTypes.object,
  onOk: PropTypes.func,
  invoiceCancel: PropTypes.object
}

export default Form.create()(ModalBoxNumber)
