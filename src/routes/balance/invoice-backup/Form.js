import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Row, Col } from 'antd'
import moment from 'moment'
import CurrentList from './CurrentList'

const FormItem = Form.Item

const formItemLayout = {
  labelCol: {
    sm: { span: 24 },
    md: { span: 7 }
  },
  wrapperCol: {
    sm: { span: 24 },
    md: { span: 14 }
  }
}

const column = {
  md: { span: 24 },
  lg: { span: 16 }
}

const FormComponent = ({
  item = {},
  form: {
    getFieldDecorator
  }
}) => {
  const currentListProps = {
    item
  }

  return (
    <Form layout="horizontal">
      <Row>
        <Col {...column}>
          <FormItem label="Shift" hasFeedback {...formItemLayout}>
            {getFieldDecorator('shiftId', {
              initialValue: item && item.shift ? item.shift.shiftName : undefined,
              rules: [
                {
                  required: true
                }
              ]
            })(
              <Input disabled />
            )}
          </FormItem>
          <FormItem label="Cashier" hasFeedback {...formItemLayout}>
            {getFieldDecorator('userId', {
              initialValue: item && item.user ? item.user.userName : undefined,
              rules: [
                {
                  required: true
                }
              ]
            })(
              <Input disabled />
            )}
          </FormItem>
          <FormItem label="Close Date" hasFeedback {...formItemLayout}>
            {getFieldDecorator('closed', {
              initialValue: item && item.closed ? moment(item.closed).format('DD-MMM-YYYY HH:mm:ss') : undefined,
              rules: [
                {
                  required: true
                }
              ]
            })(
              <Input disabled />
            )}
          </FormItem>
          <FormItem label="Assign To" hasFeedback {...formItemLayout}>
            {getFieldDecorator('approveUserId', {
              initialValue: item && item.approveUser ? item.approveUser.userName : undefined,
              rules: [
                {
                  required: true
                }
              ]
            })(
              <Input disabled />
            )}
          </FormItem>
          <FormItem label="Memo" hasFeedback {...formItemLayout}>
            {getFieldDecorator('description', {
              initialValue: item && item.description ? item.description : undefined
            })(<Input disabled maxLength={255} />)}
          </FormItem>
          <CurrentList {...currentListProps} />
        </Col>
        <Col md={24} lg={8} />
      </Row>
    </Form>
  )
}

FormComponent.propTypes = {
  button: PropTypes.string,
  form: PropTypes.object.isRequired,
  disabled: PropTypes.string,
  item: PropTypes.object,
  onSubmit: PropTypes.func
}

export default Form.create()(FormComponent)
