import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Button, Row, Col, Modal } from 'antd'

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
  selectedTransfer,
  item = {},
  onSubmit,
  onCancel,
  modalType,
  button,
  onSearchTransfer,
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

  const handleSearchTransfer = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue()
      }
      onSearchTransfer(data.transNo)
    })
  }

  const handleSubmit = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue()
      }
      Modal.confirm({
        title: 'Do you want to save this item?',
        onOk () {
          onSubmit(data, resetFields)
        },
        onCancel () { }
      })
    })
  }

  return (
    <Form layout="horizontal">
      <Row>
        <Col {...column}>
          <FormItem label="Trans No" hasFeedback {...formItemLayout}>
            {getFieldDecorator('accountCode', {
              initialValue: item.accountCode,
              rules: [
                {
                  required: true,
                  pattern: /^[a-z0-9-/]{3,9}$/i
                }
              ]
            })(<Input disabled={selectedTransfer && selectedTransfer.id} maxLength={50} autoFocus />)}
          </FormItem>
          {selectedTransfer && selectedTransfer.id ? (
            <FormItem {...tailFormItemLayout}>
              <Button type="primary" onClick={handleSubmit}>{button}</Button>
            </FormItem>
          ) : (
            <FormItem {...tailFormItemLayout}>
              <Button type="default" onClick={handleSearchTransfer}>Search</Button>
            </FormItem>
          )}
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
