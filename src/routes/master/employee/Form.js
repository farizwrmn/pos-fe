import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Button, Select, Row, Col, Modal, message } from 'antd'

const FormItem = Form.Item
const Option = Select.Option

const formItemLayout = {
  labelCol: {
    xs: { span: 11 },
    sm: { span: 8 },
    md: { span: 7 }
  },
  wrapperCol: {
    xs: { span: 13 },
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

const formEmployee = ({
  item,
  sequence,
  onSubmit,
  onCancel,
  disabled,
  button,
  modalType,
  showPosition,
  showCities,
  listLovJobPosition,
  listCity,
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
        offset: modalType === 'edit' ? 16 : 20
      },
      md: {
        offset: modalType === 'edit' ? 15 : 19
      },
      lg: {
        offset: modalType === 'edit' ? 13 : 18
      }
    }
  }

  const jobPosition = () => {
    showPosition()
  }

  const city = () => {
    showCities()
  }

  const handleSubmit = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue()
      }
      if (data.employeeId) {
        Modal.confirm({
          title: 'Do you want to save this item?',
          onOk () {
            onSubmit(data.employeeId, data)
            resetFields()
          },
          onCancel () { }
        })
      } else {
        message.warning("Employee Id can't be null")
      }
    })
  }

  const handleCancel = () => {
    onCancel()
    resetFields()
  }

  const jobposition = listLovJobPosition.length > 0 ? listLovJobPosition.map(position => <Option value={position.value} key={position.value}>{position.label}</Option>) : []
  const cities = listCity.length > 0 ? listCity.map(c => <Option value={c.id} key={c.id}>{c.cityName}</Option>) : []

  return (
    <Form layout="horizontal">
      <Row>
        <Col {...column}>
          <FormItem label="Employee ID" hasFeedback {...formItemLayout}>
            {getFieldDecorator('employeeId', {
              initialValue: item.employeeId || sequence,
              rules: [
                {
                  required: true,
                  pattern: /^[a-zA-Z0-9_]{6,15}$/i,
                  message: 'a-z & 0-9, min: 6 characters'
                }
              ]
            })(<Input disabled={disabled} maxLength={15} />)}
          </FormItem>
          <FormItem label="Employee Name" hasFeedback {...formItemLayout}>
            {getFieldDecorator('employeeName', {
              initialValue: item.employeeName,
              rules: [
                {
                  required: true
                }
              ]
            })(<Input autoFocus />)}
          </FormItem>
          <FormItem label="Position" hasFeedback {...formItemLayout}>
            {getFieldDecorator('positionId', {
              initialValue: item.positionId,
              rules: [
                {
                  required: true
                }
              ]
            })(<Select
              optionFilterProp="children"
              onFocus={() => jobPosition()}
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >{jobposition}
            </Select>)}
          </FormItem>
          <FormItem label="Address 1" hasFeedback {...formItemLayout}>
            {getFieldDecorator('address01', {
              initialValue: item.address01,
              rules: [
                {
                  required: true
                }
              ]
            })(<Input />)}
          </FormItem>
          <FormItem label="Address 2" {...formItemLayout}>
            {getFieldDecorator('address02', {
              initialValue: item.address02
            })(<Input />)}
          </FormItem>
          <FormItem label="City" hasFeedback {...formItemLayout}>
            {getFieldDecorator('cityId', {
              initialValue: item.cityId,
              rules: [
                {
                  required: true
                }
              ]
            })(<Select
              optionFilterProp="children"
              onFocus={() => city()}
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >{cities}
            </Select>)}
          </FormItem>
          <FormItem label="Mobile Number" hasFeedback {...formItemLayout}>
            {getFieldDecorator('mobileNumber', {
              initialValue: item.mobileNumber,
              rules: [
                {
                  required: true,
                  pattern: /^\(?(0[0-9]{3})\)?[-. ]?([0-9]{2,4})[-. ]?([0-9]{4,5})$/,
                  message: 'mobile number is not valid'
                }
              ]
            })(<Input />)}
          </FormItem>
          <FormItem label="Phone Number" {...formItemLayout}>
            {getFieldDecorator('phoneNumber', {
              initialValue: item.phoneNumber
            })(<Input />)}
          </FormItem>
          <FormItem label="Email" {...formItemLayout}>
            {getFieldDecorator('email', {
              initialValue: item.email
            })(<Input />)}
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

formEmployee.propTypes = {
  form: PropTypes.object.isRequired,
  listLovJobPosition: PropTypes.object,
  listCity: PropTypes.object,
  showCities: PropTypes.func,
  showPosition: PropTypes.func,
  disabled: PropTypes.bool,
  item: PropTypes.object,
  onSubmit: PropTypes.func,
  button: PropTypes.string
}

export default Form.create()(formEmployee)
