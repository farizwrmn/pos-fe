import React from 'react'
import PropTypes from 'prop-types'
import { Form, Button, DatePicker, Row, Col, Modal } from 'antd'
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
  onSubmit,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    resetFields
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
      Modal.confirm({
        title: 'Do you want to save this item?',
        onOk () {
          onSubmit(data, resetFields)
        },
        onCancel () { }
      })
    })
  }

  return (
    <Form layout="horizontal">
      <Row>
        <Col span={12}>
          <FormItem label="Sales" {...formItemLayout}>
            {getFieldDecorator('rangeDateSalesHeader', {
              initialValue: [moment().add('-1', 'months'), moment()],
              rules: [
                { required: true }
              ]
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
            onClick={() => handleSubmit()}
            loading={loading}
          >
            Submit
          </Button>
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <FormItem label="Purchase" {...formItemLayout}>
            {getFieldDecorator('rangeDatePurchaseHeader', {
              initialValue: [moment().add('-1', 'months'), moment()],
              rules: [
                { required: true }
              ]
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
            onClick={() => handleSubmit()}
            loading={loading}
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
