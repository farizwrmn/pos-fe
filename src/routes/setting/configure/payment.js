import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Button, Switch, Row, Col } from 'antd'

const FormItem = Form.Item

const formItemLayout = {
  labelCol: { lg: 14, md: 14, sm: 14, float: 'left' },
  wrapperCol: { lg: 14, md: 14, sm: 14, }
}

const Payment = ({
  visible,
  form: { getFieldDecorator, validateFields, getFieldsValue },
}) => {
  const saveClick = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue(),
      }
      console.log(data)
    })
  }

  return (
    <Form layout='horizontal' className="ant-form-item-label-float-left">
      <Row>
        <Col lg={{ span: 10, offset: 1 }} md={{ span: 10, offset: 1 }} sm={{ span: 19 }}>
          <FormItem label="Deposit Payment For uregistered" hasFeedback {...formItemLayout}>
            {getFieldDecorator('outOfStock', {
              rules: [{
                required: true
              }],
            })(<Switch defaultChecked={false} />)}
          </FormItem>
        </Col>
        <Col lg={{ span: 10, offset: 1 }} md={{ span:10, offset: 1 }} sm={{ span: 19 }}>
        <FormItem label="Deposit Payment For uregistered" hasFeedback {...formItemLayout}>
            {getFieldDecorator('outOfStock', {
              rules: [{
                required: true
              }],
            })(<Switch defaultChecked={false} />)}
          </FormItem>
        </Col>
      </Row>
      <Button type="primary" htmlType="submit" className="ant-form-save-width-half" onClick={saveClick}>
        Save
      </Button>
    </Form>
  )
}

Payment.propTypes = {
  form: PropTypes.object.isRequired,
  onOk: PropTypes.func,
}

export default Form.create()(Payment)