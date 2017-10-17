/**
 * Created by Veirry on 22/09/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { Form, Modal, Input, DatePicker } from 'antd'
import moment from 'moment'

const { TextArea } = Input
const FormItem = Form.Item
const dateFormat = 'YYYY-MM-DD'

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
  const startDate = moment(accountActive.startPeriod).format(dateFormat)
  const endPeriod = moment(moment(startDate).endOf('month')).format(dateFormat)
  const now = moment().format(dateFormat)
  let uiDate
  if (now >= endPeriod) {
    uiDate = endPeriod
  }
  const handleOk = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue(),
      }
      if (now >= endPeriod) {
        data.endPeriod = endPeriod
        onOk(data)
      } else {
        data.endPeriod = endPeriod
        Modal.warning({
          title: 'Period is not over yet',
          content: `${now} is not end of this period`,
        })
      }
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
            initialValue: accountActive.accountActive,
            rules: [
              {
                required: true,
              },
            ],
          })(<Input disabled />)}
        </FormItem>
        <FormItem label="EndDate" {...formItemLayout}>
          {getFieldDecorator('endPeriod', {
            initialValue: moment.utc(moment(uiDate).format('YYYY-MM-DD'), dateFormat),
            rules: [
              {
                required: false,
              },
            ],
          })(<DatePicker disabled format="YYYY-MM-DD" />)}
        </FormItem>
        <FormItem label="Memo" {...formItemLayout}>
          {getFieldDecorator('memo', {
            rules: [
              {
                required: false,
              },
            ],
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
  accountActive: PropTypes.string.isRequired,
}

export default Form.create()(modal)
