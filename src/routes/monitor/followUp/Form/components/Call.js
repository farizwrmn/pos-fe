import React from 'react'
import { Form, Row, Col, Input, DatePicker, Button } from 'antd'
import moment from 'moment'
import DataTable from './DataTable'
import ModalFeedback from './ModalFeedback'

const FormItem = Form.Item
const { TextArea } = Input

const columns = {
  xs: { span: 24 },
  sm: { span: 12 },
  md: { span: 12 },
  lg: { span: 12 }
}

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 10 },
    md: { span: 7 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
    md: { span: 14 }
  }
}

const Call = ({
  details,
  memberInfo,
  modalFeedback,
  currentFeedback,
  showModalFeedback,
  submitFeedbackItem,
  itemFeedbacks,
  updateNextServiceAndCustomerSatisfaction,
  nextStep,
  showModalPending,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue
  }
}) => {
  const tableProps = {
    dataSource: details,
    pagination: false,
    headers: ['Type', 'Promo', 'Item', 'Qty', 'Total'],
    onRowClick (record) {
      if (!memberInfo.customerSatisfaction) showModalFeedback(record)
    }
  }

  const submitCall = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = getFieldsValue()
      let postService
      if (data.postService) postService = moment(data.postService).format('YYYY-MM-DD')
      let header = { postService, customerSatisfaction: data.customerSatisfaction }
      updateNextServiceAndCustomerSatisfaction(header)
    })
  }

  const modalProps = {
    title: 'Feedback',
    visible: modalFeedback,
    currentFeedback,
    submitFeedbackItem,
    onCancel () {
      showModalFeedback()
    }
  }

  return (
    <div>
      {modalFeedback && <ModalFeedback {...modalProps} />}
      <Row style={{ marginTop: 20 }}>
        <Col {...columns}>
          <FormItem label="Customer Satisfaction" hasFeedback {...formItemLayout}>
            {getFieldDecorator('customerSatisfaction', {
              initialValue: memberInfo.customerSatisfaction,
              rules: [{
                required: true
              }]
            })(<TextArea disabled={memberInfo.customerSatisfaction} rows={3} />)}
          </FormItem>
          <FormItem label="Post-Service Date" hasFeedback {...formItemLayout}>
            {getFieldDecorator('postService', {
              initialValue: memberInfo.postService ? moment(memberInfo.postService) : null,
              rules: [{
                required: !_.isEmpty(itemFeedbacks)
              }]
            })(<DatePicker
              format="DD-MMM-YYYY"
              disabled={memberInfo.postService}
            />)}
          </FormItem>
        </Col>
        <Col {...columns}>
          <DataTable {...tableProps} />
        </Col>
      </Row>
      <Button className="button-right-side" size="large" onClick={memberInfo.customerSatisfaction ? () => nextStep(2) : submitCall}>{memberInfo.customerSatisfaction ? 'Next' : 'Submit'}</Button>
      {memberInfo.status !== '1' && <Button className="button-right-side" size="large" onClick={showModalPending}>Pending</Button>}
    </div>
  )
}

export default Form.create()(Call)

