import React from 'react'
import { Form, Button, DatePicker, Row, Col } from 'antd'
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
  query,
  form: {
    getFieldDecorator,
    resetFields,
    validateFields,
    getFieldsValue
  }
}) => {
  const handleSubmit = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue()
      }
      let storeId = lstorage.getCurrentUserStore()
      onSortNullMdrAmount({
        payment: { storeId, transDate: moment(data.rangePicker).format('YYYY-MM-DD') },
        paymentImportBca: {
          transactionDate: moment(data.rangePicker).format('YYYY-MM-DD'),
          recordSource: ['TC', 'TD'],
          storeId,
          type: 'all'
        }
      })
      // onQueryPosPayment({ storeId, transDate: moment(data.rangePicker).format('YYYY-MM-DD') })
      // onSubmit({
      //   transactionDate: moment(data.rangePicker).format('YYYY-MM-DD'),
      //   recordSource: ['TC', 'TD'],
      //   storeId,
      //   type: 'all'
      // })
    })
  }

  const handleReset = () => {
    onClearListImportCSVAndPayment()
    resetFields()
  }

  const handleSubmitBcaRecon = (params) => {
    dispatch({
      type: 'importBcaRecon/submitBcaRecon',
      payload: {
        ...params
      }
    })
  }

  return (
    <div>
      <Form layout="horizontal">
        <Row>
          <Col span={8}>
            <FormItem label="Date" hasFeedback {...formItemLayout}>
              {getFieldDecorator('rangePicker', {
                initialValue: query && query.from && query.to ? [moment.utc(query.from, 'YYYY-MM-DD'), moment.utc(query.to, 'YYYY-MM-DD')] : null,
                rules: [{
                  required: true,
                  message: 'Required'
                }]
              })(
                <DatePicker defaultValue={moment()} size="large" format="DD-MMM-YYYY" />
              )}
            </FormItem>
          </Col>
          <Col span={3}>
            <FormItem>
              <Button type="primary" icon="check" onClick={() => handleSubmit()} loading={loading.effects['importBcaRecon/sortNullMdrAmount']}>Query</Button>
            </FormItem>
          </Col>
          <Col span={3}>
            <FormItem>
              <Button type="secondary" onClick={() => handleReset()} loading={loading.effects['importBcaRecon/reset']}>Reset</Button>
            </FormItem>
          </Col>
          <Col span={3}>
            <FormItem>
              <Button type="secondary" onClick={() => handleSubmitBcaRecon()} loading={loading.effects['importBcaRecon/submitBcaRecon']}>SUBMIT</Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
    </div>
  )
}

export default Form.create()(FormAutoCounter)
