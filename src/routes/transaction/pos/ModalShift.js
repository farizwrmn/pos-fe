import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { Modal, Button, Form, Input, DatePicker, Select, Badge, Icon } from 'antd'
import { routerRedux } from 'dva/router'
import { lstorage, color } from 'utils'

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

const ModalShift = ({ currentCashier, findShift, listShift, findCounter, listCounter, getCashier, item, dispatch, listCashier, cashierId, onBack, onOk, form: {
  getFieldDecorator,
  validateFields,
  getFieldsValue
}, ...modalProps }) => {
  const cashActive = (currentCashier.cashActive || 0) !== 0

  let infoCashRegister = {}
  infoCashRegister.title = 'Cashier Information'
  infoCashRegister.titleColor = color.normal
  infoCashRegister.descColor = color.error
  infoCashRegister.dotVisible = false

  if (lstorage.getLoginTimeDiff() > 500) {
    console.log('something fishy')
  } else {
    if (!currentCashier.period) {
      infoCashRegister.desc = '* Select the correct cash register'
      infoCashRegister.dotVisible = true
    } else if (currentCashier.period !== moment(new Date(), 'DD/MM/YYYY').subtract(lstorage.getLoginTimeDiff(), 'milliseconds').toDate().format('yyyy-MM-dd')) {
      infoCashRegister.desc = '* The open cash register date is different from current date'
      infoCashRegister.dotVisible = true
    }

    infoCashRegister.Caption =
      (<span style={{ color: infoCashRegister.titleColor }}>
        <Icon type={cashActive ? 'smile-o' : 'frown-o'} /> {infoCashRegister.title}
        <span style={{ display: 'block', color: infoCashRegister.descColor }}>
          {infoCashRegister.desc}
        </span>
      </span>)
  }
  const disabledDate = (current) => {
    if (cashActive) {
      return true
    }
    return current > moment(new Date())
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

  let initPeriod = moment(new Date(), 'YYYY-MM-DD')
  if (cashActive) {
    initPeriod = moment(currentCashier.period, 'YYYY-MM-DD')
  } else if (currentCashier.period) {
    initPeriod = moment(currentCashier.period, 'YYYY-MM-DD')
  } else {
    initPeriod = moment(new Date(), 'YYYY-MM-DD')
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
    <Modal title={infoCashRegister.Caption}
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
          })(<Select disabled={cashActive} onFocus={findShift}>
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
          })(<Select disabled={cashActive} onFocus={findCounter}>
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
