import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Table, Modal, Button, Form, Card, Input, Select, Cascader } from 'antd'

const FormItem = Form.Item
const formItemLayout = {
  labelCol: {
    span: 10,
  },
  wrapperCol: {
    span: 14,
  },
}

const ModalCreditCard = ({payment, stock, app, dispatch, ...modalProps}) => {
  const { listCreditCharge, creditCharge, creditChargeAmount, creditCardTotal, totalPayment, totalChange, creditCardNo, creditCardType, } = payment
  const { memberInformation, technicianInformation, curTotalDiscount, curTotal, curRounding, curShift, curCashierNo, } = stock
  const { user } = app

  const modalOpts = {
    ...modalProps,
  }

  const getDate = (mode) => {
    var today = new Date()
    var dd = today.getDate()
    var mm = today.getMonth()+1 //January is 0!
    var yyyy = today.getFullYear()

    if(dd<10) {
      dd='0'+dd
    }

    if(mm<10) {
      mm='0'+mm
    }

    if ( mode == 1 ) {
      today = dd+mm+yyyy
    }
    else if ( mode == 2 ) {
      today = mm+yyyy
    }
    else if ( mode == 3 ) {
      today = yyyy + '-' + mm + '-' + dd
    }

    return today
  }

  const setTime = () => {
    var today = new Date()
    var h = today.getHours()
    var m = today.getMinutes()
    var s = today.getSeconds()
    m = checkTime(m)
    s = checkTime(s)

    return h + ":" + m + ":" + s
  }

  const checkTime = (i) => {
    if (i < 10) {i = "0" + i}  // add zero in front of numbers < 10
    return i
  }

  const onChangeType = (value) => {
    dispatch({
      type: 'payment/getCreditCharge',
      payload: { creditCode: `${value}`,
                 netto: parseInt(curTotal) + parseInt(curRounding), }
    })
  }

  const onChangeCreditCardNo = (e) => {
    const {value} = e.target
    const reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/;
    if ((!isNaN(value) && reg.test(value)) || value === '' || value === '-') {
      dispatch({
        type: 'payment/setCreditCardNo',
        payload: {
          creditCardNo: value,
        },
      })
    }
  }

  const handlePayment = () => {
    Modal.confirm({
      title: 'Confirm this payment?',
      content: 'This Operation cannot be undone...!',
      onOk() {

        dispatch({
          type: 'payment/create',
          payload: { periode: getDate(2),
            transDate: getDate(1),
            transDate2: getDate(3),
            transTime: setTime(),
            grandTotal: parseInt(curTotal) + parseInt(curTotalDiscount),
            totalPayment: totalPayment,
            creditCardNo: creditCardNo,
            creditCardType: creditCardType,
            creditCardCharge: creditCharge,
            totalCreditCard: creditCardTotal,
            totalChange: totalChange,
            totalDiscount: curTotalDiscount,
            rounding: curRounding,
            memberCode: memberInformation.memberCode,
            technicianId: technicianInformation.employeeId,
            curShift: curShift,
            curCashierNo: curCashierNo,
            cashierId: user.userid,
          }
        })
      },
      onCancel() {},
    })
  }

  const handleCancel = () => {
    dispatch({
      type: 'payment/setCreditCardPaymentNull',
    })

    dispatch({
      type: 'payment/hideCreditModal',
    })
  }

  return (
    <Modal {...modalOpts} width="768" footer={[]}>
      <Card bordered={false} title="Credit Card Information">
        <Form layout="horizontal">
          <FormItem label="Credit Card No." {...formItemLayout}>
            <Input value={creditCardNo} onChange={(e) => onChangeCreditCardNo(e)} size="large" style={{ fontSize: 16 }} />
          </FormItem>
          <FormItem label="Credit Card Type" {...formItemLayout}>
            <Cascader
              size="large"
              style={{ width: '100%' }}
              options={listCreditCharge}
              placeholder="Pick Credit Card Type"
              onChange={onChangeType}
            />
          </FormItem>
          <FormItem label="Charge (%)" {...formItemLayout}>
            <Input value={creditCharge} size="large" style={{ fontSize: 16 }} disabled />
          </FormItem>
          <FormItem label="Charge (IDR)" {...formItemLayout}>
            <Input value={creditChargeAmount} size="large" style={{ fontSize: 16 }} disabled />
          </FormItem>
          <FormItem label="Amount Payment" {...formItemLayout}>
            <Input value={creditCardTotal} size="large" style={{ fontSize: 16 }} disabled />
          </FormItem>
        </Form>
      </Card>

      <Form layout="inline">
        <FormItem>
          <Button type="primary" onClick={handlePayment}>Confirm Payment</Button>
        </FormItem>
        <FormItem>
          <Button type="primary" onClick={handleCancel}>Cancel</Button>
        </FormItem>
      </Form>

    </Modal>
  )
}

ModalCreditCard.propTypes = {
  payment: PropTypes.object,
  stock: PropTypes.object,
  app: PropTypes.object,
  dispatch: PropTypes.func,
}

export default connect(({ stock, payment, app }) => ({ stock, payment, app }))(ModalCreditCard)
