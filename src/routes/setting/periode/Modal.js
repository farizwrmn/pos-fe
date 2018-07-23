/**
 * Created by Veirry on 22/09/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { Form, Modal, Input, DatePicker } from 'antd'
import moment from 'moment'

const { TextArea } = Input
const FormItem = Form.Item
const dateFormat = 'YYYY/MM/DD HH:mm:ss'

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 14 }
}

const modal = ({
  onOk,
  periodDate,
  accountNumber,
  form: { getFieldDecorator, validateFields, getFieldsValue },
  ...modalProps
}) => {
  const handleOk = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue()
      }
      onOk(data)
    })
  }
  const modalOpts = {
    ...modalProps,
    onOk: handleOk
  }

  return (
    <Modal {...modalOpts}>
      <Form layout="horizontal">
        <FormItem label="Account Number" {...formItemLayout}>
          {getFieldDecorator('accountNumber', {
            initialValue: accountNumber,
            rules: [
              {
                required: true
              }
            ]
          })(<Input disabled />)}
        </FormItem>
        <FormItem label="Reference" {...formItemLayout}>
          {getFieldDecorator('reference', {
            rules: [
              {
                required: true
              }
            ]
          })(<Input maxLength={40} />)}
        </FormItem>
        <FormItem label="StartDate" {...formItemLayout}>
          {getFieldDecorator('startPeriod', {
            initialValue: moment.utc(periodDate.startDate, dateFormat),
            rules: [
              {
                required: false
              }
            ]
          })(<DatePicker disabled format="YYYY-MM-DD" />)}
        </FormItem>
        <FormItem label="EndDate" {...formItemLayout}>
          {getFieldDecorator('endPeriod', {
            rules: [
              {
                required: false
              }
            ]
          })(<DatePicker disabled format="YYYY-MM-DD" />)}
        </FormItem>
        <FormItem label="Memo" {...formItemLayout}>
          {getFieldDecorator('memo', {
            rules: [
              {
                required: false
              }
            ]
          })(<TextArea maxLength={100} autosize={{ minRows: 2, maxRows: 6 }} />)}
        </FormItem>
      </Form>
    </Modal>
  )
}

modal.propTypes = {
  form: PropTypes.isRequired,
  periodDate: PropTypes.isRequired,
  onOk: PropTypes.func.isRequired,
  accountNumber: PropTypes.string.isRequired
}

export default Form.create()(modal)
