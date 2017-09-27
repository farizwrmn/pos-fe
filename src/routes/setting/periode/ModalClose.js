/**
 * Created by Veirry on 22/09/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { Form, Modal, Input, DatePicker } from 'antd'
import moment from 'moment'

const FormItem = Form.Item
const dateFormat = 'YYYY/MM/DD hh:mm:ss'

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 14 },
}

const modal = ({
  onOk,
  accountActive,
  form: { getFieldDecorator, validateFields, getFieldsValue },
  ...modalProps
}) => {
  const handleOk = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue(),
      }
      console.log(data)
      onOk(data)
    })
  }
  const modalOpts = {
    ...modalProps,
    onOk: handleOk,
  }

  return (
    <Modal {...modalOpts}>
      <Form layout="horizontal">
        <FormItem label="Account Number" {...formItemLayout}>
          {getFieldDecorator('accountNumber', {
            initialValue: accountActive,
            rules: [
              {
                required: true,
              },
            ],
          })(<Input disabled />)}
        </FormItem>
        <FormItem label="EndDate" {...formItemLayout}>
          {getFieldDecorator('endPeriod', {
            initialValue: moment.utc(moment().format(dateFormat), dateFormat),
            rules: [
              {
                required: false,
              },
            ],
          })(<DatePicker disabled format="YYYY-MM-DD" />)}
        </FormItem>
      </Form>
    </Modal>
  )
}

modal.propTypes = {
  form: PropTypes.isRequired,
  periodDate: PropTypes.isRequired,
  onOk: PropTypes.func.isRequired,
  accountActive: PropTypes.string.isRequired,
}

export default Form.create()(modal)
