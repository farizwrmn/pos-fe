import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, DatePicker, Checkbox, Button, Row, InputNumber, Col, Modal } from 'antd'

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
  dispatch,
  onSubmit,
  onCancel,
  modalType,
  button,
  listBox = [],
  form: {
    setFieldsValue,
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
      const data = getFieldsValue()
      console.log('data', data)
      Modal.confirm({
        title: 'Do you want to save this item?',
        onOk () {
          onSubmit(data, resetFields)
        },
        onCancel () { }
      })
    })
  }

  const setPrice = (event, code) => {
    const data = getFieldsValue()
    const finalList = listBox.map((item) => {
      if (item.box_code === code) {
        item.selected = event.target.checked
        return item
      }
      return item
    })
    dispatch({
      type: 'rentRequest/updateState',
      payload: {
        listBox: finalList
      }
    })
    const subtotal = finalList.filter(filtered => filtered.selected).reduce((prev, next) => prev + (next.price || 0), 0)
    setFieldsValue({
      price: subtotal,
      finalPrice: subtotal - (data.discount || 0)
    })
  }

  return (
    <Form layout="horizontal">
      <Row>
        <Col {...column}>
          <FormItem label="Vendor" hasFeedback {...formItemLayout}>
            {getFieldDecorator('vendorId', {
              initialValue: item.vendorId,
              rules: [
                {
                  required: true
                }
              ]
            })(<Input autoFocus />)}
          </FormItem>
          <FormItem label="Start Date" hasFeedback {...formItemLayout}>
            {getFieldDecorator('startDate', {
              initialValue: item.startDate,
              rules: [
                {
                  required: true
                }
              ]
            })(<DatePicker />)}
          </FormItem>
          <FormItem label="Period" hasFeedback {...formItemLayout}>
            {getFieldDecorator('period', {
              initialValue: item.period,
              rules: [
                {
                  required: true
                }
              ]
            })(<InputNumber

              min={0}
              max={100}
              style={{ width: '100%' }}
            />)}
          </FormItem>
          <FormItem label="Price" hasFeedback {...formItemLayout}>
            {getFieldDecorator('price', {
              initialValue: item.price,
              rules: [
                {
                  required: true
                }
              ]
            })(<InputNumber
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              min={0}
              max={9999999999}
              style={{ width: '100%' }}
            />)}
          </FormItem>
          <FormItem label="Discount" hasFeedback {...formItemLayout}>
            {getFieldDecorator('discount', {
              initialValue: item.discount,
              rules: [
                {
                  required: true
                }
              ]
            })(<InputNumber
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              min={0}
              max={9999999999}
              style={{ width: '100%' }}
            />)}
          </FormItem>
          <FormItem label="Final Price" hasFeedback {...formItemLayout}>
            {getFieldDecorator('finalPrice', {
              initialValue: item.finalPrice,
              rules: [
                {
                  required: true
                }
              ]
            })(<InputNumber
              disabled
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              min={0}
              max={9999999999}
              style={{ width: '100%' }}
            />)}
          </FormItem>
          <FormItem {...tailFormItemLayout}>
            {modalType === 'edit' && <Button type="danger" style={{ margin: '0 10px' }} onClick={handleCancel}>Cancel</Button>}
            <Button type="primary" onClick={handleSubmit}>{button}</Button>
          </FormItem>
        </Col>
        <Col {...column}>
          <Row>
            {listBox.map((item) => {
              return (
                <Col span={4}>
                  <FormItem {...formItemLayout}>
                    {getFieldDecorator(`box['${item.box_code}']`, {
                      initialValue: Boolean(item.selected),
                      valuePropName: 'checked'
                    })(<Checkbox onChange={event => setPrice(event, item.box_code)}>{`${item.box_code}\n${(item.price || '').toLocaleString()}`}</Checkbox>)}
                  </FormItem>
                </Col>
              )
            })}
          </Row>
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
