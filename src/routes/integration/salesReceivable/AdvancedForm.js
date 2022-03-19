import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { Form, Button, Input, InputNumber, Row, DatePicker, Col, Card, Modal } from 'antd'
import moment from 'moment'
import { FooterToolbar } from 'components'

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
  dispatch,
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
      Modal.confirm({
        title: 'Do you want to save this item?',
        onOk () {
          const data = getFieldsValue()
          data.salesName = data.salesName
          data.customer = data.customer
          data.noFaktur = data.noFaktur
          data.tglFaktur = moment(data.tglFaktur).format('YYYY-MM-DD')
          data.jatuhTempo = moment(data.jatuhTempo).format('YYYY-MM-DD')
          data.nilaiFaktur = data.nilaiFaktur
          data.hutang = data.hutang
          data.umurHutang = data.umurHutang
          onSubmit(item.id, data, resetFields)
        },
        onCancel () { }
      })
    })
  }

  const handleImport = () => {
    dispatch(routerRedux.push({
      pathname: '/integration/subagro/sales-receivable/import'
    }))
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
          <h3>Piutang</h3>
        </Col>
        <Col md={12} lg={9}>
          <Button
            type="default"
            onClick={handleImport}
          >
            Import
          </Button>
        </Col>
      </Row>
    )
  }

  const InputNumberProps = {
    placeholder: '0',
    style: { width: '100%' }
  }

  return (
    <Form layout="horizontal">
      <FooterToolbar>
        <FormItem {...tailFormItemLayout}>
          {modalType === 'edit' && <Button disabled={loadingButton && (loadingButton.effects['salesReceivable/add'] || loadingButton.effects['salesReceivable/edit'])} type="danger" style={{ margin: '0 10px' }} onClick={handleCancel}>Cancel</Button>}
          <Button type="primary" disabled={loadingButton && (loadingButton.effects['salesReceivable/add'] || loadingButton.effects['salesReceivable/edit'])} onClick={handleSubmit}>{button}</Button>
        </FormItem>
      </FooterToolbar>
      <Card {...cardProps}>
        <Row>
          <Col {...column}>
            <FormItem label="Sales Name" hasFeedback {...formItemLayout}>
              {getFieldDecorator('salesName', {
                initialValue: item.salesName,
                rules: [
                  {
                    required: true,
                    message: 'a-Z & 0-9'
                  }
                ]
              })(<Input />)}
            </FormItem>
            <FormItem label="customer" hasFeedback {...formItemLayout}>
              {getFieldDecorator('customer', {
                initialValue: item.customer,
                rules: [
                  {
                    required: true,
                    message: 'a-Z & 0-9'
                  }
                ]
              })(<Input />)}
            </FormItem>

            <FormItem label="Transaction No" hasFeedback {...formItemLayout}>
              {getFieldDecorator('transNo', {
                initialValue: item.transNo,
                rules: [
                  {
                    required: true,
                    message: 'a-Z & 0-9'
                  }
                ]
              })(<Input />)}
            </FormItem>
            <FormItem label="Transaction Date" hasFeedback {...formItemLayout}>
              {getFieldDecorator('transDate', {
                initialValue: item.transDate ? moment(item.transDate) : null,
                rules: [
                  {
                    required: true,
                    message: 'required'
                  }
                ]
              })(<DatePicker />)}
            </FormItem>
            <FormItem label="Due Date" hasFeedback {...formItemLayout}>
              {getFieldDecorator('dueDate', {
                initialValue: item.dueDate ? moment(item.dueDate) : null,
                rules: [
                  {
                    required: true,
                    message: 'required'
                  }
                ]
              })(<DatePicker />)}
            </FormItem>
            <FormItem label="Netto" hasFeedback {...formItemLayout}>
              {getFieldDecorator('netto', {
                initialValue: item.netto,
                rules: [
                  {
                    required: true,
                    message: 'a-Z & 0-9'
                  }
                ]
              })(<InputNumber {...InputNumberProps} />)}
            </FormItem>
            <FormItem label="Receivable" hasFeedback {...formItemLayout}>
              {getFieldDecorator('receivable', {
                initialValue: item.receivable,
                rules: [
                  {
                    required: true,
                    message: 'a-Z & 0-9'
                  }
                ]
              })(<InputNumber {...InputNumberProps} />)}
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
