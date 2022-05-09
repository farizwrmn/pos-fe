import React, { Component } from 'react'
import { Modal, Button, Select, Input, InputNumber, DatePicker, Form } from 'antd'

import moment from 'moment'

const { TextArea } = Input
const { Option } = Select
const FormItem = Form.Item

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 14 }
}

class ModalCancel extends Component {
  state = {
    endOpen: false
  }

  handleStartOpenChange = (open) => {
    if (!open) {
      this.setState({ endOpen: true })
    }
  }

  handleEndOpenChange = (open) => {
    this.setState({ endOpen: open })
  }

  render () {
    const {
      listAllStores,
      form: { getFieldDecorator, getFieldValue, validateFields, getFieldsValue, resetFields },
      onOk,
      onCancel,
      onDelete,
      item,
      ...modalProps
    } = this.props
    const handleDelete = () => {
      Modal.confirm({
        title: 'Delete campaign ?',
        content: 'Are you sure ?',
        onOk () {
          onDelete()
        },
        onCancel () {
          console.log('deleteCampaign')
        }
      })
    }
    const handleOk = () => {
      validateFields((errors) => {
        if (errors) {
          return
        }

        const data = {
          ...getFieldsValue()
        }
        data.id = item.id
        Modal.confirm({
          title: 'Delete this item',
          content: 'This action cannot be undone. Are you sure ?',
          onOk () {
            onOk(data, resetFields)
          }
        })
        // handleProductBrowse()
      })
    }

    const modalOpts = {
      ...modalProps,
      onOk: handleOk
    }

    let childrenStore = listAllStores.length > 0 ? listAllStores.map(x => (<Option key={x.id}>{x.storeName}</Option>)) : []

    const { endOpen } = this.state

    return (
      <Modal
        {...modalOpts}
        onCancel={onCancel}
        footer={[
          <Button size="large" key="back" onClick={onCancel}>Cancel</Button>,
          <Button size="large" key="delete" type="danger" onClick={handleDelete}>Delete</Button>,
          <Button size="large" key="submit" type="primary" onClick={handleOk}>
            Ok
          </Button>
        ]}
      >
        <Form layout="horizontal">
          <FormItem label="Campaign Name" hasFeedback {...formItemLayout}>
            {getFieldDecorator('name', {
              initialValue: item.name,
              rules: [
                {
                  required: true
                }
              ]
            })(<Input maxLength={255} />)}
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
          <FormItem label="Start Period" hasFeedback {...formItemLayout}>
            {getFieldDecorator('conditionsStartTime', {
              initialValue: item.conditionsStartTime,
              rules: [
                {
                  required: true
                }
              ]
            })(
              <DatePicker
                disabledDate={(startValue) => {
                  const endValue = getFieldValue('conditionsEndTime')
                  if (!startValue || !endValue) {
                    return startValue < moment().startOf('day')
                  }
                  return startValue < moment().startOf('day') || startValue.valueOf() > endValue.valueOf()
                }}
                showTime
                format="YYYY-MM-DD HH:mm:ss"
                placeholder="Start"
                onOpenChange={this.handleStartOpenChange}
              />
            )}
          </FormItem>
          <FormItem label="End Period" hasFeedback {...formItemLayout}>
            {getFieldDecorator('conditionsEndTime', {
              initialValue: item.conditionsEndTime,
              rules: [
                {
                  required: true
                }
              ]
            })(
              <DatePicker
                disabledDate={(endValue) => {
                  const startValue = getFieldValue('conditionsStartTime')
                  if (!endValue || !startValue) {
                    return endValue < moment().startOf('day')
                  }
                  return endValue < moment().startOf('day') || endValue.valueOf() <= startValue.valueOf()
                }}
                showTime
                format="YYYY-MM-DD HH:mm:ss"
                placeholder="End"
                onChange={this.onEndChange}
                open={endOpen}
                onOpenChange={this.handleEndOpenChange}
              />
            )}
          </FormItem>
          <FormItem label="Discount Type" hasFeedback {...formItemLayout}>
            {getFieldDecorator('discountType', {
              initialValue: item.discountType || 'net',
              rules: [
                {
                  required: true
                }
              ]
            })(
              <Select style={{ width: '100%' }} allowClear size="large">
                <Option value="net">Fixed Value</Option>
                <Option value="percentage">Percentage</Option>
              </Select>
            )}
          </FormItem>
          <FormItem label="Discount Cap" hasFeedback {...formItemLayout}>
            {getFieldDecorator('discountCap', {
              initialValue: item.discountCap || 0,
              rules: [
                {
                  required: true
                }
              ]
            })(<InputNumber style={{ width: '100%' }} min={0} />)}
          </FormItem>
          <FormItem label="Discount Value" hasFeedback {...formItemLayout}>
            {getFieldDecorator('discountValue', {
              initialValue: item.discountValue || 1,
              rules: [
                {
                  required: true
                }
              ]
            })(<InputNumber style={{ width: '100%' }} min={1} />)}
          </FormItem>
          <FormItem label="Quota Count" hasFeedback {...formItemLayout}>
            {getFieldDecorator('quotasTotalCount', {
              initialValue: item.quotasTotalCount || 1,
              rules: [
                {
                  required: true
                }
              ]
            })(<InputNumber style={{ width: '100%' }} min={1} max={999} />)}
          </FormItem>
          <FormItem label="Quota Count Per User" hasFeedback {...formItemLayout}>
            {getFieldDecorator('quotasTotalCountPerUser', {
              initialValue: item.quotasTotalCountPerUser || 1,
              rules: [
                {
                  required: true
                }
              ]
            })(<InputNumber style={{ width: '100%' }} min={1} max={999} />)}
          </FormItem>
          <FormItem label="Memo" {...formItemLayout}>
            {getFieldDecorator('memo', {
              rules: [
                {
                  required: true,
                  pattern: /^[a-z0-9/\n _-]{20,255}$/i,
                  message: 'Max 2000 character'
                }
              ]
            })(<TextArea maxLength={2000} autosize={{ minRows: 2, maxRows: 6 }} />)}
          </FormItem>
        </Form>
      </Modal>
    )
  }
}

export default Form.create()(ModalCancel)
