import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { Form, Input, Button, Row, Col, Modal, Card, Select, InputNumber, TimePicker, DatePicker } from 'antd'

const FormItem = Form.Item
const { Option } = Select
const { RangePicker } = DatePicker

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
  listAllStores,
  button,
  form: {
    getFieldValue,
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

  const disabledDate = (current) => {
    // Can not select days before today and today
    return current && current < moment().startOf('day')
  }

  const handleSubmit = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue()
      }
      const response = {
        incentiveCode: data.incentiveCode,
        incentiveName: data.incentiveName,
        startDate: (data.Date || []).length > 0 ? moment(data.Date[0]).format('YYYY-MM-DD') : null,
        endDate: (data.Date || []).length > 0 ? moment(data.Date[1]).format('YYYY-MM-DD') : null,
        startHour: data.startHour ? moment(data.startHour).format('HH:mm') : null,
        endHour: data.endHour ? moment(data.endHour).format('HH:mm') : null,
        rewardValue: data.rewardValue,
        productType: data.productType,
        productCode: data.productCode,
        availableDate: (data.availableDate || []).length > 0 ? data.availableDate : null,
        availableStore: (data.availableStore || []).length > 0 ? data.availableStore : null
      }
      Modal.confirm({
        title: 'Do you want to save this item?',
        onOk () {
          onSubmit(response, resetFields)
        },
        onCancel () { }
      })
    })
  }

  let childrenTransNo = listAllStores.length > 0 ? listAllStores.map(x => (<Option key={x.id}>{x.storeName}</Option>)) : []

  return (
    <Form layout="horizontal">
      <Card title="General Information" style={{ margin: '10px 0' }}>
        <Row>
          <Col {...column}>
            <FormItem label="Incentive Code" hasFeedback {...formItemLayout}>
              {getFieldDecorator('incentiveCode', {
                initialValue: item.incentiveCode,
                rules: [
                  {
                    required: true,
                    pattern: /^[a-z0-9-/]{3,50}$/i
                  }
                ]
              })(<Input maxLength={50} disabled />)}
            </FormItem>
            <FormItem label="Incentive Name" hasFeedback {...formItemLayout}>
              {getFieldDecorator('incentiveName', {
                initialValue: item.incentiveName,
                rules: [
                  {
                    required: true
                  }
                ]
              })(<Input maxLength={50} autoFocus />)}
            </FormItem>
          </Col>
          <Col {...column}>
            <FormItem label="Reward each item" hasFeedback {...formItemLayout}>
              {getFieldDecorator('rewardValue', {
                initialValue: item.rewardValue || 0,
                rules: [
                  {
                    required: true
                  }
                ]
              })(<InputNumber min={1} max={999999999} style={{ width: '100%' }} />)}
            </FormItem>
            <FormItem label="Type Product" hasFeedback {...formItemLayout}>
              {getFieldDecorator('productType', {
                initialValue: item.productType || 'PRODUCT',
                rules: [
                  {
                    required: true
                  }
                ]
              })(<Select>
                <Option value="PRODUCT">PRODUCT</Option>
                <Option value="SERVICE">SERVICE</Option>
                <Option value="BUNDLE">BUNDLE</Option>
              </Select>)}
            </FormItem>
            <FormItem label="Product Code" hasFeedback {...formItemLayout}>
              {getFieldDecorator('productCode', {
                initialValue: item.productCode,
                rules: [
                  {
                    required: true,
                    pattern: /^[a-z0-9-/]{3,50}$/i
                  }
                ]
              })(<Input maxLength={50} />)}
            </FormItem>
          </Col>
        </Row>
      </Card>
      <Card title="Store & Period Information" style={{ margin: '10px 0' }}>
        <Row>
          <Col {...column}>
            <FormItem
              label="Store"
              hasFeedback
              help={(getFieldValue('availableStore') || '').length > 0 ? `${(getFieldValue('availableStore') || '').length} ${(getFieldValue('availableStore') || '').length === 1 ? 'store' : 'stores'}` : 'clear it if available all stores'}
              {...formItemLayout}
            >
              {getFieldDecorator('availableStore', {
                initialValue: item.availableStore ? (item.availableStore || '').split(',') : [],
                rules: [
                  {
                    required: true
                  }
                ]
              })(
                <Select
                  mode="multiple"
                  allowClear
                  size="large"
                  style={{ width: '100%' }}
                  placeholder="Choose Store"
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                  {childrenTransNo}
                </Select>
              )}
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
          </Col>
          <Col {...column}>

            <FormItem label="Available Hour" hasFeedback {...formItemLayout}>
              <Row gutter={12}>
                <Col span={12}>
                  {getFieldDecorator('startHour', {
                    initialValue: item.startHour ? moment(item.startHour, 'HH:mm') : moment('00:00', 'HH:mm'),
                    rules: [
                      {
                        required: true
                      }
                    ]
                  })(<TimePicker defaultValue={moment('00:00', 'HH:mm')} style={{ width: '100%' }} allowClear format={'HH:mm'} />)}
                </Col>
                <Col span={12}>
                  {getFieldDecorator('endHour', {
                    initialValue: item.endHour ? moment(item.endHour, 'HH:mm') : moment('23:59', 'HH:mm'),
                    rules: [
                      {
                        required: true
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
                    required: true
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
          </Col>
        </Row>
      </Card>
      <FormItem {...tailFormItemLayout}>
        {modalType === 'edit' && <Button type="danger" style={{ margin: '0 10px' }} onClick={handleCancel}>Cancel</Button>}
        <Button type="primary" onClick={handleSubmit}>{button}</Button>
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
