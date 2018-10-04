import React from 'react'
import PropTypes from 'prop-types'
import { lstorage } from 'utils'
import { Form, Select, DatePicker, Row, Col, Button, Input, Modal } from 'antd'
import moment from 'moment'

const Option = Select.Option
const FormItem = Form.Item

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 14 }
}

const modal = ({
  onOk,
  onCancel,
  item = {},
  data,
  listAmount,
  cashierInformation,
  curPayment = listAmount.reduce((cnt, o) => cnt + parseFloat(o.paid), 0),
  options,
  form: {
    getFieldDecorator,
    getFieldsValue,
    getFieldValue,
    setFieldsValue,
    resetFields,
    validateFields
  },
  ...modalProps
}) => {
  const handleOk = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const item = {
        reference: data[0].id,
        transNo: data[0].transNo,
        storeId: data[0].storeId,
        storeIdPayment: lstorage.getCurrentUserStore(),
        cashierTransId: cashierInformation.id,
        ...getFieldsValue()
      }
      onOk(item)
    })
  }

  const handleCancel = () => {
    resetFields()
    onCancel()
  }

  const useNetto = (e) => {
    setFieldsValue({
      amount: e
    })
  }

  const modalOpts = {
    ...modalProps,
    onOk: handleOk,
    onCancel: handleCancel
  }
  return (
    <Modal {...modalOpts}>
      <Form>
        <Row>
          <Col lg={12} md={12} sm={24}>
            <FormItem label="Type" hasFeedback {...formItemLayout}>
              {getFieldDecorator('typeCode', {
                initialValue: item.typeCode ? item.typeCode : 'C'
              })(
                <Select style={{ width: '100%', fontSize: '14pt' }} min={0} maxLength={10}>
                  {options.map(list => <Option value={list.typeCode}>{`${list.typeName} (${list.typeCode})`}</Option>)}
                </Select>
              )}
            </FormItem>
            <FormItem label="Amount" hasFeedback {...formItemLayout}>
              {getFieldDecorator('amount', {
                initialValue: item.amount ? item.amount : parseFloat(data.length > 0 ? data[0].nettoTotal - curPayment : 0).toFixed(0),
                rules: [
                  {
                    required: true,
                    pattern: /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/,
                    message: '0-9 please insert the value'
                  }
                ]
              })(<Input style={{ width: '100%', fontSize: '14pt' }} addonBefore={(<Button size="small" onClick={() => useNetto(parseFloat(data[0].nettoTotal - curPayment))}>Netto</Button>)} autoFocus maxLength={10} />)}
            </FormItem>
            <FormItem label="Note" hasFeedback {...formItemLayout}>
              {getFieldDecorator('description', {
                initialValue: item.description,
                rules: [
                  {
                    required: false,
                    pattern: /^[a-z0-9 -.%#@${}?!/()_]+$/i,
                    message: 'please insert the value'
                  }
                ]
              })(<Input maxLength={250} style={{ width: '100%', fontSize: '14pt' }} />)}
            </FormItem>
          </Col>
          <Col lg={12} md={12} sm={24}>
            <FormItem label="Print Date" hasFeedback {...formItemLayout}>
              {getFieldDecorator('printDate', {
                initialValue: item.printDate ? moment.utc(item.printDate, 'YYYY-MM-DD HH:mm:ss') : null,
                rules: [
                  {
                    required: getFieldValue('typeCode') !== 'C',
                    message: 'please insert the value'
                  }
                ]
              })(
                <DatePicker
                  showTime
                  format="YYYY-MM-DD HH:mm:ss"
                  placeholder="Select Time"
                  style={{ width: '100%', fontSize: '14pt' }}
                />
              )}
            </FormItem>
            <FormItem label="Card Name" hasFeedback {...formItemLayout}>
              {getFieldDecorator('cardName', {
                initialValue: item.cardName,
                rules: [
                  {
                    required: getFieldValue('typeCode') !== 'C',
                    pattern: /^[a-z0-9 -.,_]+$/i,
                    message: 'please insert the value'
                  }
                ]
              })(<Input disabled={getFieldValue('typeCode') === 'C'} maxLength={250} style={{ width: '100%', fontSize: '14pt' }} />)}
            </FormItem>
            <FormItem label="Card No." hasFeedback {...formItemLayout}>
              {getFieldDecorator('cardNo', {
                initialValue: item.cardNo,
                rules: [
                  {
                    required: getFieldValue('typeCode') !== 'C',
                    pattern: /^[a-z0-9-/.,_]+$/i,
                    message: 'please insert the value'
                  }
                ]
              })(<Input disabled={getFieldValue('typeCode') === 'C'} maxLength={30} style={{ width: '100%', fontSize: '14pt' }} />)}
            </FormItem>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}

modal.propTypes = {
  form: PropTypes.object.isRequired,
  onOk: PropTypes.func,
  onCancel: PropTypes.func
}

export default Form.create()(modal)
