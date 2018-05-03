import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, InputNumber, Button, Select, Row, Col, Modal, message } from 'antd'

const FormItem = Form.Item
const Option = Select.Option

const formItemLayout = {
  labelCol: {
    xs: { span: 9 },
    sm: { span: 8 },
    md: { span: 7 }
  },
  wrapperCol: {
    xs: { span: 15 },
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

const formService = ({
  item = {},
  onSubmit,
  onCancel,
  modalType,
  disabled,
  button,
  listServiceType,
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
      if (data.serviceCode) {
        Modal.confirm({
          title: 'Do you want to save this item?',
          onOk () {
            onSubmit(data.serviceCode, data)
            // setTimeout(() => {
            resetFields()
            // }, 500)
          },
          onCancel () { }
        })
      } else {
        message.warning("Service Code can't be null")
      }
    })
  }

  const serviceType = listServiceType.length > 0 ? listServiceType.map(service => <Option value={service.miscName} key={service.miscName}>{service.miscName}</Option>) : []

  return (
    <Form layout="horizontal">
      <Row>
        <Col {...column}>
          <FormItem label="Code" hasFeedback {...formItemLayout}>
            {getFieldDecorator('serviceCode', {
              initialValue: item.serviceCode,
              rules: [
                {
                  required: true,
                  pattern: /^[a-zA-Z0-9_]+$/,
                  message: 'a-Z & 0-9'
                }
              ]
            })(<Input disabled={disabled} maxLength={30} autoFocus />)}
          </FormItem>
          <FormItem label="Service" hasFeedback {...formItemLayout}>
            {getFieldDecorator('serviceName', {
              initialValue: item.serviceName,
              rules: [
                {
                  required: true,
                  pattern: /^[a-zA-Z0-9 _-]+$/,
                  message: 'a-Z & 0-9'
                }
              ]
            })(<Input maxLength={50} />)}
          </FormItem>
          <FormItem label="Cost" hasFeedback {...formItemLayout}>
            {getFieldDecorator('cost', {
              initialValue: item.cost,
              rules: [
                {
                  required: true,
                  pattern: /^(?:0|[1-9][0-9]{0,})$/,
                  message: '0-9'
                }
              ]
            })(<InputNumber style={{ width: '100%' }} maxLength={20} />)}
          </FormItem>
          <FormItem label="Service Cost" hasFeedback {...formItemLayout}>
            {getFieldDecorator('serviceCost', {
              initialValue: item.serviceCost,
              rules: [
                {
                  pattern: /^(?:0|[1-9][0-9]{0,})$/,
                  message: '0-9'
                }
              ]
            })(<Input maxLength={20} />)}
          </FormItem>
          <FormItem label="Service Type" hasFeedback {...formItemLayout}>
            {getFieldDecorator('serviceTypeId', {
              initialValue: item.serviceTypeId,
              rules: [
                {
                  required: true
                }
              ]
            })(<Select
              optionFilterProp="children"
              mode="default"
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >{serviceType}
            </Select>)}
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

formService.propTypes = {
  form: PropTypes.object.isRequired,
  listServiceType: PropTypes.object,
  disabled: PropTypes.string,
  item: PropTypes.object,
  onSubmit: PropTypes.func,
  button: PropTypes.string
}

export default Form.create()(formService)
