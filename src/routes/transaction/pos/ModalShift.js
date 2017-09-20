import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'dva'
import {Table, Modal, Button, Form, Card, Input, Cascader} from 'antd'
import {browserHistory} from 'dva/router'

const FormItem = Form.Item
const formItemLayout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 10,
  },
}

const listShift = [{
  value: "1",
  label: "1"
},
  {
    value: "2",
    label: "2"
  },
  {
    value: "3",
    label: "3"
  }]

const getDate = (mode) => {
  let today = new Date()
  let dd = today.getDate()
  let mm = today.getMonth() + 1 //January is 0!
  let yyyy = today.getFullYear()

  if (dd < 10) {
    dd = '0' + dd
  }

  if (mm < 10) {
    mm = '0' + mm
  }

  if (mode == 1) {
    today = dd + mm + yyyy
  }
  else if (mode == 2) {
    today = mm + yyyy
  }
  else if (mode == 3) {
    today = yyyy + '-' + mm + '-' + dd
  }

  return today
}

const ModalShift = ({
                      item,
                      listCashier,
                      curCashierNo,
                      cashierId,
                      onBack,
                      onOk,
                      form: {
                        getFieldDecorator,
                        validateFields,
                        getFieldsValue,
                      },
                      ...modalProps
                    }) => {


  const handleOk = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue(),
        cashierId: cashierId,
        transDate: getDate(3),
        total: 0,
        totalCreditCard: 0,
        status: 'O',
      }
      data.cashierNo = data.cashierNo.join(' ')
      data.shift = data.shift.join(' ')

      onOk(data)
    })
  }

  const handleBack = () => {
    onBack()
    browserHistory.goBack
  }

  const modalOpts = {
    ...modalProps,
  }

  return (
    <Modal title="Cashier Information" {...modalOpts} footer={[
      <Button key="back" size="large" onClick={handleBack}>Back</Button>,
      <Button key="submit" type="primary" size="large" onClick={handleOk}>
        Confirm
      </Button>,
    ]} closable={false}>
      <Form layout="horizontal">
        <FormItem label="Cashier No" hasFeedback {...formItemLayout}>
          {getFieldDecorator('cashierNo', {
            initialValue: item.cashierNo && item.cashierNo.split(' '),
            rules: [
              {
                required: true
              },
            ],
          })(<Cascader
            size="large"
            style={{width: '100%'}}
            options={listCashier}
            placeholder="Pick Cashier No"
          />)}
        </FormItem>
        <FormItem label="Shift" hasFeedback {...formItemLayout}>
          {getFieldDecorator('shift', {
            initialValue: ( item.shift ? item.shift.toString() && item.shift.toString().split(' ') : "" ),
            rules: [
              {
                required: true
              },
            ],
          })(<Cascader
            size="large"
            style={{width: '100%'}}
            options={listShift}
            placeholder="Pick a Shift"
          />)}
        </FormItem>
        <FormItem label="Balance" hasFeedback {...formItemLayout}>
          {getFieldDecorator('balance', {
            initialValue: item.balance || 0,
            rules: [
              {
                required: true,
                pattern: /^[0-9]{1,50}$/i,
                message: 'Balance must be a number...!',

              },
            ],
          })(<Input />)}
        </FormItem>
      </Form>
    </Modal>
  )
}

ModalShift.propTypes = {
  form: PropTypes.object.isRequired,
  type: PropTypes.string,
  item: PropTypes.object,
  stock: PropTypes.object,
  curCashierNo: PropTypes.string,
  cashierId: PropTypes.string,
  listCashier: PropTypes.object,
  onOk: PropTypes.func,
}

export default Form.create()(ModalShift)
