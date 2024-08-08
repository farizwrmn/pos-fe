import React from 'react'
import { Form, Button, DatePicker, Row, Col, Modal } from 'antd'
import moment from 'moment'
import { lstorage } from 'utils'

const FormItem = Form.Item

const formItemLayout = {
  labelCol: {
    xs: { span: 8 },
    sm: { span: 7 },
    md: { span: 7 },
    lg: { span: 7 },
    xl: { span: 7 }
  },
  wrapperCol: {
    xs: { span: 16 },
    sm: { span: 14 },
    md: { span: 14 },
    lg: { span: 14 },
    xl: { span: 14 }
  }
}

const FormAutoCounter = ({
  onSortNullMdrAmount,
  onFilterReportDate,
  onClearListImportCSVAndPayment,
  query,
  location,
  dispatch,
  loading,
  form: {
    getFieldValue,
    getFieldDecorator,
    resetFields,
    validateFields,
    getFieldsValue
  }
}) => {
  const handleSubmit = (value) => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      let storeId = lstorage.getCurrentUserStore()
      onSortNullMdrAmount({
        payment: { storeId, transDate: moment(value).format('YYYY-MM-DD') },
        paymentImportBca: {
          transactionDate: moment(value).format('YYYY-MM-DD'),
          recordSource: ['TC', 'TD', 'TQ', 'PC', 'PD', 'PQ'],
          storeId,
          type: 'all'
        }
      })
    })
  }

  const handleReset = () => {
    onClearListImportCSVAndPayment()
    resetFields()
  }


  const handleSubmitBcaRecon = (params) => {
    let data = getFieldsValue()
    const requestData = {
      location,
      transDate: data.rangePicker,
      ...params
    }
    dispatch({
      type: 'importBcaRecon/submitRecon',
      payload: requestData
    })
  }

  const handleModal = () => {
    Modal.confirm({
      title: 'Submit',
      content: 'Are you sure to submit the recon ?',
      onOk () {
        handleSubmitBcaRecon()
      }
    })
  }

  const handeReportDate = (reportDate) => {
    console.log('reportDate', reportDate)
    onFilterReportDate(reportDate)
  }

  return (
    <div>
      <Form layout="horizontal">
        <Row>
          <Col span={4}>
            <FormItem label="Trans Date" hasFeedback {...formItemLayout}>
              {getFieldDecorator('rangePicker', {
                initialValue: query && query.transDate ? moment.utc(query.transDate, 'YYYY-MM-DD') : null
              })(
                <DatePicker
                  disabled={getFieldValue('rangePicker')}
                  onChange={(value, dateString) => handleSubmit(dateString)}
                  size="large"
                  format="DD-MMM-YYYY"
                />
              )}
            </FormItem>
            <FormItem label="Report Date" hasFeedback {...formItemLayout}>
              {getFieldDecorator('reportDate')(
                <DatePicker
                  onChange={(value, dateString) => handeReportDate(dateString)}
                  size="large"
                  format="YYYY-MM-DD"
                />
              )}
            </FormItem>
          </Col>
          <Col span={18}>
            <FormItem>
              <Button type="secondary" onClick={() => handleReset()} loading={loading.effects['importBcaRecon/reset']}>Reset</Button>
            </FormItem>
          </Col>
          <Col span={2}>
            <FormItem>
              <Button
                type="primary"
                disabled={loading.effects['importBcaRecon/submitRecon']}
                onClick={() => handleModal()}
                loading={loading.effects['importBcaRecon/submitRecon']}
              >
                Submit
              </Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
    </div>
  )
}

export default Form.create()(FormAutoCounter)
