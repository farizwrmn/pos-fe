import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Button, Row, DatePicker, Col, Card, Modal, message } from 'antd'
import moment from 'moment'
import { FooterToolbar } from 'components'

const { TextArea } = Input
const FormItem = Form.Item

const formItemLayout = {
  style: {
    marginTop: 8
  },
  labelCol: {
    xs: { span: 9 },
    sm: { span: 8 },
    md: { span: 8 },
    lg: { span: 8 }
  },
  wrapperCol: {
    xs: { span: 15 },
    sm: { span: 16 },
    md: { span: 16 },
    lg: { span: 16 }
  }
}

const column = {
  md: { span: 24 },
  lg: { span: 12 }
}

const AdvancedForm = ({
  item = {},
  onSubmit,
  onCancel,
  loadingButton,
  button,
  modalType,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    getFieldValue,
    resetFields
  }
}) => {
  const tailFormItemLayout = {
    wrapperCol: {
      span: 24,
      xs: {
        offset: modalType === 'edit' ? 10 : 18
      },
      sm: {
        offset: modalType === 'edit' ? 17 : 22
      },
      md: {
        offset: modalType === 'edit' ? 18 : 22
      },
      lg: {
        offset: modalType === 'edit' ? 11 : 19
      }
    }
  }

  const handleCancel = () => {
    onCancel()
    resetFields()
  }

  const handleSubmit = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      if (!getFieldValue('namaTarget')) {
        message.warning('Must be filled Nama Target')
        return
      }
      if (!getFieldValue('product1')) {
        message.warning('Must be filled Product 1')
        return
      }
      if (!getFieldValue('validFrom')) {
        message.warning('Must be filled Valid From')
        return
      }
      if (!getFieldValue('validTo')) {
        message.warning('Must be filled Valid To')
        return
      }
      Modal.confirm({
        title: 'Do you want to save this item?',
        onOk () {
          const data = getFieldsValue()
          data.namaTarget = data.namaTarget
          data.product1 = data.product1
          data.product2 = data.product2
          data.product3 = data.product3
          data.product4 = data.product4
          data.product5 = data.product5
          data.validFrom = moment(data.validFrom).format('YYYY-MM-DD')
          data.validTo = moment(data.validTo).format('YYYY-MM-DD')
          onSubmit(item.id, data, resetFields)
        },
        onCancel () { }
      })
    })
  }

  const cardProps = {
    bordered: true,
    style: {
      padding: 8,
      marginLeft: 8,
      marginBottom: 8
    },
    title: (
      <Row>
        <Col md={12} lg={3}>
          <h3>Target Sales</h3>
        </Col>
      </Row>
    )
  }

  return (
    <Form layout="horizontal">
      <FooterToolbar>
        <FormItem {...tailFormItemLayout}>
          {modalType === 'edit' && <Button disabled={loadingButton && (loadingButton.effects['subaPromo/add'] || loadingButton.effects['subaPromo/edit'])} type="danger" style={{ margin: '0 10px' }} onClick={handleCancel}>Cancel</Button>}
          <Button type="primary" disabled={loadingButton && (loadingButton.effects['subaPromo/add'] || loadingButton.effects['subaPromo/edit'])} onClick={handleSubmit}>{button}</Button>
        </FormItem>
      </FooterToolbar>
      <Card {...cardProps}>
        <Row>
          <Col {...column}>
            <FormItem label="Nama Target" hasFeedback {...formItemLayout}>
              {getFieldDecorator('namaTarget', {
                initialValue: item.namaTarget,
                rules: [
                  {
                    required: true,
                    message: 'a-Z & 0-9'
                  }
                ]
              })(<TextArea maxLength={50} autosize={{ minRows: 2, maxRows: 6 }} />)}
            </FormItem>
            <FormItem label="product 1" hasFeedback {...formItemLayout}>
              {getFieldDecorator('product1', {
                initialValue: item.product1,
                rules: [
                  {
                    required: true,
                    message: 'a-Z & 0-9'
                  }
                ]
              })(<Input />)}
            </FormItem>

            <FormItem label="product 2" hasFeedback {...formItemLayout}>
              {getFieldDecorator('product2', {
                initialValue: item.product2,
                rules: [
                  {
                    required: false,
                    message: 'a-Z & 0-9'
                  }
                ]
              })(<Input />)}
            </FormItem>
            <FormItem label="product 3" hasFeedback {...formItemLayout}>
              {getFieldDecorator('product3', {
                initialValue: item.product3,
                rules: [
                  {
                    required: false,
                    message: 'a-Z & 0-9'
                  }
                ]
              })(<Input />)}
            </FormItem>
            <FormItem label="product 4" hasFeedback {...formItemLayout}>
              {getFieldDecorator('product4', {
                initialValue: item.product4,
                rules: [
                  {
                    required: false,
                    message: 'a-Z & 0-9'
                  }
                ]
              })(<Input />)}
            </FormItem>
            <FormItem label="product 5" hasFeedback {...formItemLayout}>
              {getFieldDecorator('product5', {
                initialValue: item.product5,
                rules: [
                  {
                    required: false,
                    message: 'a-Z & 0-9'
                  }
                ]
              })(<Input />)}
            </FormItem>
            <FormItem label="Valid From" {...formItemLayout}>
              {getFieldDecorator('validFrom', {
                initialValue: item.validFrom ? moment(item.validFrom) : moment(),
                rules: [{
                  required: true,
                  message: 'Required'
                }]
              })(<DatePicker />)}
            </FormItem>
            <FormItem label="Valid To" {...formItemLayout}>
              {getFieldDecorator('validTo', {
                initialValue: item.validTo ? moment(item.validTo) : moment(),
                rules: [{
                  required: true,
                  message: 'Required'
                }]
              })(<DatePicker />)}
            </FormItem>
          </Col>
        </Row>
      </Card>
    </Form>
  )
}

AdvancedForm.propTypes = {
  form: PropTypes.object.isRequired,
  modalType: PropTypes.string,
  item: PropTypes.object,
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func,
  button: PropTypes.string
}

export default Form.create()(AdvancedForm)
