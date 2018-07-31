import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { Modal, Button, Form, Input, DatePicker, Select, Badge } from 'antd'
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

const ModalShift = ({ currentCashier, findShift, listShift, findCounter, listCounter, getCashier, item, infoCashRegister, dispatch, listCashier, cashierId, onBack, onOk, form: {
  getFieldDecorator,
  validateFields,
  getFieldsValue
}, ...modalProps }) => {
  const disabledDate = (current) => {
    if (Number(infoCashRegister.cashActive)) {
      return true
    }
    return current < moment(infoCashRegister.cashActive ? currentCashier.period : new Date()).add(-1, 'days').endOf('day') || current > moment(infoCashRegister.cashActive ? currentCashier.period : new Date()).add(0, 'days').endOf('day')
  }

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

  let initPeriod = moment(Number(infoCashRegister.cashActive) ? currentCashier.period : new Date(), 'YYYY-MM-DD')
  let shifts = []
  let counters = []
  if (listShift && listShift.length > 0) {
    shifts = listShift.map(x => (<Option value={x.id} >{x.shiftName}</Option>))
  }
  if (listCounter && listCounter.length > 0) {
    counters = listCounter.map(x => (<Option value={x.id} >{x.counterName}</Option>))
  }

  return (
    <Modal title={infoCashRegister.CaptionObject}
      {...modalOpts}
      footer={[
        <Button key="back" size="large" onClick={handleBack}>Home</Button>,
        <Button key="submit" type="primary" size="large" onClick={handleOk}>
                    Confirm
        </Button>
      ]}
      closable={false}
    >
      <Form layout="horizontal">
        <FormItem label="Open" hasFeedback {...formItemLayout}>
          {getFieldDecorator('period', {
            initialValue: initPeriod,
            rules: [
              {
                required: true
              }
            ]
          })(<DatePicker disabledDate={disabledDate} style={{ width: '100%' }} />)}
          <Badge dot={infoCashRegister.dotVisible} />
        </FormItem>
        <FormItem label="Shift" hasFeedback {...formItemLayout}>
          {getFieldDecorator('shiftId', {
            initialValue: currentCashier.shiftId,
            rules: [
              {
                required: true
              }
            ]
          })(<Select disabled={infoCashRegister.cashActive} onFocus={findShift}>
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
          })(<Select disabled={infoCashRegister.cashActive} onFocus={findCounter}>
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
