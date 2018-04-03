import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, Button } from 'antd'

const FormItem = Form.Item

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 14 }
}

const modal = ({
  item = {},
  onOk,
  modalButtonCancelClick,
  modalButtonSaveClick,
  form: { getFieldDecorator, validateFields, getFieldsValue },
  ...modalProps
}) => {
  const handleOk = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue(),
        key: item.key
      }
      data.userRole = data.userRole.join(' ')
      onOk(data)
    })
  }

  const modalOpts = {
    ...modalProps,
    onOk: handleOk
  }

  const hdlButtonCancelClick = () => {
    modalButtonCancelClick()
  }
  const hdlButtonSaveClick = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue()
      }

      modalButtonSaveClick(data.miscCode, data.miscName, data)
    })
  }


  return (
    <Modal {...modalOpts}
      footer={[
        <Button key="back" onClick={() => hdlButtonCancelClick()} >Cancel</Button>,
        <Button key="submit" onClick={() => hdlButtonSaveClick()} type="primary" >Save</Button>
      ]}
    >
      <Form layout="horizontal">
        <FormItem label="Code" hasFeedback {...formItemLayout}>
          {getFieldDecorator('miscCode', {
            initialValue: item.miscCode,
            rules: [{ required: true, min: 3, max: 10 }]
          })(<Input />)}
        </FormItem>
        <FormItem label="Name" hasFeedback {...formItemLayout}>
          {getFieldDecorator('miscName', {
            initialValue: item.miscName,
            rules: [{ required: true, min: 3, max: 10 }]
          })(<Input />)}
        </FormItem>
        <FormItem label="Desc" hasFeedback {...formItemLayout}>
          {getFieldDecorator('miscDesc', {
            initialValue: item.miscDesc,
            rules: [{ max: 50 }]
          })(<Input />)}
        </FormItem>
        <FormItem label="Variable" hasFeedback {...formItemLayout}>
          {getFieldDecorator('miscVariable', {
            initialValue: item.miscVariable,
            rules: [{ max: 300 }]
          })(<Input />)}
        </FormItem>
      </Form>
    </Modal>
  )
}

modal.propTypes = {
  form: PropTypes.object.isRequired,
  type: PropTypes.string,
  item: PropTypes.object,
  onOk: PropTypes.func
}

export default Form.create()(modal)
