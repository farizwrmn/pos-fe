import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Modal, Button, Form, Card, Input, Cascader } from 'antd'

const FormItem = Form.Item
const formItemLayout = {
  labelCol: {
    span: 10
  },
  wrapperCol: {
    span: 14
  }
}

const ModalCreditCard = ({ payment, stock, app, dispatch, ...modalProps }) => {
  const { listCreditCharge, creditCharge, creditChargeAmount, creditCardTotal, totalPayment, totalChange, creditCardNo, creditCardType } = payment
  const { memberInformation, technicianInformation, curTotalDiscount, curTotal, curRounding, curShift, curCashierNo } = stock
  const { user } = app

  const modalOpts = {
    ...modalProps
  }

  const getDate = (mode) => {
    let today = new Date()
    let dd = today.getDate()
    let mm = today.getMonth() + 1 // January is 0!
    let yyyy = today.getFullYear()

    if (dd < 10) {
      dd = `0${dd}`
    }

    if (mm < 10) {
      mm = `0${mm}`
    }

    if (mode === 1) {
      today = dd + mm + yyyy
    } else if (mode === 2) {
      today = mm + yyyy
    } else if (mode === 3) {
      today = `${yyyy}-${mm}-${dd}`
    }

    return today
  }
  const checkTime = (i) => {
    if (i < 10) { i = `0${i}` } // add zero in front of numbers < 10
    return i
  }
  const setTime = () => {
    let today = new Date()
    let h = today.getHours()
    let m = today.getMinutes()
    let s = today.getSeconds()
    m = checkTime(m)
    s = checkTime(s)

    return `${h}:${m}:${s}`
  }

  const onChangeType = (value) => {
    dispatch({
      type: 'payment/getCreditCharge',
      payload: { creditCode: `${value}`,
        netto: parseInt(curTotal, 10) + parseInt(curRounding, 10) }
    })
  }

  const onChangeCreditCardNo = (e) => {
    const { value } = e.target
    const reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/
    if ((!isNaN(value) && reg.test(value)) || value === '' || value === '-') {
      dispatch({
        type: 'payment/setCreditCardNo',
        payload: {
          creditCardNo: value
        }
      })
    }
  }

  const handlePayment = () => {
    Modal.confirm({
      title: 'Confirm this payment?',
      content: 'This Operation cannot be undone...!',
      onOk () {
        dispatch({
          type: 'payment/create',
          payload: { periode: getDate(2),
            transDate: getDate(1),
            transDate2: getDate(3),
            transTime: setTime(),
            grandTotal: parseInt(curTotal, 10) + parseInt(curTotalDiscount, 10),
            totalPayment,
            creditCardNo,
            creditCardType,
            creditCardCharge: creditCharge,
            totalCreditCard: creditCardTotal,
            totalChange,
            totalDiscount: curTotalDiscount,
            rounding: curRounding,
            memberCode: memberInformation.memberCode,
            technicianId: technicianInformation.employeeId,
            curShift,
            curCashierNo,
            cashierId: user.userid
          }
        })
      },
      onCancel () {}
    })
  }

  const handleCancel = () => {
    dispatch({
      type: 'payment/setCreditCardPaymentNull'
    })

    dispatch({
      type: 'payment/hideCreditModal'
    })
  }

  return (
    <Modal {...modalOpts} width="768" footer={[]}>
      <Card bordered={false} title="Credit Card Information">
        <Form layout="horizontal">
          <FormItem label="Credit Card No." {...formItemLayout}>
            <Input value={creditCardNo} onChange={e => onChangeCreditCardNo(e)} size="large" style={{ fontSize: 16 }} />
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
  dispatch: PropTypes.func
}

export default connect(({ stock, payment, app }) => ({ stock, payment, app }))(ModalCreditCard)
