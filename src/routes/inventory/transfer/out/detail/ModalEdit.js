import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, InputNumber, Modal, Button } from 'antd'

const FormItem = Form.Item

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 14 }
}

const ModalEdit = ({
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
        productId: item.productId,
        deliveryOrderNo: data.length > 0 ? data[0].deliveryOrderNo : null,
        transNo: data.length > 0 ? data[0].transNo : '',
        storeId: data.length > 0 ? data[0].storeId : '',
        ...getFieldsValue()
      }
      onOk(record, resetFields)
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
        <FormItem label="Price" {...formItemLayout}>
          {getFieldDecorator('purchasePrice', {
            initialValue: item.purchasePrice,
            rules: [
              {
                required: true
              }
            ]
          })(<InputNumber
            min={0}
          />)}
        </FormItem>
      </Form>
    </Modal>
  )
}

ModalEdit.propTypes = {
  form: PropTypes.object.isRequired,
  location: PropTypes.object,
  onOk: PropTypes.func,
  invoiceCancel: PropTypes.object
}

export default Form.create()(ModalEdit)
