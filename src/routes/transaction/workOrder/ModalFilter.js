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
    getFieldsValue,
    getFieldValue
  }
}) => {
  const submitFilter = () => {
    let data = getFieldsValue()
    if (data.period.length) {
      data.start = moment(data.period[0]).format('YYYY-MM-DD')
      data.end = moment(data.period[1]).format('YYYY-MM-DD')
    }
    if (data.timeIn) {
      data.timeIn[0] = moment(data.timeIn[0]).format('YYYY-MM-DD')
      data.timeIn[1] = moment(data.timeIn[1]).format('YYYY-MM-DD')
    }
    if (data.timeOut) {
      data.timeOut[0] = moment(data.timeOut[0]).format('YYYY-MM-DD')
      data.timeOut[1] = moment(data.timeOut[1]).format('YYYY-MM-DD')
    }
    delete data.period
    if (!data.status) data.status = [0, 1]
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
        <FormItem label="Status"
          hasFeedback
          help={(getFieldValue('status') || '').length > 0 ? `${(getFieldValue('status') || '').length} status` : 'clear all for selecting all status'}
          {...formItemLayout}
        >
          {getFieldDecorator('status')(
            <Select mode="multiple" allowClear>
              <Option value="0" >In Progress</Option>
              <Option value="1" >Done</Option>
            </Select>
          )}
        </FormItem>
        <FormItem label="Time In" hasFeedback {...formItemLayout}>
          {getFieldDecorator('timeIn')(
            <RangePicker />
          )}
        </FormItem>
        <FormItem label="Time Out" hasFeedback {...formItemLayout}>
          {getFieldDecorator('timeOut')(
            <RangePicker />
          )}
        </FormItem>
      </Form>
    </Modal>
  )
}

export default Form.create()(ModalFilter)
