import React from 'react'
import { Form, Button, DatePicker, Col, Row, message } from 'antd'
import moment from 'moment'

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

const column = {
  xs: { span: 24 },
  sm: { span: 24 },
  md: { span: 24 },
  lg: { span: 8 },
  xl: { span: 8 }
}

const buttonColumnProps = {
  xs: 24,
  sm: 24,
  md: 10,
  lg: 8,
  xl: 8
}

const FormAutoCounter = ({
  // showImportModal,
  onSubmit,
  currentMerchant,
  loading,
  query,
  form: {
    getFieldDecorator,
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
      if (currentMerchant === null) {
        message.error('merchantId null, please select store has merchantId')
        return
      }

      onSubmit({
        transactionDate: moment(data.rangePicker).format('YYYY-MM-DD'),
        recordSource: ['TC', 'TD'],
        merchantId: currentMerchant.merchantId
      })
    })
  }

  return (
    <div>
      <Form layout="horizontal">
        <Row>
          <Col {...column}>
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
          <Col {...buttonColumnProps}>
            <FormItem>
              <Button type="primary" icon="check" onClick={() => handleSubmit()} loading={loading.effects['autorecon/autoRecon'] || loading.effects['autorecon/add']}>Query</Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
    </div >
  )
}

export default Form.create()(FormAutoCounter)
