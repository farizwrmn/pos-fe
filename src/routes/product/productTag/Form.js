import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Button, Checkbox, Row, Col, Modal } from 'antd'

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
          <FormItem label="Tag Code" hasFeedback {...formItemLayout}>
            {getFieldDecorator('tagCode', {
              initialValue: item.tagCode,
              rules: [
                {
                  required: true,
                  pattern: /^[A-Z0-9-/]{1}$/i
                }
              ]
            })(<Input maxLength={1} autoFocus />)}
          </FormItem>
          <FormItem label="Tag Description" hasFeedback {...formItemLayout}>
            {getFieldDecorator('tagDescription', {
              initialValue: item.tagDescription,
              rules: [
                {
                  required: true
                }
              ]
            })(<Input maxLength={200} />)}
          </FormItem>
          <FormItem label="Allow Sales" {...formItemLayout}>
            {getFieldDecorator('allowSales', {
              valuePropName: 'checked',
              initialValue: item.allowSales == null ? true : item.allowSales
            })(<Checkbox>Enable</Checkbox>)}
          </FormItem>
          <FormItem label="PO To Supplier" {...formItemLayout}>
            {getFieldDecorator('allowPurchaseOrderToSupplier', {
              valuePropName: 'checked',
              initialValue: item.allowPurchaseOrderToSupplier == null ? true : item.allowPurchaseOrderToSupplier
            })(<Checkbox>Enable</Checkbox>)}
          </FormItem>
          <FormItem label="PO To DC" {...formItemLayout}>
            {getFieldDecorator('allowPurchaseOrderToDC', {
              valuePropName: 'checked',
              initialValue: item.allowPurchaseOrderToDC == null ? true : item.allowPurchaseOrderToDC
            })(<Checkbox>Enable</Checkbox>)}
          </FormItem>
          <FormItem label="Return To Supplier" {...formItemLayout}>
            {getFieldDecorator('allowReturnToSupplier', {
              valuePropName: 'checked',
              initialValue: item.allowReturnToSupplier == null ? true : item.allowReturnToSupplier
            })(<Checkbox>Enable</Checkbox>)}
          </FormItem>
          <FormItem label="Return To DC" {...formItemLayout}>
            {getFieldDecorator('allowReturnToDc', {
              valuePropName: 'checked',
              initialValue: item.allowReturnToDc == null ? true : item.allowReturnToDc
            })(<Checkbox>Enable</Checkbox>)}
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
