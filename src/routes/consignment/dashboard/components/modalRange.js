import React from 'react'
import PropTypes from 'prop-types'
import { Modal, DatePicker, Form } from 'antd'
import moment from 'moment'

const FormItem = Form.Item

const formItemLayout = {
  labelCol: {
    xs: {
      span: 9
    },
    sm: {
      span: 8
    },
    md: {
      span: 7
    }
  },
  wrapperCol: {
    xs: {
      span: 15
    },
    sm: {
      span: 16
    },
    md: {
      span: 14
    }
  }
}

const ModalRange = ({
  onSubmit,
  form: {
    getFieldsValue,
    getFieldDecorator,
    validateFields,
    setFieldsValue
  },
  ...modalProps
}) => {
  const handleOk = () => {
    validateFields((errors) => {
      if (errors) return
      const data = getFieldsValue()
      onSubmit(data)
    })
  }

  const changeStartPeriod = () => {
    setFieldsValue({
      to: null
    })
  }

  const disabledToDate = (current) => {
    const data = getFieldsValue()
    if (data.start) {
      return current < moment(data.start).add(-30, 'days').endOf('day') || current > moment(data.start).add(30, 'days').endOf('day')
    }
  }

  const modalOpts = {
    onOk: handleOk,
    ...modalProps
  }
  return (<Modal {...modalOpts}>
    <Form>
      <FormItem label="start" hasFeedback {...formItemLayout}>
        {/* <RangePicker allowClear onChange={hdlChangeRange} /> */}
        {getFieldDecorator('start', {
          rules: [
            {
              required: true
            }
          ]
        })(
          <DatePicker
            onChange={changeStartPeriod}
          />
        )}
      </FormItem>
      <FormItem label="to" hasFeedback {...formItemLayout}>
        {/* <RangePicker allowClear onChange={hdlChangeRange} /> */}
        {getFieldDecorator('to', {
          rules: [
            {
              required: true
            }
          ]
        })(
          <DatePicker
            disabledDate={disabledToDate}
          />
        )}
      </FormItem>
    </Form>[[-]]
  </Modal>)
}

ModalRange.propTypes = {
  onSubmit: PropTypes.func.isRequired
}

export default Form.create()(ModalRange)
