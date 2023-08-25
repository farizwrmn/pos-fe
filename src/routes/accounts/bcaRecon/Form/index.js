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
  onClearListImportCSVAndPayment,
  dispatch,
  loading,
  form: {
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
          recordSource: ['TC', 'TD'],
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
    dispatch({
      type: 'importBcaRecon/submitRecon',
      payload: {
        transDate: data.rangePicker,
        ...params
      }
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

  return (
    <div>
      <Form layout="horizontal">
        <Row>
          <Col span={4}>
            <FormItem label="Date" hasFeedback {...formItemLayout}>
              {getFieldDecorator('rangePicker')(
                <DatePicker onChange={(value, dateString) => handleSubmit(dateString)} defaultValue={moment()} size="large" format="DD-MMM-YYYY" />
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
