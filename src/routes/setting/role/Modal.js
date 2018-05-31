import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, Select, Button } from 'antd'

const FormItem = Form.Item
const Option = Select.Option

const formItemLayout = {
  labelCol: {
    xs: { span: 9 },
    sm: { span: 8 },
    md: { span: 7 }
  },
  wrapperCol: {
    xs: { span: 15 },
    sm: { span: 14 },
    md: { span: 14 }
  }
}

const ModalForm = ({
  ...modalProps,
  cancelSave,
  saveNewRole,
  roles,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue
  }
}) => {
  let availableRoles = []
  if (roles && roles.length) {
    availableRoles = roles.map(x => (<Option value={x.miscVariable}>{x.miscDesc}</Option>))
  }

  const handleSave = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue()
      }
      if (!data.miscVariable) data.miscVariable = ''
      saveNewRole(data)
    })
  }

  const footer = [
    <Button key="back" onClick={cancelSave}>Cancel</Button>,
    <Button key="submit" type="primary" onClick={handleSave}>Save</Button>
  ]
  return (
    <Modal footer={footer} {...modalProps}>
      <Form layout="horizontal">
        <FormItem label="Name" hasFeedback {...formItemLayout}>
          {getFieldDecorator('miscName', {
            rules: [
              {
                required: true,
                min: 3
              }
            ]
          })(<Input maxLength={10} />)}
        </FormItem>
        <FormItem label="Description" hasFeedback {...formItemLayout}>
          {getFieldDecorator('miscDesc', {
            rules: [
              {
                required: true
              }
            ]
          })(<Input maxLength={20} />)}
        </FormItem>
        <FormItem label="Reference" hasFeedback {...formItemLayout}>
          {getFieldDecorator('miscVariable')(<Select placeholder="Select role">{availableRoles}</Select>)}
        </FormItem>
      </Form>
    </Modal>
  )
}

ModalForm.propTypes = {
  cancelSave: PropTypes.func,
  saveNewRole: PropTypes.func,
  roles: PropTypes.array,
  form: PropTypes.object.isRequired
}

export default Form.create()(ModalForm)
