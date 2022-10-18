/**
 * Created by Veirry on 22/09/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { Form, Modal, Button, Input, DatePicker } from 'antd'
import moment from 'moment'

const { TextArea } = Input
const FormItem = Form.Item
const dateFormat = 'YYYY-MM-DD'

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 14 }
}

const ModalClose = ({
  onOk,
  onCancel,
  loading,
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
        ...getFieldsValue()
      }
      if (now >= endPeriod) {
        data.endPeriod = endPeriod
        data.storeId = accountActive.storeId
        onOk(data)
      } else {
        data.endPeriod = endPeriod
        Modal.warning({
          title: 'Period is not over yet',
          content: `${now} is not end of this period`
        })
      }
    })
  }
  const modalOpts = {
    ...modalProps,
    onOk: handleOk,
    onCancel
  }
  return (
    <Modal
      confirmLoading={loading.effects['period/end']}
      footer={[
        <Button onClick={() => onCancel()} >Cancel</Button>,
        <Button disabled={loading.effects['period/end']} key="submit" onClick={() => handleOk()} type="primary" >Close</Button>
        // <Button key="submit" onClick={() => handleOk()} type="primary" >Close</Button>
      ]}
      {...modalOpts}
    >
      <Form layout="horizontal">
        <FormItem label="Account Number" {...formItemLayout}>
          {getFieldDecorator('accountNumber', {
            initialValue: accountActive.accountActive,
            rules: [
              {
                required: true
              }
            ]
          })(<Input disabled />)}
        </FormItem>
        <FormItem label="EndDate" {...formItemLayout}>
          {getFieldDecorator('endPeriod', {
            initialValue: moment.utc(moment(uiDate).format('YYYY-MM-DD'), dateFormat),
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
                required: true
              }
            ]
          })(<TextArea maxLength={100} autosize={{ minRows: 2, maxRows: 6 }} />)}
        </FormItem>
      </Form>
    </Modal>
  )
}

ModalClose.propTypes = {
  form: PropTypes.isRequired,
  periodDate: PropTypes.isRequired,
  onOk: PropTypes.func.isRequired,
  accountActive: PropTypes.string.isRequired
}

export default Form.create()(ModalClose)
