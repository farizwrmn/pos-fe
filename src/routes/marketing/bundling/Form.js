import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Button, Row, Col, Tree, Select, DatePicker, TimePicker, Checkbox, Modal } from 'antd'
import moment from 'moment'

const Option = Select.Option
const TreeNode = Tree.TreeNode
const FormItem = Form.Item
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
  listAllStores = [],
  onSubmit,
  onCancel,
  modalType,
  button,
  form: {
    getFieldDecorator,
    validateFieldsAndScroll,
    getFieldsValue,
    getFieldValue,
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
    validateFieldsAndScroll((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue()
      }
      data.startDate = (data.Date || []).length > 0 ? data.Date[0] : null
      data.endDate = (data.Date || []).length > 0 ? data.Date[1] : null
      data.availableDate = (data.availableDate || []).length > 0 ? data.availableDate.toString() : null
      data.availableStore = (data.availableStore || []).length > 0 ? data.availableStore.toString() : null
      data.startHour = data.startHour ? moment(data.startHour).format('HH:mm') : null
      data.endHour = data.endHour ? moment(data.endHour).format('HH:mm') : null
      console.log('data', moment(data.availableHour))
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
    })
  }

  const renderTreeNodes = (data) => {
    return data.map((item) => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key} dataRef={item}>
            {renderTreeNodes(item.children)}
          </TreeNode>
        )
      }
      return <TreeNode {...item} />
    })
  }
  let childrenTransNo = listAllStores.length > 0 ? listAllStores.map(x => (<Option key={x.id}>{x.storeName}</Option>)) : []
  return (
    <Form layout="horizontal">
      <Row>
        <Col {...column}>
          <FormItem label="Type" hasFeedback {...formItemLayout}>
            {getFieldDecorator('type', {
              initialValue: item.type,
              rules: [
                {
                  required: true
                }
              ]
            })(
              <Select>
                <Option value="0">Buy X Get Y</Option>
                <Option value="1">Buy X Get Discount Y</Option>
              </Select>
            )}
          </FormItem>
          <FormItem label="Code" hasFeedback {...formItemLayout}>
            {getFieldDecorator('code', {
              initialValue: item.code,
              rules: [
                {
                  required: true,
                  pattern: /^[a-z0-9-/]{3,10}$/i
                }
              ]
            })(<Input maxLength={50} />)}
          </FormItem>
          <FormItem label="Promo Name" hasFeedback {...formItemLayout}>
            {getFieldDecorator('name', {
              initialValue: item.name,
              rules: [
                {
                  required: true
                }
              ]
            })(<Input maxLength={50} />)}
          </FormItem>
          <FormItem label="Available Date" hasFeedback {...formItemLayout}>
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
            })(<RangePicker allowClear />)}
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
              <Option value="0">Sunday</Option>
              <Option value="1">Monday</Option>
              <Option value="2">Tuesday</Option>
              <Option value="3">Wednesday</Option>
              <Option value="4">Thursday</Option>
              <Option value="5">Friday</Option>
              <Option value="6">Saturday</Option>
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
                placeholder="Choose StoreId"
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              >
                {childrenTransNo}
              </Select>
            )}
          </FormItem>
          <FormItem label="Apply Multiple" hasFeedback {...formItemLayout}>
            {getFieldDecorator('applyMultiple', {
              initialValue: Number(item.applyMultiple),
              rules: [
                {
                  required: true
                }
              ]
            })(<Checkbox defaultChecked={Number(item.applyMultiple)} />)}
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
