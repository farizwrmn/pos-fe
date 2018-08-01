import React from 'react'
import { connect } from 'dva'
import { isEmptyObject } from 'utils'
import { Row, Col, Button, Form, Input, Icon, DatePicker, Modal } from 'antd'
import moment from 'moment'
import ViewDetail from './viewDetail'

const FormItem = Form.Item
const confirm = Modal.confirm
const warning = Modal.warning

const formItemLayout = {
  labelCol: { span: 7 },
  wrapperCol: {
    xs: { span: 12, offset: 4 },
    sm: { span: 12, offset: 4 },
    md: { span: 9 },
    lg: { span: 9 }
  }
}

const formItemLayout2 = {
  labelCol: { span: 7 },
  wrapperCol: {
    xs: { span: 12, offset: 4 },
    sm: { span: 12, offset: 4 },
    md: { span: 13 },
    lg: { span: 13 }
  }
}

const column = {
  xs: { span: 24 },
  sm: { span: 24 },
  md: { span: 12 },
  lg: { span: 12 },
  xl: { span: 12 }
}


const CloseCashRegister = ({
  cashier,
  dispatch,
  form: {
    getFieldDecorator,
    getFieldValue,
    getFieldsValue,
    validateFields
  }
}) => {
  const { listCashTransSummary, listCashTransDetail, activeTabKeyClose, cashierInfo } = cashier

  if (isEmptyObject(cashierInfo)) {
    cashierInfo.id = null
    cashierInfo.cashierId = ''
    cashierInfo.storeId = null
    cashierInfo.storeName = ''
    cashierInfo.shiftId = null
    cashierInfo.shiftName = ''
    cashierInfo.counterId = null
    cashierInfo.counterName = ''
    cashierInfo.period = null
    cashierInfo.periodDesc = ''
    cashierInfo.status = ''
    cashierInfo.openingBalance = 0
  }
  const showSummary = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      let item = { ...getFieldsValue() }
      item.cashierId = cashierInfo.cashierId
      dispatch({
        type: 'cashier/getCashierTransSource',
        payload: {
          cashierId: cashierInfo.cashierId,
          id: cashierInfo.id
        }
      })
    })
  }

  let summary = {
    total: {
      openingCash: cashierInfo.openingBalance,
      cashIn: 0,
      cashOut: 0
    }
  }
  if (listCashTransSummary) {
    if (listCashTransSummary.hasOwnProperty('data')) {
      summary.total.cashIn = listCashTransSummary.total[0].cashIn
      summary.total.cashOut = listCashTransSummary.total[0].cashOut
    }
  }
  summary.total.cashOnHand = (summary.total.openingCash + summary.total.cashIn) - summary.total.cashOut

  const viewDetailProps = {
    listCashTransSummary,
    summary,
    listCashTransDetail,
    showDetail (record) {
      dispatch({
        type: 'cashier/getCashierTransSourceDetail',
        payload: {
          cashierId: cashierInfo.cashierId,
          id: cashierInfo.id,
          transType: record
        }
      })
    },
    dispatch,
    activeTabKeyClose
  }

  const confirmClose = () => {
    if (!isEmptyObject(listCashTransSummary)) {
      confirm({
        title: 'Are you sure closing this cash register ?',
        onOk () {
          dispatch({
            type: 'cashier/closeCashRegister',
            payload: {
              storeId: cashierInfo.storeId,
              cashierId: cashierInfo.cashierId,
              id: cashierInfo.id,
              desc: getFieldValue('periodDesc'),
              openingCash: cashierInfo.openingBalance,
              cashIn: listCashTransSummary ? listCashTransSummary.total[0].cashIn : 0,
              cashOut: listCashTransSummary ? listCashTransSummary.total[0].cashOut : 0,
              closingBalance: (parseFloat(cashierInfo.openingBalance) + (listCashTransSummary ? (listCashTransSummary.total[0].cashIn || 0) : 0)) - (listCashTransSummary ? (listCashTransSummary.total[0].cashOut || 0) : 0)
            }
          })
        }
      })
    } else {
      warning({
        title: 'Please check your data first by clicking \'Check\' Button  ?'
      })
    }
  }

  return (
    <div className="content-inner">
      <Row type="flex" justify="start">
        <Col {...column}>
          <FormItem label="Cashier Id" hasFeedback {...formItemLayout}>
            {getFieldDecorator('cashierId', {
              initialValue: cashierInfo.cashierId,
              rules: [{ required: true }]
            })(<Input disabled />)}
          </FormItem>
          <FormItem label="Period" {...formItemLayout} >
            {getFieldDecorator('periods', {
              initialValue: cashierInfo.period ? moment(cashierInfo.period, 'YYYY-MM-DD') : moment(new Date(), 'YYYY-MM-DD'),
              rules: [{ required: true }]
            })(<DatePicker size="large" style={{ width: '100%' }} disabled />
            )}
          </FormItem>
        </Col>
        <Col {...column}>
          <FormItem label="Shift" hasFeedback {...formItemLayout}>
            {getFieldDecorator('shiftName', {
              initialValue: cashierInfo.shiftName || '',
              rules: [{ required: true }]
            })(<Input disabled />)}
          </FormItem>
          <FormItem label="Counter" hasFeedback {...formItemLayout}>
            {getFieldDecorator('counterName', {
              initialValue: cashierInfo.counterName || '',
              rules: [{ required: true }]
            })(<Input disabled />)}
          </FormItem>
        </Col>
      </Row>
      <Row type="flex" justify="start">
        <Col {...column}>
          <FormItem label="Description" hasFeedback {...formItemLayout2}>
            {getFieldDecorator('periodDesc', {
              initialValue: cashierInfo.periodDesc || `Closing ${cashierInfo.period || 'nothing'}`
            })(<Input />)}
          </FormItem>
        </Col>
      </Row>
      <Row type="flex" justify="start">
        <Col span={2} style={{ textAlign: 'left' }}>
          <Button
            type="primary"
            className="button-width02"
            onClick={() => showSummary()}
          >Check
            <Icon type="filter" />
          </Button>
        </Col>
        <Col span={22} style={{ textAlign: 'right' }}>
          <Button
            disabled={cashierInfo.status !== 'O'}
            className="button-width02"
            onClick={() => confirmClose()}
          >Close
            <Icon type="lock" />
          </Button>
        </Col>
      </Row>
      <div className="reminder">
        <ViewDetail {...viewDetailProps} />
      </div>
    </div >
  )
}

export default connect(({ cashier, store, loading }) => ({ cashier, store, loading }))(Form.create()(CloseCashRegister))
