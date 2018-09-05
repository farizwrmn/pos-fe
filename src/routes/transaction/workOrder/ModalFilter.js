import React from 'react'
import { Form, Modal, DatePicker, Select } from 'antd'
import moment from 'moment'

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
    if (data.transDate) {
      data.transDate = data.transDate.map(x => moment(x).format('YYYY-MM-DD'))
    }
    if (data.woDate) {
      data.woDate = data.woDate.map(x => moment(x).format('YYYY-MM-DD'))
    }
    onCheckDataSubmit(data)
  }
  return (
    <Modal {...modalProps} onOk={submitFilter}>
      <Form layout="horizontal">
        <FormItem label="Trans Date" {...formItemLayout}>
          {getFieldDecorator('transDate', {
            rules: [
              {
                required: false
              }
            ]
          })(
            <RangePicker format="YYYY-MM-DD" allowClear={false} disabledDate={disabledDate} />
          )}
        </FormItem>
        <FormItem label="WO Date" {...formItemLayout}>
          {getFieldDecorator('woDate', {
            rules: [
              {
                required: true
              }
            ]
          })(
            <RangePicker format="YYYY-MM-DD" allowClear={false} disabledDate={disabledDate} />
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
      </Form>
    </Modal>
  )
}

export default Form.create()(ModalFilter)
