import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Select, TimePicker, DatePicker, Button, Row, Col, Modal } from 'antd'
import moment from 'moment'

const FormItem = Form.Item
const { Option } = Select
const { RangePicker } = DatePicker

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

const formProductBrand = ({
  item = {},
  onSubmit,
  disabled,
  modalType,
  onCancel,
  button,
  listAllStores = [],
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    getFieldValue,
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
          onSubmit(data.brandCode, data)
          // setTimeout(() => {
          resetFields()
          // }, 500)
        },
        onCancel () { }
      })
    })
  }

  const disabledDate = (current) => {
    // Can not select days before today and today
    return current && current < moment().startOf('day')
  }

  let childrenStore = listAllStores.length > 0 ? listAllStores.map(x => (<Option key={x.id}>{x.storeName}</Option>)) : []

  return (
    <Form layout="horizontal">
      <Row>
        <Col {...column}>
          <FormItem label="Name" hasFeedback {...formItemLayout}>
            {getFieldDecorator('name', {
              initialValue: item.name,
              rules: [
                {
                  required: true,
                  pattern: /^.{3,20}$/,
                  message: 'Name must be between 3 and 20 characters'
                }
              ]
            })(<Input />)}
          </FormItem>
          <FormItem label="Shortcut Code" hasFeedback {...formItemLayout}>
            {getFieldDecorator('shortcutCode', {
              initialValue: item.shortcutCode,
              rules: [
                {
                  required: true,
                  pattern: /^[0-9]{3}$/,
                  message: 'Shortcut must be 3 characters'
                }
              ]
            })(<Input />)}
          </FormItem>
          <FormItem label="Available Period" hasFeedback {...formItemLayout}>
            {getFieldDecorator('Date', {
              initialValue: item.startDate ? [
                moment(item.startDate),
                moment(item.endDate)
              ] : null,
              rules: [
                {
                  required: true
                }
              ]
            })(<RangePicker disabledDate={disabledDate} allowClear />)}
          </FormItem>
          <FormItem label="Available Hour" hasFeedback {...formItemLayout}>
            <Row gutter={12}>
              <Col span={12}>
                {getFieldDecorator('startHour', {
                  initialValue: item.startHour ? moment(item.startHour, 'HH:mm') : moment('00:00', 'HH:mm'),
                  rules: [
                    {
                      required: false
                    }
                  ]
                })(<TimePicker defaultValue={moment('00:00', 'HH:mm')} style={{ width: '100%' }} allowClear format={'HH:mm'} />)}
              </Col>
              <Col span={12}>
                {getFieldDecorator('endHour', {
                  initialValue: item.endHour ? moment(item.endHour, 'HH:mm') : moment('23:59', 'HH:mm'),
                  rules: [
                    {
                      required: false
                    }
                  ]
                })(<TimePicker defaultValue={moment('23:59', 'HH:mm')} style={{ width: '100%' }} allowClear format={'HH:mm'} />)}
              </Col>
            </Row>
          </FormItem>
          <FormItem
            label="Available Days"
            hasFeedback
            help={(getFieldValue('availableDate') || '').length > 0 ? `${(getFieldValue('availableDate') || '').length} ${(getFieldValue('availableDate') || '').length === 1 ? 'day' : 'days'}` : 'clear it if available every day'}
            {...formItemLayout}
          >
            {getFieldDecorator('availableDate', {
              initialValue: item.availableDate ? (item.availableDate || '').split(',') : [],
              rules: [
                {
                  required: false
                }
              ]
            })(<Select style={{ width: '100%' }} mode="multiple" allowClear size="large">
              <Option value="1">Monday</Option>
              <Option value="2">Tuesday</Option>
              <Option value="3">Wednesday</Option>
              <Option value="4">Thursday</Option>
              <Option value="5">Friday</Option>
              <Option value="6">Saturday</Option>
              <Option value="7">Sunday</Option>
            </Select>)}
          </FormItem>
          <FormItem
            label="Store"
            hasFeedback
            help={(getFieldValue('availableStore') || '').length > 0 ? `${(getFieldValue('availableStore') || '').length} ${(getFieldValue('availableStore') || '').length === 1 ? 'store' : 'stores'}` : 'clear it if available all stores'}
            {...formItemLayout}
          >
            {getFieldDecorator('availableStore', {
              initialValue: item.availableStore ? (item.availableStore || '').split(',') : []
            })(
              <Select
                mode="multiple"
                allowClear
                size="large"
                style={{ width: '100%' }}
                placeholder="Choose Store"
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              >
                {childrenStore}
              </Select>
            )}
          </FormItem>
          <FormItem {...tailFormItemLayout}>
            {modalType === 'edit' && <Button type="danger" style={{ margin: '0 10px' }} onClick={handleCancel}>Cancel</Button>}
            <Button type="primary" disabled={disabled} onClick={handleSubmit}>{button}</Button>
          </FormItem>
        </Col>
      </Row>
    </Form>
  )
}

formProductBrand.propTypes = {
  form: PropTypes.object.isRequired,
  disabled: PropTypes.boolean,
  item: PropTypes.object,
  onSubmit: PropTypes.func,
  button: PropTypes.string
}

export default Form.create()(formProductBrand)
