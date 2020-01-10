import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Button, Modal, Checkbox, InputNumber } from 'antd'

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

const FormCounter = ({
  item = {},
  onSubmit,
  onCancel,
  modalType,
  disabled,
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
      data.parentId = data.parentId ? data.parentId.key : null
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
      <FormItem label="Bank Code" hasFeedback {...formItemLayout}>
        {getFieldDecorator('bankCode', {
          initialValue: item.bankCode,
          rules: [
            {
              required: true
            }
          ]
        })(<Input disabled maxLength={60} autoFocus />)}
      </FormItem>
      <FormItem label="Bank Name" hasFeedback {...formItemLayout}>
        {getFieldDecorator('bankName', {
          initialValue: item.bankName,
          rules: [
            {
              required: true
            }
          ]
        })(<Input disabled maxLength={60} />)}
      </FormItem>
      <FormItem label="Charge(N)" hasFeedback {...formItemLayout}>
        {getFieldDecorator('chargeNominal', {
          initialValue: item.chargeNominal || 0,
          rules: [
            {
              required: true
            }
          ]
        })(<InputNumber min={0} max={99999} />)}
      </FormItem>
      <FormItem label="Charge(%)" hasFeedback {...formItemLayout}>
        {getFieldDecorator('chargePercent', {
          initialValue: item.chargePercent || 0,
          rules: [
            {
              required: true
            }
          ]
        })(<InputNumber min={0} max={99} />)}
      </FormItem>
      <FormItem label="Status" hasFeedback {...formItemLayout}>
        {getFieldDecorator('active', {
          valuePropName: 'checked',
          initialValue: item.active === undefined ? true : Number(item.active)
        })(<Checkbox>Active</Checkbox>)}
      </FormItem>
      <FormItem {...tailFormItemLayout}>
        {modalType === 'edit' && <Button type="danger" style={{ margin: '0 10px' }} onClick={handleCancel}>Cancel</Button>}
        <Button type="primary" disabled={disabled} onClick={handleSubmit}>{button}</Button>
      </FormItem>
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
