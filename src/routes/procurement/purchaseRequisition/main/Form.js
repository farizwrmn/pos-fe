import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { Form, Input, DatePicker, Button, Row, Col, Modal } from 'antd'
import ListItem from './ListItem'

const FormItem = Form.Item

const formItemLayout = {
  labelCol: {
    md: { span: 24 },
    lg: { span: 8 }
  },
  wrapperCol: {
    md: { span: 24 },
    lg: { span: 16 }
  }
}

const column = {
  sm: { span: 24 },
  md: { span: 24 },
  lg: { span: 12 },
  xl: { span: 12 }
}

const FormCounter = ({
  item = {},
  onSubmit,
  listDistributionCenter,
  listStore,
  listItemProps,
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

  const disabledDate = (current) => {
    // Can not select days before today and today
    return current < moment(new Date()).add(-1, 'days').endOf('day')
  }

  return (
    <Form layout="horizontal">
      <Row>
        <Col {...column}>
          <FormItem label="No. Transaction" hasFeedback {...formItemLayout}>
            {getFieldDecorator('transNo', {
              initialValue: item.transNo,
              rules: [
                {
                  required: true
                }
              ]
            })(<Input disabled maxLength={60} />)}
          </FormItem>
          <FormItem label="Deadline Receive" {...formItemLayout}>
            {getFieldDecorator('deadlineDate', {
              initialValue: moment().add('5', 'days'),
              rules: [{
                required: true,
                message: 'Required'
              }]
            })(<DatePicker disabledDate={disabledDate} />)}
          </FormItem>
          <Row>
            <Col md={24} lg={8} style={{ paddingRight: '10px', marginBottom: '10px', textAlign: 'right' }}><b>Distribution Center: </b></Col>
            <Col md={24} lg={16} style={{ paddingLeft: '10px' }}>
              {listDistributionCenter.map((item, index) => (
                <div>
                  {`${index + 1}. ${item.dcStore.storeName}`}
                </div>
              ))}
            </Col>
          </Row>
          <Row>
            <Col md={24} lg={8} style={{ paddingRight: '10px', textAlign: 'right' }}><b>Store: </b></Col>
            <Col md={24} lg={16} style={{ paddingLeft: '10px' }}>
              {listStore.map((item, index) => (
                <div>
                  {`${index + 1}. ${item.sellingStore.storeName}`}
                </div>
              ))}
            </Col>
          </Row>
          <ListItem {...listItemProps} />
          <FormItem {...formItemLayout}>
            <Button type="primary" onClick={handleSubmit} style={{ float: 'right', marginTop: '10px' }}>Submit</Button>
          </FormItem>
        </Col>
      </Row>
    </Form >
  )
}

FormCounter.propTypes = {
  form: PropTypes.object.isRequired,
  item: PropTypes.object,
  onSubmit: PropTypes.func,
  button: PropTypes.string
}

export default Form.create()(FormCounter)
