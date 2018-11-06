import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Button, Row, Col, Checkbox, Modal } from 'antd'

const FormItem = Form.Item

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
  item = {},
  onSubmit,
  modalType,
  button,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    resetFields
  }
}) => {
  const tailFormItemLayout = {
    wrapperCol: {
      span: 24,
      xs: {
        offset: modalType === 'edit' ? 10 : 19
      },
      sm: {
        offset: modalType === 'edit' ? 15 : 20
      },
      md: {
        offset: modalType === 'edit' ? 15 : 19
      },
      lg: {
        offset: modalType === 'edit' ? 13 : 18
      }
    }
  }

  const handleCancel = () => {
    resetFields()
  }

  const handleSubmit = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue()
      }
      data.footer1 = data.footer1 ? data.footer1 : ''
      data.footer2 = data.footer2 ? data.footer2 : ''
      Modal.confirm({
        title: 'Do you want to save this item?',
        onOk () {
          onSubmit(data)
          // setTimeout(() => {
          resetFields()
          // }, 500)
        },
        onCancel () { }
      })
    })
  }

  return (
    <Form layout="horizontal">
      <Row>
        <Col {...column}>
          <FormItem label="Show Cashback" {...formItemLayout}>
            {getFieldDecorator('showCashback', {
              valuePropName: 'checked',
              initialValue: item.showCashback === undefined ? true : item.showCashback
            })(<Checkbox>Active</Checkbox>)}
          </FormItem>
          <FormItem label="Footer 1" hasFeedback {...formItemLayout}>
            {getFieldDecorator('footer1', {
              initialValue: item.footer1,
              rules: [
                {
                  required: false
                }
              ]
            })(<Input maxLength={67} autoFocus />)}
          </FormItem>
          <FormItem label="Footer 2" hasFeedback {...formItemLayout}>
            {getFieldDecorator('footer2', {
              initialValue: item.footer2,
              rules: [
                {
                  required: false
                }
              ]
            })(<Input maxLength={67} />)}
          </FormItem>
          <FormItem {...tailFormItemLayout}>
            {modalType === 'edit' && <Button type="danger" style={{ margin: '0 10px' }} onClick={handleCancel}>Cancel</Button>}
            <Button type="primary" onClick={handleSubmit}>{button}</Button>
          </FormItem>
        </Col>
      </Row>
    </Form>
  )
}

FormCounter.propTypes = {
  form: PropTypes.object.isRequired,
  item: PropTypes.object,
  onSubmit: PropTypes.func,
  button: PropTypes.string
}

export default Form.create()(FormCounter)
