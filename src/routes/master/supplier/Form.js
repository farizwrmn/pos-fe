import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Button, Select, Row, Col, message, Modal } from 'antd'

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

const formSupplier = ({
  item = {},
  onSubmit,
  onCancel,
  modalType,
  disabled,
  button,
  showCities,
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
        offset: modalType === 'edit' ? 10 : 18
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

  const city = () => {
    showCities()
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
      if (data.supplierCode) {
        Modal.confirm({
          title: 'Do you want to save this item?',
          onOk () {
            onSubmit(data.supplierCode, data)
            // setTimeout(() => {
            resetFields()
            // }, 500)
          },
          onCancel () { }
        })
      } else {
        message.warning("Supplier Code can't be null")
      }
    })
  }

  const cities = listCity.length > 0 ? listCity.map(c => <Option value={c.id} key={c.id}>{c.cityName}</Option>) : []

  return (
    <Form layout="horizontal">
      <Row>
        <Col {...column}>
          <FormItem label="ID" hasFeedback {...formItemLayout}>
            {getFieldDecorator('supplierCode', {
              initialValue: item.supplierCode,
              rules: [
                {
                  required: true,
                  pattern: /^[a-z0-9_]{2,15}$/i,
                  message: 'a-Z & 0-9'
                }
              ]
            })(<Input disabled={disabled} maxLength={15} autoFocus />)}
          </FormItem>
          <FormItem label="Supplier Name" hasFeedback {...formItemLayout}>
            {getFieldDecorator('supplierName', {
              initialValue: item.supplierName,
              rules: [
                {
                  required: true,
                  pattern: /^([a-zA-Z]{2})+(([a-zA-Z ])?[a-zA-Z]*)*$/,
                  message: 'a-Z min: 3 characters'
                }
              ]
            })(<Input maxLength={50} />)}
          </FormItem>
          <FormItem label="Address 1" hasFeedback {...formItemLayout}>
            {getFieldDecorator('address01', {
              initialValue: item.address01,
              rules: [
                {
                  required: true,
                  pattern: /^[A-Za-z0-9-._/ ]{5,50}$/i,
                  message: 'a-Z & 0-9'
                }
              ]
            })(<Input maxLength={50} />)}
          </FormItem>
          <FormItem label="Address 2" hasFeedback {...formItemLayout}>
            {getFieldDecorator('address02', {
              initialValue: item.address02,
              rules: [
                {
                  pattern: /^[A-Za-z0-9-._/ ]{5,50}$/i,
                  message: 'a-Z & 0-9 min: 3 characters'
                }
              ]
            })(<Input maxLength={50} />)}
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
              mode="default"
              onFocus={city}
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >{cities}
            </Select>)}
          </FormItem>
          <FormItem label="Province" hasFeedback {...formItemLayout}>
            {getFieldDecorator('state', {
              initialValue: item.state,
              rules: [
                {
                  pattern: /^[a-z0-9_-]{3,20}$/i,
                  message: 'a-Z & 0-9'
                }
              ]
            })(<Input maxLength={20} />)}
          </FormItem>
        </Col>
        <Col {...column} >
          <FormItem label="Post Code" hasFeedback {...formItemLayout}>
            {getFieldDecorator('zipCode', {
              initialValue: item.zipCode,
              rules: [
                {
                  pattern: /^[a-z0-9_-]{3,20}$/i,
                  message: 'a-Z & 0-9 min: 3 characters'
                }
              ]
            })(<Input maxLength={20} />)}
          </FormItem>
          <FormItem label="Tax ID" hasFeedback {...formItemLayout}>
            {getFieldDecorator('taxId', {
              initialValue: item.taxId,
              rules: [
                {
                  pattern: /^([0-9]{15,})+$/,
                  message: 'invalid NPWP'
                }
              ]
            })(<Input maxLength={15} />)}
          </FormItem>
          <FormItem label="Phone" hasFeedback {...formItemLayout}>
            {getFieldDecorator('phoneNumber', {
              initialValue: item.phoneNumber,
              rules: [
                {
                  required: true,
                  pattern: /^\(?(0[0-9]{3})\)?[-. ]?([0-9]{2,4})[-. ]?([0-9]{4,5})$/,
                  message: 'Input a Phone No.[xxxx xxxx xxxx]'
                }
              ]
            })(<Input maxLength={20} />)}
          </FormItem>
          <FormItem label="Mobile Number" hasFeedback {...formItemLayout}>
            {getFieldDecorator('mobileNumber', {
              initialValue: item.mobileNumber,
              rules: [
                {
                  required: true,
                  pattern: /^\(?(0[0-9]{3})\)?[-. ]?([0-9]{2,4})[-. ]?([0-9]{4,5})$/,
                  message: 'Input a Mobile No.[xxxx xxxx xxxx]'
                }
              ]
            })(<Input maxLength={15} />)}
          </FormItem>
          <FormItem label="Email" hasFeedback {...formItemLayout}>
            {getFieldDecorator('email', {
              initialValue: item.email,
              rules: [
                {
                  pattern: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/,
                  message: 'Email format is not valid'
                }
              ]
            })(<Input maxLength={15} />)}
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

formSupplier.propTypes = {
  form: PropTypes.object.isRequired,
  listCity: PropTypes.object,
  showCities: PropTypes.func,
  disabled: PropTypes.string,
  item: PropTypes.object,
  onSubmit: PropTypes.func,
  button: PropTypes.string
}

export default Form.create()(formSupplier)
