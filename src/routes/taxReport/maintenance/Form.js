import React from 'react'
import PropTypes from 'prop-types'
import { Form, Button, DatePicker, Row, Col, Modal, message } from 'antd'
import moment from 'moment'

const FormItem = Form.Item

const { RangePicker, MonthPicker } = DatePicker

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
  onSubmitCogs,
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

  const handleCogs = () => {
    const data = getFieldsValue()
    if (data.periodCostPrice) {
      Modal.confirm({
        title: 'Do you want to reset this date?',
        onOk () {
          onSubmitCogs({
            from: data.periodCostPrice.format('M'),
            to: data.periodCostPrice.format('YYYY')
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
            disabled={loading.effects['taxReportMaintenance/queryPos'] || loading.effects['taxReportMaintenance/queryPurchase'] || loading.effects['taxReportMaintenance/queryCogs']}
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
            disabled={loading.effects['taxReportMaintenance/queryPos'] || loading.effects['taxReportMaintenance/queryPurchase'] || loading.effects['taxReportMaintenance/queryCogs']}
          >
            Submit
          </Button>
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <FormItem label="Cost Price" {...formItemLayout}>
            {getFieldDecorator('periodCostPrice', {
              initialValue: moment.utc(`${moment().format('M')}-${moment().format('YYYY')}`, 'M-YYYY'),
              rules: [
                {
                  required: true
                }
              ]
            })(<MonthPicker style={{ width: '189px' }} placeholder="Select Period" />)}
          </FormItem>
        </Col>
        <Col span={12}>
          <Button
            type="primary"
            size="large"
            style={{ marginLeft: '5px' }}
            onClick={() => handleCogs()}
            loading={loading.effects['taxReportMaintenance/queryCogs']}
            disabled={loading.effects['taxReportMaintenance/queryPos'] || loading.effects['taxReportMaintenance/queryPurchase'] || loading.effects['taxReportMaintenance/queryCogs']}
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
