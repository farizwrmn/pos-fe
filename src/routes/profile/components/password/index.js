import React from 'react'
import { Form, Icon, Input, Button, message } from 'antd'

const FormItem = Form.Item

const Password = ({
  visiblePw,
  onTogglePw,
  onUpdatePw,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    resetFields
  }
}) => {
  const updatePassword = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      let data = {
        ...getFieldsValue()
      }
      if (data.newPassword === data.oldPassword) {
        message.warning('The password is same as before!')
        return false
      } else if (data.newPassword !== data.confirmNewPassword) {
        message.warning('New password does not match the confirm password!')
        return false
      }
      data = { confirm: data.newPassword, password: data.newPassword, oldpassword: data.oldPassword }
      onUpdatePw(data)
      resetFields()
    })
  }

  return (
    <div>
      <Form layout="horizontal">
        <FormItem
          label="Old Password"
          hasFeedback
        >
          {getFieldDecorator('oldPassword', {
            rules: [{ required: true, message: 'Please input your Password!' }]
          })(
            <Input type="password"
              placeholder="Password"
              prefix={<Icon type="lock" style={{ fontSize: 13 }} />}
            />
          )}
        </FormItem>
        <FormItem
          label="New Password"
          hasFeedback
        >

          {getFieldDecorator('newPassword', {
            rules: [{
              required: true,
              min: 8,
              message: 'Please input your Password!'
            }]
          })(
            <Input type={visiblePw ? 'text' : 'password'}
              placeholder="New Password"
              prefix={<Icon type="lock" style={{ fontSize: 13 }} />}
              suffix={<Icon type={visiblePw ? 'eye-o' : 'eye'} onClick={onTogglePw} style={{ marginRight: '20px' }} />}
            />
          )}
        </FormItem>
        <FormItem
          label="Confirm New Password"
          hasFeedback
        >

          {getFieldDecorator('confirmNewPassword', {
            rules: [{
              required: true,
              min: 8,
              message: 'Please input your Password!'
            }]
          })(
            <Input type={visiblePw ? 'text' : 'password'}
              placeholder="Confirm New Password"
              prefix={<Icon type="lock" style={{ fontSize: 13 }} />}
            />
          )}
        </FormItem>
        <Button key="submit" type="primary" style={{ float: 'right' }} onClick={updatePassword}>Update</Button>
      </Form>
    </div >
  )
}

export default Form.create()(Password)
