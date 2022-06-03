import React from 'react'
import PropTypes from 'prop-types'
import { Form, Button, DatePicker, Row, Col, Modal, message } from 'antd'
import moment from 'moment'

const FormItem = Form.Item

const { RangePicker } = DatePicker

const formItemLayout = {
  labelCol: {
    xs: { span: 8 },
    sm: { span: 8 },
    md: { span: 7 }
  },
  wrapperCol: {
    xs: { span: 16 },
    sm: { span: 14 },
    md: { span: 14 }
  }
}

const FormCounter = ({
  loading,
  onSubmitSales,
  onSubmitPurchase,
  form: {
    getFieldDecorator,
    getFieldsValue
  }
}) => {
  const handlePurchase = () => {
    const data = getFieldsValue()
    if (data.rangeDatePurchaseHeader && data.rangeDatePurchaseHeader.length === 2) {
      Modal.confirm({
        title: 'Do you want to reset this date?',
        onOk () {
          onSubmitPurchase({
            from: data.rangeDatePurchaseHeader[0].format('YYYY-MM-DD'),
            to: data.rangeDatePurchaseHeader[1].format('YYYY-MM-DD')
          })
        },
        onCancel () { }
      })
    } else {
      message.warning('Date is required')
    }
  }

  const handleSales = () => {
    const data = getFieldsValue()
    if (data.rangeDateSalesHeader && data.rangeDateSalesHeader.length === 2) {
      Modal.confirm({
        title: 'Do you want to reset this date?',
        onOk () {
          onSubmitSales({
            from: data.rangeDateSalesHeader[0].format('YYYY-MM-DD'),
            to: data.rangeDateSalesHeader[1].format('YYYY-MM-DD')
          })
        },
        onCancel () { }
      })
    } else {
      message.warning('Date is required')
    }
  }

  return (
    <Form layout="horizontal">
      <Row>
        <Col span={12}>
          <FormItem label="Sales" {...formItemLayout}>
            {getFieldDecorator('rangeDateSalesHeader', {
              initialValue: [moment().add('-1', 'months'), moment()]
            })(
              <RangePicker allowClear={false} size="large" format="DD-MMM-YYYY" />
            )}
          </FormItem>
        </Col>
        <Col span={12}>
          <Button
            type="primary"
            size="large"
            style={{ marginLeft: '5px' }}
            onClick={() => handleSales()}
            loading={loading.effects['taxReportMaintenance/queryPos']}
          >
            Submit
          </Button>
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <FormItem label="Purchase" {...formItemLayout}>
            {getFieldDecorator('rangeDatePurchaseHeader', {
              initialValue: [moment().add('-1', 'months'), moment()]
            })(
              <RangePicker allowClear={false} size="large" format="DD-MMM-YYYY" />
            )}
          </FormItem>
        </Col>
        <Col span={12}>
          <Button
            type="primary"
            size="large"
            style={{ marginLeft: '5px' }}
            onClick={() => handlePurchase()}
            loading={loading.effects['taxReportMaintenance/queryPurchase']}
          >
            Submit
          </Button>
        </Col>
      </Row>
    </Form>
  )
}

FormCounter.propTypes = {
  form: PropTypes.object.isRequired,
  item: PropTypes.object,
  onSubmit: PropTypes.func,
  button: PropTypes.string
}

export default Form.create()(FormCounter)
