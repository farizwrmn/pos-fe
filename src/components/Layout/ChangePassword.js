import React from 'react'
import { Modal, Form, Card, Icon, Input, Button } from 'antd'

const FormItem = Form.Item

const ChangePw = ({
  ...modalProps,
  visiblePw,
  onTogglePw,
  onCancelButton,
  onSaveButton,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
  },
}) => {
  const modalOpts = {
    ...modalProps,
  }

  const togglePw = () => {
    onTogglePw()
  }
  const hdlButtonCancelClick = () => {
    onCancelButton()
  }
  const hdlButtonSaveClick = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      let data = {
        ...getFieldsValue(),
      }
      data = { confirm: data.newPassword, password: data.newPassword, oldpassword: data.oldPassword }
      onSaveButton(data)
    })

  }

  return (
    <Modal {...modalOpts}
      footer={[
        <Button key='back' onClick={() => hdlButtonCancelClick()} >Cancel</Button>,
        <Button key='submit' type='primary' onClick={() => hdlButtonSaveClick()} >Save</Button>,
      ]}
    >
      <Card bordered={false} title="Change Password" >
        <Form layout="horizontal">
          <FormItem
            label="Old Password"
            hasFeedback
          >
            {getFieldDecorator('oldPassword', {
              rules: [{ required: true, message: 'Please input your Password!' }],
            })(
              <Input type="password" placeholder="Password"
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
                required: true, min: 8,
                message: 'Please input your Password!' }],
            })(
              <Input type={visiblePw ? 'text' : 'password'} placeholder="Password"
                     prefix={<Icon type="lock" style={{ fontSize: 13 }} />}
                     suffix={<Icon type={visiblePw ? 'eye-o' : 'eye'} onClick={togglePw} style={{ marginRight: '20px' }} />}
              />
            )}
          </FormItem>
        </Form>
      </Card>
    </Modal>
  )
}

export default Form.create()(ChangePw)
