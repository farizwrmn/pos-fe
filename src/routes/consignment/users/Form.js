import React from 'react'
import PropTypes from 'prop-types'
import { Form, Button, Row, Col, Select, Input, Radio, Modal, message } from 'antd'
import PasswordForm from '../components/PasswordForm'

const FormItem = Form.Item
const Option = Select.Option
const Confirm = Modal.confirm

const RadioGroup = Radio.Group

const formItemLayout = {
  labelCol: {
    xs: { span: 8 },
    sm: { span: 8 },
    md: { span: 7 }
  },
  wrapperCol: {
    xs: { span: 16 },
    sm: { span: 14 },
    md: { span: 14 }
  }
}

const column = {
  sm: { span: 24 },
  md: { span: 24 },
  lg: { span: 12 },
  xl: { span: 12 }
}

const FormCounter = ({
  outletList,
  selectedUser,
  formType,
  cancelEdit,
  add,
  edit,
  resetPassword,
  form: {
    validateFields,
    getFieldDecorator,
    getFieldsValue,
    resetFields
  }
}) => {
  const tailFormItemLayout = {
    wrapperCol: {
      span: 24,
      xs: {
        offset: formType === 'edit' ? 10 : 19
      },
      sm: {
        offset: formType === 'edit' ? 15 : 20
      },
      md: {
        offset: formType === 'edit' ? 15 : 19
      },
      lg: {
        offset: formType === 'edit' ? 13 : 18
      }
    }
  }

  const outletOption = outletList.length > 0 ? outletList.map(record => (<Option key={record.id} value={record.id}>{record.outlet_name}</Option>)) : []

  let modal
  const handleSubmitPassword = (password) => {
    modal.destroy()
    resetPassword(password)
  }

  const editPassword = () => {
    modal = Modal.info({
      title: 'Change Password',
      content: (
        <PasswordForm handleSubmitPassword={handleSubmitPassword} />
      ),
      okText: 'Close',
      onOk () { }
    })
  }

  const handleCancel = () => {
    resetFields()
    cancelEdit()
  }

  const handleSubmit = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      if (getFieldsValue().password !== getFieldsValue().passwordConfirmation && formType === 'add') {
        message.error('password tidak sama!')
        return
      }
      const fields = getFieldsValue()
      Confirm({
        title: 'Save Change?',
        content: 'Are you sure to save this change?',
        onOk () {
          if (formType === 'add') {
            add(fields, resetFields)
            resetFields
          } else {
            edit(fields, resetFields)
          }
        },
        onCancel () { }
      })
    })
  }

  return (
    <Form layout="horizontal">
      <Row>
        <Col {...column}>
          <FormItem label="Name" hasFeedback {...formItemLayout}>
            {getFieldDecorator('name', {
              initialValue: selectedUser.name || '',
              rules: [
                {
                  required: true
                }
              ]
            })(
              <Input />
            )}
          </FormItem>
          <FormItem label="Email" hasFeedback {...formItemLayout}>
            {getFieldDecorator('email', {
              initialValue: selectedUser.email || '',
              rules: [
                {
                  required: true
                }
              ]
            })(
              <Input />
            )}
          </FormItem>
          <FormItem label="Password" hasFeedback {...formItemLayout}>
            {getFieldDecorator('password', {
              initialValue: null,
              rules: [
                {
                  required: formType === 'add'
                }
              ]
            })(
              formType === 'add' ? (
                <Input type="password" autoComplete="new-password" />
              ) : (
                <Button type="primary" onClick={() => editPassword()}>
                  edit password
                </Button>
              )
            )}
          </FormItem>
          {formType === 'add' && (
            <FormItem label="Password Confirmation" hasFeedback {...formItemLayout}>
              {getFieldDecorator('passwordConfirmation', {
                initialValue: null,
                rules: [
                  {
                    required: true
                  }
                ]
              })(
                <Input type="password" autoComplete="new-password" />
              )}
            </FormItem>
          )}
          <FormItem label="Peran" hasFeedback {...formItemLayout}>
            {getFieldDecorator('role', {
              initialValue: selectedUser.role || null,
              rules: [
                {
                  required: true
                }
              ]
            })(
              <RadioGroup onChange={null}>
                <Radio value="kasir">kasir</Radio>
                <Radio value="admin">admin</Radio>
                <Radio value="superadmin">superadmin</Radio>
                <Radio value="supervisor">supervisor</Radio>
              </RadioGroup>
            )}
          </FormItem>
          <FormItem label="Outlet" hasFeedback {...formItemLayout}>
            {getFieldDecorator('outlet', {
              initialValue: selectedUser.outlet_id ? selectedUser.outlet.id : '',
              rules: [
                {
                  required: true
                }
              ]
            })(
              <Select onChange={null}>
                {outletOption}
              </Select>
            )}
          </FormItem>
          <FormItem label="Status" hasFeedback {...formItemLayout}>
            {getFieldDecorator('status', {
              initialValue: selectedUser.status,
              rules: [
                {
                  required: true
                }
              ]
            })(
              <RadioGroup onChange={null}>
                <Radio value={1}>active</Radio>
                <Radio value={0}>non active</Radio>
              </RadioGroup>
            )}
          </FormItem>
          <FormItem {...tailFormItemLayout}>
            {formType === 'edit' && <Button type="danger" onClick={() => handleCancel()}>Cancel</Button>}
            <Button
              type="primary"
              onClick={() => handleSubmit()}
            >
              {formType === 'add' ? 'Simpan' : 'Ubah'}
            </Button>
          </FormItem>
        </Col>
      </Row>
    </Form >
  )
}

FormCounter.propTypes = {
  form: PropTypes.object.isRequired,
  item: PropTypes.object,
  onSubmit: PropTypes.func,
  button: PropTypes.string
}

export default Form.create()(FormCounter)
