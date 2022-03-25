import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Button, Select, InputNumber, Row, Col, Checkbox, Modal, message } from 'antd'

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

const formCustomerType = ({
  item = {},
  onSubmit,
  onCancel,
  modalType,
  disabled,
  button,
  listSellprice,
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
      console.log('Submit')
      if (data.typeCode) {
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
      } else {
        message.warning("Type Code can't be null")
      }
    })
  }

  const children = listSellprice.length > 0 ? listSellprice.map(misc => <Option value={misc.miscName} key={misc.miscName}>{misc.miscName}</Option>) : []

  return (
    <Form layout="horizontal">
      <Row>
        <Col {...column}>
          <FormItem label="Type Code" hasFeedback {...formItemLayout}>
            {getFieldDecorator('typeCode', {
              initialValue: item.typeCode,
              rules: [
                {
                  required: true,
                  pattern: /^[a-z0-9_]{1,5}$/i,
                  message: 'a-z & 0-9'
                }
              ]
            })(<Input disabled={disabled} maxLength={5} autoFocus />)}
          </FormItem>
          <FormItem label="Type Name" hasFeedback {...formItemLayout}>
            {getFieldDecorator('typeName', {
              initialValue: item.typeName,
              rules: [
                {
                  required: true
                }
              ]
            })(<Input />)}
          </FormItem>
          <FormItem label="Discount 1" hasFeedback {...formItemLayout}>
            {getFieldDecorator('discPct01', {
              initialValue: item.discPct01,
              rules: [
                {
                  required: true,
                  pattern: /^(?:0|[1-9][0-9]{0,})$/,
                  message: '0-9'
                }
              ]
            })(<InputNumber max={100} style={{ width: '100%' }} />)}
          </FormItem>
          <FormItem label="Discount 2" hasFeedback {...formItemLayout}>
            {getFieldDecorator('discPct02', {
              initialValue: item.discPct02,
              rules: [
                {
                  required: true,
                  pattern: /^(?:0|[1-9][0-9]{0,})$/,
                  message: '0-9'
                }
              ]
            })(<InputNumber max={100} style={{ width: '100%' }} />)}
          </FormItem>
          <FormItem label="Discount 3" hasFeedback {...formItemLayout}>
            {getFieldDecorator('discPct03', {
              initialValue: item.discPct03,
              rules: [
                {
                  required: true,
                  pattern: /^(?:0|[1-9][0-9]{0,})$/,
                  message: '0-9'
                }
              ]
            })(<InputNumber max={100} style={{ width: '100%' }} />)}
          </FormItem>
          <FormItem label="Discount Nominal" hasFeedback {...formItemLayout}>
            {getFieldDecorator('discNominal', {
              initialValue: item.discNominal,
              rules: [
                {
                  required: true,
                  pattern: /^(?:0|[1-9][0-9]{0,})$/,
                  message: '0-9'
                }
              ]
            })(<InputNumber style={{ width: '100%' }} />)}
          </FormItem>
          <FormItem label="Sell Price" hasFeedback {...formItemLayout}>
            {getFieldDecorator('sellPrice', {
              initialValue: item.sellPrice,
              rules: [
                {
                  required: true
                }
              ]
            })(<Select
              optionFilterProp="children"
              mode="default"
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >{children}
            </Select>)}
          </FormItem>
          <FormItem label="Show as Discount" {...formItemLayout}>
            {getFieldDecorator('showAsDiscount', {
              valuePropName: 'checked',
              initialValue: item.id ? item.showAsDiscount : true
            })(<Checkbox />)}
          </FormItem>
          <FormItem label="Description" help="Help you on input product's price" hasFeedback {...formItemLayout}>
            {getFieldDecorator('description', {
              initialValue: item.description,
              rules: [
                {
                  required: true
                }
              ]
            })(<Input maxLength={255} />)}
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

formCustomerType.propTypes = {
  form: PropTypes.object.isRequired,
  disabled: PropTypes.string,
  item: PropTypes.object,
  onSubmit: PropTypes.func,
  showSellPrice: PropTypes.func,
  button: PropTypes.string,
  listSellprice: PropTypes.object
}

export default Form.create()(formCustomerType)
