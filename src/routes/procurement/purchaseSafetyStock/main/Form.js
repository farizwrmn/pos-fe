import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { Form, DatePicker, Button, Row, Col, Modal } from 'antd'

const FormItem = Form.Item
const { RangePicker } = DatePicker

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
  onSubmit,
  modalType,
  loading,
  listStore,
  listDistributionCenter,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    resetFields
  }
}) => {
  const tailFormItemLayout = {
    wrapperCol: {
      span: 24,
      xs: {
        offset: modalType === 'edit' ? 10 : 19
      },
      sm: {
        offset: modalType === 'edit' ? 15 : 20
      },
      md: {
        offset: modalType === 'edit' ? 15 : 19
      },
      lg: {
        offset: modalType === 'edit' ? 13 : 18
      }
    }
  }

  const handleSubmit = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue()
      }
      console.log('onSubmit', data)
      data.from = data.rangeDate[0].format('YYYY-MM-DD')
      data.to = data.rangeDate[1].format('YYYY-MM-DD')
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
        <Col {...column}>
          <h1>Generate Safety Stock</h1>
          <FormItem label="Date" hasFeedback {...formItemLayout}>
            {getFieldDecorator('rangeDate', {
              initialValue: [moment().subtract(6, 'months'), moment()],
              rules: [
                {
                  required: true
                }
              ]
            })(
              <RangePicker disabled size="large" format="DD-MMM-YYYY" />
            )}
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
          <FormItem {...tailFormItemLayout}>
            <Button disabled={loading.effects['purchaseSafetyStock/add']} type="primary" onClick={handleSubmit}>Add</Button>
          </FormItem>
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
