import React from 'react'
import { Checkbox, Card, Form, Row, Col } from 'antd'

const FormItem = Form.Item

const formItemLayout = {
  labelCol: {
    xs: { span: 11 },
    sm: { span: 6 },
    md: { span: 11 },
    lg: { span: 7 }
  },
  wrapperCol: {
    xs: { span: 13 },
    sm: { span: 10 },
    md: { span: 13 },
    lg: { span: 17 }
  }
}

const cashRegisterPeriodsLayout = {
  xs: 24,
  sm: 10,
  md: 24,
  lg: 8
}

const Setting = ({
  listShift,
  listCounter,
  setting,
  changeShift,
  changeCounter,
  changeMemberCode,
  changeCashRegisterPeriods
}) => {
  let cashRegisterPeriods = (
    <Row>
      <Col {...cashRegisterPeriodsLayout}>
        <Checkbox checked={setting.cashRegisterPeriods.active} onChange={x => changeCashRegisterPeriods(x)} value="active">Active</Checkbox>
      </Col>
      <Col {...cashRegisterPeriodsLayout}>
        <Checkbox checked={setting.cashRegisterPeriods.autoClose} onChange={x => changeCashRegisterPeriods(x)} value="autoClose">Auto Close</Checkbox>
      </Col>
    </Row>
  )
  let shifts = []
  let counters = []
  if (listShift && listShift.length > 0) {
    shifts = listShift.map(x => (<p><Checkbox checked={setting.selectedShift ? setting.selectedShift.indexOf(x.id) > -1 : false} onChange={x => changeShift(x)} value={x.id} >{x.shiftName}</Checkbox></p>))
  }
  if (listCounter && listCounter.length > 0) {
    counters = listCounter.map(x => (<p><Checkbox checked={setting.selectedCounter ? setting.selectedCounter.indexOf(x.id) > -1 : false} onChange={x => changeCounter(x)} value={x.id} >{x.counterName}</Checkbox></p>))
  }
  return (
    <Card title="Setting">
      <FormItem label="Cash Register Periods" {...formItemLayout} >
        {cashRegisterPeriods}
      </FormItem>
      <FormItem label="Shift(s)" {...formItemLayout}>
        <Card>
          {shifts}
        </Card>
      </FormItem>
      <FormItem label="Counter(s)" {...formItemLayout}>
        <Card>
          {counters}
        </Card>
      </FormItem>
      <FormItem label="Member Code(s)" {...formItemLayout}>
        <Checkbox checked={setting.memberCode} onChange={x => changeMemberCode(x)}>By System</Checkbox>
      </FormItem>
    </Card>
  )
}

export default Setting
