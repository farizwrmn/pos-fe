import React from 'react'
import PropTypes from 'prop-types'
import { Form, Row, Col, Input, Button, Modal, message } from 'antd'

const FormItem = Form.Item

const FormCounter = ({
  handleSubmitPassword,
  form: {
    getFieldDecorator,
    getFieldsValue,
    validateFields
  }
}) => {
  const handleSubmit = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      let fields = getFieldsValue()
      if (fields.password !== fields.passwordConfirmation) {
        message.error('Password tidak sama')
        return
      }
      console.log('getFieldsValue', getFieldsValue())
      Modal.confirm({
        title: 'Save password',
        content: 'Do you want to save changes?',
        onOk () {
          handleSubmitPassword(fields.password)
        },
        onCancel () { }
      })
    })
  }

  return (
    <Form layout="horizontal">
      <Row>
        <Col span={24}>
          <FormItem label="Password" hasFeedback>
            {getFieldDecorator('password', {
              initialValue: null,
              rules: [
                {
                  required: true
                }
              ]
            })(
              <Input type="password" />
            )}
          </FormItem>
          <FormItem label="Password Confirmation" hasFeedback>
            {getFieldDecorator('passwordConfirmation', {
              initialValue: null,
              rules: [
                {
                  required: true
                }
              ]
            })(
              <Input type="password" />
            )}
          </FormItem>
          <Button onClick={() => handleSubmit()} type="primary">
            RESET PASSWORD
          </Button>
        </Col>
      </Row>
    </Form >
  )
}

FormCounter.propTypes = {
  form: PropTypes.object.isRequired
}

export default Form.create()(FormCounter)
