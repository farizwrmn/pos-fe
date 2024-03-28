import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, InputNumber, Select, Button, Row, Col, Modal } from 'antd'


const Option = Select.Option
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
          resetFields()
        },
        onCancel () { }
      })
    })
  }
  const listPhysicalMoney = [
    {
      id: 1,
      name: 'Lembar'
    },
    {
      id: 2,
      name: 'Keping'
    }
  ]

  const physicalMoneyOption = listPhysicalMoney && listPhysicalMoney.length > 0 ? listPhysicalMoney.map(c => <Option value={c.name} key={c.name} title={c.name}>{`${c.name}`}</Option>) : []
  return (
    <Form layout="horizontal">
      <Row>
        <Col {...column}>
          <FormItem label="Name" hasFeedback {...formItemLayout}>
            {getFieldDecorator('name', {
              initialValue: item.name || '@Rp10.000',
              rules: [
                {
                  required: true
                }
              ]
            })(<Input placeholder="@Rp10.000" />)}
          </FormItem>
          <FormItem label="Value" hasFeedback {...formItemLayout}>
            {getFieldDecorator('value', {
              initialValue: item.value || 10000,
              rules: [
                {
                  required: true
                }
              ]
            })(<InputNumber min={0} placeholder="10000" />)}
          </FormItem>
          <FormItem label="Type" {...formItemLayout}>
            {getFieldDecorator('type', {
              initialValue: item.type || undefined,
              rules: [
                {
                  required: true,
                  message: '* Required'
                }
              ]
            })(
              <Select
                allowClear
                placeholder="Select Lembar/Keping"
              >
                {physicalMoneyOption}
              </Select>
            )}
          </FormItem>
          <FormItem label="sequenceNumber" hasFeedback {...formItemLayout}>
            {getFieldDecorator('sequenceNumber', {
              initialValue: item.sequenceNumber || null,
              rules: [
                {
                  required: true
                }
              ]
            })(<InputNumber min={0} placeholder="enter sequence number" />)}
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
