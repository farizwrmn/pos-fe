import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Form, Input } from 'antd'

const FormItem = Form.Item

const formItemLayout = {
  labelCol: {
    xs: { span: 13 },
    sm: { span: 8 },
    md: { span: 8 }
  },
  wrapperCol: {
    xs: { span: 11 },
    sm: { span: 14 },
    md: { span: 14 }
  }
}

const ModalMobile = ({
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    resetFields
  },
  onSearch,
  ...modalMobileProps
}) => {
  const handleOk = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = getFieldsValue()
      onSearch(data)
      resetFields()
    })
  }

  const modalMobileOpts = {
    onOk: handleOk,
    ...modalMobileProps
  }
  return (
    <Modal {...modalMobileOpts}>
      <Form layout="horizontal">
        <FormItem label="MEMBER ID" hasFeedback {...formItemLayout}>
          {getFieldDecorator('id', {
            rules: [
              {
                required: true
              }
            ]
          })(<Input />)}
        </FormItem>
      </Form>
    </Modal>
  )
}

ModalMobile.propTypes = {
  form: PropTypes.object.isRequired
}

export default Form.create()(ModalMobile)
