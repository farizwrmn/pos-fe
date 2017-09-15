/**
 * Created by Veirry on 11/09/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import{ Modal, Form, Input } from 'antd'

const FormItem = Form.Item

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 10 },
}

const Modal = ({ form: { getFieldDecorator, validateFields, getFieldsValue },...modalProps }) => {
  const handleOk = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue(),
        transNo: invoiceCancel,
      }
      onOk(data)
    })
  }
  const modalOpts = {
    ...modalProps,
    onOk: handleOk,
  }
  return (
    <Modal {...modalOpts}
      footer={[
        <Button key="submit" onClick={() => handleOk()} type="primary" >Process</Button>,
      ]}
    >
      <Form>
        <FormItem label="No" {...formItemLayout}>
          {getFieldDecorator('transNo', {
            rules: [{max: 50}],
          })(<Input />)}
        </FormItem>
      </Form>
    </Modal>
  )
}

Modal.propTypes = {
  form: PropTypes.object.isRequired,
  loading: PropTypes.func,
  onOk: PropTypes.func,
  type: PropTypes.string,
}

export default Form.create()(Modal)
