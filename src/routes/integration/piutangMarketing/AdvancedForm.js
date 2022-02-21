import React from 'react'
import PropTypes from 'prop-types'
import { Form, Button, Input, InputNumber, Row, DatePicker, Col, Card, Modal, message } from 'antd'
import moment from 'moment'
import { FooterToolbar } from 'components'

const FormItem = Form.Item
const dateFormat = 'YYYY-MM-DD'

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
      if (!getFieldValue('salesName')) {
        message.warning('Must be filled Sales Name')
        return
      }
      if (!getFieldValue('customer')) {
        message.warning('Must be filled Customer')
        return
      }
      if (!getFieldValue('noFaktur')) {
        message.warning('Must be filled No Faktur')
        return
      }
      if (!getFieldValue('tglFaktur')) {
        message.warning('Must be filled Tgl Faktur')
        return
      }
      if (!getFieldValue('jatuhTempo')) {
        message.warning('Must be filled Jatuh Tempo')
        return
      }
      if (!getFieldValue('nilaiFaktur')) {
        message.warning('Must be filled Nilai Faktur')
        return
      }
      if (!getFieldValue('hutang')) {
        message.warning('Must be filled Hutang')
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
          <h3>Piutang Marketing</h3>
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
          {modalType === 'edit' && <Button disabled={loadingButton && (loadingButton.effects['piutangMarketing/add'] || loadingButton.effects['piutangMarketing/edit'])} type="danger" style={{ margin: '0 10px' }} onClick={handleCancel}>Cancel</Button>}
          <Button type="primary" disabled={loadingButton && (loadingButton.effects['piutangMarketing/add'] || loadingButton.effects['piutangMarketing/edit'])} onClick={handleSubmit}>{button}</Button>
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

            <FormItem label="No Faktur" hasFeedback {...formItemLayout}>
              {getFieldDecorator('noFaktur', {
                initialValue: item.noFaktur,
                rules: [
                  {
                    required: false,
                    message: 'a-Z & 0-9'
                  }
                ]
              })(<Input />)}
            </FormItem>
            <FormItem label="Tgl Faktur" hasFeedback {...formItemLayout}>
              {getFieldDecorator('tglFaktur', {
                initialValue: moment.utc(moment(item.tglFaktur).format('YYYY-MM-DD'), dateFormat),
                rules: [
                  {
                    required: false,
                    message: 'required'
                  }
                ]
              })(<DatePicker />)}
            </FormItem>
            <FormItem label="Jatuh Tempo" hasFeedback {...formItemLayout}>
              {getFieldDecorator('jatuhTempo', {
                initialValue: moment.utc(moment(item.jatuhTempo).format('YYYY-MM-DD'), dateFormat),
                rules: [
                  {
                    required: false,
                    message: 'required'
                  }
                ]
              })(<DatePicker />)}
            </FormItem>
            <FormItem label="Nilai Faktur" hasFeedback {...formItemLayout}>
              {getFieldDecorator('nilaiFaktur', {
                initialValue: item.nilaiFaktur,
                rules: [
                  {
                    required: false,
                    message: 'a-Z & 0-9'
                  }
                ]
              })(<InputNumber {...InputNumberProps} />)}
            </FormItem>
            <FormItem label="Hutang" hasFeedback {...formItemLayout}>
              {getFieldDecorator('hutang', {
                initialValue: item.hutang,
                rules: [
                  {
                    required: false,
                    message: 'a-Z & 0-9'
                  }
                ]
              })(<InputNumber {...InputNumberProps} />)}
            </FormItem>
            <FormItem label="Umur Hutang (Hari)" hasFeedback {...formItemLayout}>
              {getFieldDecorator('umurHutang', {
                initialValue: item.umurHutang,
                rules: [
                  {
                    required: false,
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
