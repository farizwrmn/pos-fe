import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { Form, Input, Button, Row, Col, Collapse } from 'antd'
import { FormUnit } from '../components'


const FormItem = Form.Item
const Panel = Collapse.Panel

const formItemLayout = {
  labelCol: {
    xs: { span: 10 },
    sm: { span: 8 },
    md: { span: 7 }
  },
  wrapperCol: {
    xs: { span: 14 },
    sm: { span: 14 },
    md: { span: 14 }
  }
}

const column = {
  sm: { span: 24 },
  md: { span: 24 },
  lg: { span: 12 },
  xl: { span: 12 }
}

const formCustomerUnit = ({
  modalType,
  openModal,
  item,
  disabled,
  customerInfo,
  form: {
    getFieldDecorator
  }
}) => {
  const info = (
    <div>
      <FormItem label="Member Code" {...formItemLayout} >
        {getFieldDecorator('memberCode', {
          initialValue: customerInfo.memberCode
        })(<Input disabled />)}
      </FormItem>
      <FormItem label="Member Name" {...formItemLayout}>
        {getFieldDecorator('memberName', {
          initialValue: customerInfo.memberName
        })(<Input disabled />)}
      </FormItem>
      <FormItem label="BirthDate" {...formItemLayout}>
        {getFieldDecorator('birthDate', {
          initialValue: customerInfo.birthDate ? moment(customerInfo.birthDate).format('MMMM Do YYYY') : ''
        })(<Input disabled />)}
      </FormItem>
      <FormItem label="City" {...formItemLayout}>
        {getFieldDecorator('cityName', {
          initialValue: customerInfo.cityName
        })(<Input disabled />)}
      </FormItem>
      <FormItem label="Address" {...formItemLayout}>
        {getFieldDecorator('address01', {
          initialValue: customerInfo.address01
        })(<Input disabled />)}
      </FormItem>
      <FormItem label="Member Type" {...formItemLayout}>
        {getFieldDecorator('memberTypeName', {
          initialValue: customerInfo.memberTypeName
        })(<Input disabled />)}
      </FormItem>
    </div>
  )

  const collapseActiveKey = '1'
  const collapseTitle = customerInfo.memberCode ? `Customer Info(${customerInfo.memberCode})` : 'Customer Info'

  const formUnitProps = {
    modalType,
    item,
    customerInfo
  }

  return (
    <Form layout="horizontal">
      <Row>
        <Col {...column}>
          <FormItem label="Member Code" hasFeedback {...formItemLayout}>
            <Button disabled={disabled} type="primary" size="large" onClick={openModal} style={{ marginBottom: 15 }}>Find Customer</Button>
          </FormItem>
          <FormUnit {...formUnitProps} />
        </Col>
        <Col {...column}>
          <Collapse defaultActiveKey={collapseActiveKey} >
            <Panel header={collapseTitle} key="1">
              {info}
            </Panel>
          </Collapse>
        </Col>
      </Row>
    </Form>
  )
}

formCustomerUnit.propTypes = {
  form: PropTypes.object.isRequired,
  disabled: PropTypes.string,
  item: PropTypes.object,
  listItem: PropTypes.object,
  customerInfo: PropTypes.object,
  clickBrowse: PropTypes.func,
  changeTab: PropTypes.func,
  activeKey: PropTypes.string,
  modalVisible: PropTypes.bool,
  button: PropTypes.string
}

export default Form.create()(formCustomerUnit)
