import React from 'react'
import PropTypes from 'prop-types'
import { lstorage } from 'utils'
import { Form, Select, Tooltip, DatePicker, Row, Col, Button, Input, Modal } from 'antd'
import moment from 'moment'

const Option = Select.Option
const FormItem = Form.Item

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 }
}

const modal = ({
  onOk,
  onCancel,
  item = {},
  valueNumber,
  data,
  listAmount,
  visibleTooltip,
  changeVisibleTooltip,
  changeValueNumber,
  listSupplierBank,
  showAddBank,
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
        reference: data.id,
        transNo: data.transNo,
        storeId: data.storeId,
        storeIdPayment: lstorage.getCurrentUserStore(),
        ...getFieldsValue()
      }
      // console.log('item', item)
      onOk(item)
    })
  }

  const handleClickAddBank = () => {
    showAddBank()
  }

  const handleCancel = () => {
    resetFields()
    onCancel()
  }
  const modalOpts = {
    ...modalProps,
    title: 'Add Payment',
    onOk: handleOk,
    onCancel: handleCancel
  }

  const useNetto = (e) => {
    setFieldsValue({
      amount: e
    })
  }
  const formatNumber = (value) => {
    value += ''
    const list = value.split('.')
    const prefix = list[0].charAt(0) === '-' ? '-' : ''
    let num = prefix ? list[0].slice(1) : list[0]
    let result = ''
    while (num.length > 3) {
      result = `,${num.slice(-3)}${result}`
      num = num.slice(0, num.length - 3)
    }
    if (num) {
      result = num + result
    }
    return `${prefix}${result}${list[1] ? `.${list[1]}` : ''}`
  }

  const hdlChangeTooltip = () => {
    const value = getFieldValue('amount')
    const reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/
    if ((!isNaN(value) && reg.test(value)) || value === '' || value === '-') {
      changeValueNumber(value)
    }
    changeVisibleTooltip(true)
  }

  const changeNumber = (e) => {
    const { value } = e.target
    const reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/
    if ((!isNaN(value) && reg.test(value)) || value === '' || value === '-') {
      valueNumber = value
    }
    changeValueNumber(value)
  }

  const title = valueNumber ? (
    <span className="numeric-input-title">
      {valueNumber !== '-' ? formatNumber(valueNumber) : '-'}
    </span>
  ) : 'Input a number'

  const changeSelectTypeCode = (value) => {
    if (value === 'C') {
      setFieldsValue({
        bankAccountId: null,
        cardNo: null,
        cardName: null,
        checkNo: null
      })
    } else if (value === 'G') {
      setFieldsValue({
        cardNo: null,
        cardName: null,
        checkNo: null
      })
    } else {
      setFieldsValue({
        bankAccountId: null,
        checkNo: null
      })
    }
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
                <Select onChange={changeSelectTypeCode} style={{ width: '100%' }} min={0} maxLength={10}>
                  {options.map(list => <Option value={list.typeCode}>{`${list.typeName} (${list.typeCode})`}</Option>)}
                </Select>
              )}
            </FormItem>
            <Tooltip
              visible={visibleTooltip}
              title={title}
              placement="topRight"
              overlayClassName="numeric-input"
            >
              <FormItem label="Amount" hasFeedback {...formItemLayout}>
                {getFieldDecorator('amount', {
                  initialValue: parseFloat(data.nettoTotal - curPayment) || item.amount,
                  rules: [
                    {
                      required: true,
                      pattern: /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/,
                      message: '0-9 please insert the value'
                    }
                  ]
                })(
                  <Input onFocus={hdlChangeTooltip} onChange={changeNumber} style={{ width: '100%' }} addonBefore={(<Button size="small" onClick={() => useNetto(parseFloat(data.nettoTotal - curPayment))}>Netto</Button>)} autoFocus maxLength={12} />
                )}
              </FormItem>
            </Tooltip>
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
              })(<Input maxLength={250} style={{ width: '100%' }} />)}
            </FormItem>
            <FormItem label="Bank" hasFeedback labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
              {getFieldDecorator('bankAccountId', {
                rules: [
                  {
                    required: getFieldValue('typeCode') === 'G',
                    pattern: /^[a-z0-9 -.,_]+$/i,
                    message: 'please insert the value'
                  }
                ]
              })(
                <Select style={{ width: '100%' }} min={0} disabled={getFieldValue('typeCode') !== 'G'} maxLength={10}>
                  {listSupplierBank.map(list => <Option value={list.id}>{`${list.accountName} (${list.accountNo})`}</Option>)}
                </Select>
              )}
              <Button disabled={getFieldValue('typeCode') === 'C'} type="primary" icon="plus" onClick={handleClickAddBank}>Add Bank</Button>
            </FormItem>
          </Col>
          <Col lg={12} md={12} sm={24}>
            <FormItem label="Print Date" hasFeedback {...formItemLayout}>
              {getFieldDecorator('printDate', {
                initialValue: item.printDate ? moment.utc(item.printDate, 'YYYY-MM-DD HH:mm:ss') : null,
                rules: [
                  {
                    required: true,
                    message: 'please insert the value'
                  }
                ]
              })(
                <DatePicker
                  showTime
                  format="YYYY-MM-DD HH:mm:ss"
                  placeholder="Select Time"
                  style={{ width: '100%' }}
                />
              )}
            </FormItem>
            <FormItem label="Card Name" hasFeedback {...formItemLayout}>
              {getFieldDecorator('cardName', {
                initialValue: item.cardName,
                rules: [
                  {
                    required: getFieldValue('typeCode') !== 'C' && getFieldValue('typeCode') !== 'G',
                    pattern: /^[a-z0-9 -.,_]+$/i,
                    message: 'please insert the value'
                  }
                ]
              })(<Input disabled={getFieldValue('typeCode') === 'C' || getFieldValue('typeCode') === 'G'} maxLength={250} style={{ width: '100%' }} />)}
            </FormItem>
            <FormItem label="Card No." hasFeedback {...formItemLayout}>
              {getFieldDecorator('cardNo', {
                initialValue: item.cardNo,
                rules: [
                  {
                    required: getFieldValue('typeCode') !== 'C' && getFieldValue('typeCode') !== 'G',
                    pattern: /^[a-z0-9-/.,_]+$/i,
                    message: 'please insert the value'
                  }
                ]
              })(<Input disabled={getFieldValue('typeCode') === 'C' || getFieldValue('typeCode') === 'G'} maxLength={30} style={{ width: '100%' }} />)}
            </FormItem>
            <FormItem label="Check No" hasFeedback {...formItemLayout}>
              {getFieldDecorator('checkNo', {
                initialValue: item.checkNo,
                rules: [
                  {
                    required: getFieldValue('typeCode') === 'G',
                    pattern: /^[a-z0-9-/.,_]+$/i,
                    message: 'please insert the value'
                  }
                ]
              })(<Input disabled={!(getFieldValue('typeCode') === 'G')} maxLength={30} style={{ width: '100%' }} />)}
            </FormItem>
          </Col>
        </Row>
      </Form>
    </Modal >
  )
}

modal.propTypes = {
  form: PropTypes.object.isRequired,
  onOk: PropTypes.func,
  onCancel: PropTypes.func
}

export default Form.create()(modal)
