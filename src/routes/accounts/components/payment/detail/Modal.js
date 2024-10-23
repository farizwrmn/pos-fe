import React from 'react'
import PropTypes from 'prop-types'
import { lstorage } from 'utils'
import {
  Form,
  DatePicker,
  Row,
  Col,
  Radio,
  Button,
  Input,
  Modal,
  Select
} from 'antd'
import moment from 'moment'

const { getAvailablePaymentType } = lstorage

const FormItem = Form.Item
const Option = Select.Option

let printDateVisible = false

const ammountItemLayout = {
  labelCol: {
    xs: {
      span: 3
    },
    sm: {
      span: 3
    },
    md: {
      span: 3
    }
  },
  wrapperCol: {
    xs: {
      span: 24
    },
    sm: {
      span: 24
    },
    md: {
      span: 24
    }
  }
}

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 14 }
}

const ModalEntry = ({
  loading,
  dispatch,
  onOk,
  onCancel,
  item = {},
  data,
  listAmount,
  listAllEdc,
  listAllCost,
  listEdc,
  listCost,
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

      const fields = {
        ...getFieldsValue()
      }

      const filteredEdc = listEdc.find(item => item.id === fields.machine && item.paymentOption === fields.typeCode)
      if (!filteredEdc) {
        const filteredAllEdc = listAllEdc.filter(filtered => filtered.paymentOption === fields.typeCode)
        if (filteredAllEdc && filteredAllEdc[0]) {
          const filteredCost = listAllCost.filter(filtered => filtered.machineId === filteredAllEdc[0].id)
          if (filteredCost && filteredCost[0]) {
            fields.machine = filteredAllEdc[0].id
            fields.bank = filteredCost[0].id
          }
        }
      }

      const item = {
        reference: data[0].id,
        transNo: data[0].transNo,
        storeId: data[0].storeId,
        storeIdPayment: lstorage.getCurrentUserStore(),
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

  const onChangePaymentType = (value) => {
    resetFields()
    setFieldsValue({
      printDate: moment(),
      machine: undefined,
      bank: undefined
    })
    validateFields()
    dispatch({
      type: 'paymentEdc/updateState',
      payload: {
        paymentLovFiltered: listAllEdc.filter(filtered => filtered.paymentOption === value)
      }
    })
  }

  const onChangeMachine = (machineId) => {
    setFieldsValue({
      bank: undefined
    })
    validateFields()
    dispatch({
      type: 'paymentCost/updateState',
      payload: {
        paymentLovFiltered: listAllCost.filter(filtered => filtered.machineId === machineId)
      }
    })
  }

  const params = getAvailablePaymentType()
  const paramsArray = typeof params === 'string' && String(params).includes(',') ? params.split(',') : ['C', 'D', 'K', 'QR']
  const currentShownPaymentOption = Array.isArray(paramsArray) ? paramsArray.concat(['XQ', 'NID', 'MND']) : ['C', 'D', 'K', 'QR']
  const filteredOptions = options.filter(filtered => currentShownPaymentOption.find(item => item === filtered.typeCode))

  return (
    <Modal
      {...modalOpts}
      footer={[
        <Button disabled={loading.effects['paymentDetail/add']} onClick={handleCancel}>Cancel</Button>,
        <Button type="primary" disabled={loading.effects['paymentDetail/add']} onClick={handleOk}>OK</Button>
      ]}
    >
      <Form layout="horizontal">
        <FormItem label="Amount" hasFeedback {...ammountItemLayout}>
          {getFieldDecorator('amount', {
            initialValue: item.amount ? item.amount : parseFloat(data.length > 0 ? data[0].nettoTotal - curPayment : 0).toFixed(0),
            rules: [
              {
                required: true,
                pattern: /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/,
                message: '0-9 please insert the value'
              }
            ]
          })(
            <Input
              style={{ width: '100%', fontSize: '30px', height: '60px' }}
              autoFocus
              maxLength={10}
              size="large"
            />
          )}
        </FormItem>
        <Button
          onClick={() => useNetto(data[0].nettoTotal - curPayment)}
        >
          Netto
        </Button>
        <Row>
          <Col md={12} sm={24}>
            <FormItem label="Type" hasFeedback {...formItemLayout}>
              {getFieldDecorator('typeCode', {
                initialValue: item.typeCode ? item.typeCode : 'C',
                rules: [
                  {
                    required: true
                  }
                ]
              })(
                <Radio.Group
                  onChange={(e) => {
                    if (e && e.target) {
                      onChangePaymentType(e.target.value)
                    } else {
                      onChangePaymentType(e)
                    }
                  }}
                >
                  {filteredOptions.map((item) => {
                    return (
                      <Radio.Button
                        value={item.typeCode}
                      >
                        {item.typeName}
                      </Radio.Button>
                    )
                  })}
                </Radio.Group>
              )}
            </FormItem>
            <FormItem label="EDC" hasFeedback {...formItemLayout}>
              {getFieldDecorator('machine', {
                initialValue: item.machine,
                rules: [
                  {
                    required: getFieldValue('typeCode') !== 'C' || (getFieldValue('typeCode') === 'C' && listEdc.length > 0)
                  }
                ]
              })(
                <Select onChange={onChangeMachine} style={{ width: '100%' }} min={0} maxLength={10}>
                  {listEdc.map(list => <Option value={list.id}>{list.name}</Option>)}
                </Select>
              )}
            </FormItem>
            <FormItem label="Card" hasFeedback {...formItemLayout}>
              {getFieldDecorator('bank', {
                initialValue: item.bank,
                rules: [
                  {
                    required: getFieldValue('typeCode') !== 'C' || (getFieldValue('typeCode') === 'C' && listEdc.length > 0)
                  }
                ]
              })(
                <Select style={{ width: '100%' }} min={0} maxLength={10}>
                  {listCost.map(list => <Option value={list.id}>{`${list.bank ? list.bank.bankName : ''} (${list.bank ? list.bank.bankCode : ''})`}</Option>)}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            {getFieldValue('typeCode') !== 'C' && (
              <FormItem label="Batch Number" hasFeedback {...formItemLayout}>
                {getFieldDecorator('batchNumber', {
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
            )}
            {getFieldValue('typeCode') !== 'C' && (
              <FormItem label="Card/Phone No" hasFeedback {...formItemLayout}>
                {getFieldDecorator('cardNo', {
                  initialValue: item.cardNo,
                  rules: [
                    {
                      required: getFieldValue('typeCode') !== 'C',
                      message: 'please insert the value'
                    }
                  ]
                })(<Input disabled={getFieldValue('typeCode') === 'C'} maxLength={30} style={{ width: '100%', fontSize: '14pt' }} />)}
              </FormItem>
            )}
            {getFieldValue('typeCode') !== 'C' && (
              <FormItem label="Card Name" hasFeedback {...formItemLayout}>
                {getFieldDecorator('cardName', {
                  initialValue: item.cardName,
                  rules: [
                    {
                      required: false,
                      message: 'please insert the value'
                    }
                  ]
                })(<Input disabled={getFieldValue('typeCode') === 'C'} maxLength={250} style={{ width: '100%', fontSize: '14pt' }} />)}
              </FormItem>
            )}
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
            {printDateVisible && (
              <FormItem
                label="Print Date"
                hasFeedback
                style={{
                  display: getFieldValue('typeCode') === 'C' ? 'none' : ''
                }}
                {...formItemLayout}
              >
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
                    disabled
                    style={{ width: '100%', fontSize: '14pt' }}
                  />
                )}
              </FormItem>
            )}
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}

ModalEntry.propTypes = {
  form: PropTypes.object.isRequired,
  onOk: PropTypes.func,
  onCancel: PropTypes.func
}

export default Form.create()(ModalEntry)
