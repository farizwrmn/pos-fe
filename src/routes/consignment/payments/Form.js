import React from 'react'
import PropTypes from 'prop-types'
import { Form, Button, Row, Col, Input, Modal, message } from 'antd'

const FormItem = Form.Item
const Confirm = Modal.confirm

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
  formType,
  selectedOutlet,
  currentItem,
  cancelEdit,
  add,
  edit,
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

  const handleCancel = () => {
    resetFields()
    cancelEdit()
  }

  const handleSubmit = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      if (getFieldsValue().password !== getFieldsValue().passwordConfirmation) {
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
          <FormItem label="Outlet" hasFeedback {...formItemLayout}>
            {getFieldDecorator('outlet', {
              initialValue: selectedOutlet ? selectedOutlet.outlet_name : null,
              rules: [
                {
                  required: true
                }
              ]
            })(
              <Input disabled />
            )}
          </FormItem>
          <FormItem label="Jenis Akun" hasFeedback {...formItemLayout}>
            {getFieldDecorator('payment', {
              initialValue: currentItem ? currentItem.method : null,
              rules: [
                {
                  required: true
                }
              ]
            })(
              <Input />
            )}
          </FormItem>
          <FormItem label="Kode Akun" hasFeedback {...formItemLayout}>
            {getFieldDecorator('code', {
              initialValue: currentItem ? currentItem.typeCode : null,
              rules: [
                {
                  required: true
                }
              ]
            })(
              <Input />
            )}
          </FormItem>
          <FormItem label="Biaya Food (%)" hasFeedback {...formItemLayout}>
            {getFieldDecorator('feeFood', {
              initialValue: currentItem ? currentItem.fee_food : null,
              rules: [
                {
                  required: true
                }
              ]
            })(
              <Input />
            )}
          </FormItem>
          <FormItem label="Biaya Non-Food (%)" hasFeedback {...formItemLayout}>
            {getFieldDecorator('feeNonFood', {
              initialValue: currentItem ? currentItem.fee_non_food : null,
              rules: [
                {
                  required: true
                }
              ]
            })(
              <Input />
            )}
          </FormItem>
          <FormItem {...tailFormItemLayout}>
            {formType !== 'add' &&
              (
                <Button
                  type="ghost"
                  onClick={() => handleCancel()}
                >
                  Cancel
                </Button>
              )}
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
