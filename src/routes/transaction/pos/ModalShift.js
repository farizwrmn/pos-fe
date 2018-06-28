import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { Modal, Button, Form, Input, DatePicker, Select } from 'antd'
import { routerRedux } from 'dva/router'

const FormItem = Form.Item
const Option = Select.Option

const formItemLayout = {
  labelCol: {
    span: 8
  },
  wrapperCol: {
    span: 10
  }
}

// const listShift = [
//   {
//     value: '1',
//     label: '1'
//   },
//   {
//     value: '2',
//     label: '2'
//   },
//   {
//     value: '3',
//     label: '3'
//   }]

const ModalShift = ({ currentCashier, findShift, listShift, findCounter, listCounter, getCashier, item, dispatch, listCashier, cashierId, onBack, onOk, form: {
  getFieldDecorator,
  validateFields,
  getFieldsValue
}, ...modalProps }) => {
  const handleOk = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = { ...getFieldsValue() }


      data.period = moment(data.period).format('YYYY-MM-DD')
      data.status = currentCashier.status
      data.storeId = currentCashier.storeId
      data.cashierId = currentCashier.cashierId || cashierId
      // const data = {
      //   ...getFieldsValue(),
      //   cashierId,
      // transDate: getDate(3),
      //   total: 0,
      //   totalCreditCard: 0,
      //   status: 'O'
      // }
      // data.cashierNo = data.counter.join(' ')
      // data.shift = data.shift.join(' ')
      onOk(data)
    })
  }

  const handleBack = () => {
    dispatch(routerRedux.push({
      pathname: '/dashboard'
    }))
  }

  const modalOpts = {
    ...modalProps
  }

  let shifts = []
  let counters = []
  if (listShift && listShift.length > 0) {
    shifts = listShift.map(x => (<Option value={x.id} >{x.shiftName}</Option>))
  }
  if (listCounter && listCounter.length > 0) {
    counters = listCounter.map(x => (<Option value={x.id} >{x.counterName}</Option>))
  }

  return (
    <Modal title="Cashier Information"
      {...modalOpts}
      footer={[
        <Button key="back" size="large" onClick={handleBack}>Home</Button>,
        <Button key="submit" type="primary" size="large" onClick={handleOk}>
          Confirm
        </Button>
      ]}
      closable={false}
    >
      {/* <Form layout="horizontal">
        <FormItem label="Cashier No" hasFeedback {...formItemLayout}>
          {getFieldDecorator('cashierNo', {
            initialValue: item.cashierNo && item.cashierNo.split(' '),
            rules: [
              {
                required: true
              }
            ]
          })(<Cascader
            onFocus={getCashier}
            size="large"
            style={{ width: '100%' }}
            options={listCashier}
            placeholder="Pick Cashier No"
          />)}
        </FormItem>
        <FormItem label="Shift" hasFeedback {...formItemLayout}>
          {getFieldDecorator('shift', {
            initialValue: (item.shift ? item.shift.toString() && item.shift.toString().split(' ') : ''),
            rules: [
              {
                required: true
              }
            ]
          })(<Cascader
            size="large"
            style={{ width: '100%' }}
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
                message: 'Balance must be a number...!'

              }
            ]
          })(<Input />)}
        </FormItem>
      </Form> */}

      <Form layout="horizontal">
        <FormItem label="Open" hasFeedback {...formItemLayout}>
          {getFieldDecorator('period', {
            initialValue: currentCashier.period ? moment(currentCashier.period, 'YYYY-MM-DD') : moment(new Date(), 'YYYY-MM-DD'),
            rules: [
              {
                required: true
              }
            ]
          })(<DatePicker disabled={currentCashier.period} style={{ width: '100%' }} />)}
        </FormItem>
        <FormItem label="Shift" hasFeedback {...formItemLayout}>
          {getFieldDecorator('shiftId', {
            initialValue: currentCashier.shiftId,
            rules: [
              {
                required: true
              }
            ]
          })(<Select disabled={currentCashier.shiftId != null} onFocus={findShift}>
            {shifts}
          </Select>)}
        </FormItem>
        <FormItem label="Counter" hasFeedback {...formItemLayout}>
          {getFieldDecorator('counterId', {
            initialValue: currentCashier.counterId,
            rules: [
              {
                required: true
              }
            ]
          })(<Select disabled={currentCashier.counterId != null} onFocus={findCounter}>
            {counters}
          </Select>)}
        </FormItem>
        <FormItem label="Current Balance" {...formItemLayout}>
          {getFieldDecorator('cash', {
            initialValue: currentCashier.cash || 0
          })(<Input disabled />)}
        </FormItem>
      </Form>
    </Modal>
  )
}

ModalShift.propTypes = {
  form: PropTypes.isRequired,
  type: PropTypes.string.isRequired,
  item: PropTypes.isRequired,
  stock: PropTypes.isRequired,
  curCashierNo: PropTypes.string.isRequired,
  cashierId: PropTypes.string.isRequired,
  listCashier: PropTypes.isRequired,
  onOk: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
  dispatch: PropTypes.func
}

export default Form.create()(ModalShift)
