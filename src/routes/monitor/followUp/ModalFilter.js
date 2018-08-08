import React from 'react'
import moment from 'moment'
import { Form, Modal, DatePicker, Select } from 'antd'

const FormItem = Form.Item
const { RangePicker } = DatePicker
const Option = Select.Option

const formItemLayout = {
  labelCol: {
    span: 8
  },
  wrapperCol: {
    span: 10
  }
}

const ModalFilter = ({
  ...modalProps,
  disabledDate,
  onCheckDataSubmit,
  form: {
    getFieldDecorator,
    getFieldsValue
  }
}) => {
  const submitFilter = () => {
    let data = getFieldsValue()
    if (data.period.length) {
      data.start = moment(data.period[0]).format('YYYY-MM-DD')
      data.end = moment(data.period[1]).format('YYYY-MM-DD')
    }
    if (data.nextCall) {
      data.nextCall[0] = moment(data.nextCall[0]).format('YYYY-MM-DD')
      data.nextCall[1] = moment(data.nextCall[1]).format('YYYY-MM-DD')
    }
    if (data.postService) {
      data.postService[0] = moment(data.postService[0]).format('YYYY-MM-DD')
      data.postService[1] = moment(data.postService[1]).format('YYYY-MM-DD')
    }
    delete data.period
    onCheckDataSubmit(data)
  }
  return (
    <Modal {...modalProps} onOk={submitFilter}>
      <Form layout="horizontal">
        <FormItem label="Period" {...formItemLayout}>
          {getFieldDecorator('period', {
            initialValue: [moment().startOf('month'), moment(new Date(), 'YYYY-MM-DD')]
          })(
            <RangePicker allowClear={false} disabledDate={disabledDate} />
          )}
        </FormItem>
        <FormItem label="Status" hasFeedback {...formItemLayout}>
          {getFieldDecorator('status', {
            initialValue: '0'
          })(
            <Select allowClear>
              <Option value="0" >Not Called</Option>
              <Option value="1" >Called</Option>
              <Option value="2" >In Progress</Option>
              <Option value="3" >Pending</Option>
              <Option value="4" >Never</Option>
            </Select>
          )}
        </FormItem>
        <FormItem label="Next Call" hasFeedback {...formItemLayout}>
          {getFieldDecorator('nextCall')(
            <RangePicker />
          )}
        </FormItem>
        <FormItem label="Post Service" hasFeedback {...formItemLayout}>
          {getFieldDecorator('postService')(
            <RangePicker />
          )}
        </FormItem>
      </Form>
    </Modal>
  )
}

export default Form.create()(ModalFilter)
