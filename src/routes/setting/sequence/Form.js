import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, InputNumber, Button, Row, Col, Modal } from 'antd'

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
  onCancel,
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
    onCancel()
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
          <FormItem label="StoreId" hasFeedback {...formItemLayout}>
            {getFieldDecorator('storeId', {
              initialValue: item.storeId,
              rules: [
                {
                  required: true
                }
              ]
            })(<Input maxLength={50} autoFocus />)}
          </FormItem>
          <FormItem label="Code" hasFeedback {...formItemLayout}>
            {getFieldDecorator('seqCode', {
              initialValue: item.seqCode,
              rules: [
                {
                  required: true
                }
              ]
            })(<Input maxLength={50} />)}
          </FormItem>
          <FormItem label="Type Seq" hasFeedback {...formItemLayout}>
            {getFieldDecorator('typeSeq', {
              initialValue: item.typeSeq,
              rules: [
                {
                  required: true
                }
              ]
            })(<Input maxLength={50} />)}
          </FormItem>
          <FormItem label="Sequence" hasFeedback {...formItemLayout}>
            {getFieldDecorator('seqName', {
              initialValue: item.seqName,
              rules: [
                {
                  required: true
                }
              ]
            })(<Input maxLength={50} />)}
          </FormItem>
          <FormItem label="Value" hasFeedback {...formItemLayout}>
            {getFieldDecorator('seqValue', {
              initialValue: item.seqValue,
              rules: [
                {
                  required: true
                }
              ]
            })(<Input maxLength={50} />)}
          </FormItem>
          <FormItem label="Initial Char" hasFeedback {...formItemLayout}>
            {getFieldDecorator('initialChar', {
              initialValue: item.initialChar,
              rules: [
                {
                  required: true
                }
              ]
            })(<Input maxLength={50} />)}
          </FormItem>
          <FormItem label="Max Number" hasFeedback {...formItemLayout}>
            {getFieldDecorator('maxNumber', {
              initialValue: item.maxNumber,
              rules: [
                {
                  required: true
                }
              ]
            })(<InputNumber max={10} />)}
          </FormItem>
          <FormItem label="Reset Type" hasFeedback {...formItemLayout}>
            {getFieldDecorator('resetType', {
              initialValue: item.resetType,
              rules: [
                {
                  required: true
                }
              ]
            })(<Input maxLength={50} />)}
          </FormItem>
          <FormItem label="Reset Date" hasFeedback {...formItemLayout}>
            {getFieldDecorator('resetDate', {
              initialValue: item.resetDate,
              rules: [
                {
                  required: true
                }
              ]
            })(<Input maxLength={50} />)}
          </FormItem>
          <FormItem label="Old Value" hasFeedback {...formItemLayout}>
            {getFieldDecorator('oldValue', {
              initialValue: item.oldValue,
              rules: [
                {
                  required: true
                }
              ]
            })(<Input maxLength={50} />)}
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
