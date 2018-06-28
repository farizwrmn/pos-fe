import React from 'react'
import PropTypes from 'prop-types'
import { Form, InputNumber, Button, Row, Col, Modal, Select, DatePicker, Checkbox } from 'antd'
import moment from 'moment'

const FormItem = Form.Item
const Option = Select.Option

const formItemLayout = {
  labelCol: {
    xs: { span: 8 },
    sm: { span: 4 },
    md: { span: 4 },
    lg: { span: 6 }
  },
  wrapperCol: {
    xs: { span: 16 },
    sm: { span: 12 },
    md: { span: 10 },
    lg: { span: 12 }
  }
}

const column = {
  sm: { span: 24 },
  md: { span: 24 },
  lg: { span: 12 },
  xl: { span: 12 }
}

const FormCashier = ({
  item = {},
  onSubmit,
  onCancel,
  listUser,
  searchUser,
  modalType,
  button,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    resetFields
  }
}) => {
  const tailFormItemLayout = {
    wrapperCol: {
      span: 24,
      xs: {
        offset: modalType === 'edit' ? 12 : 19
      },
      sm: {
        offset: modalType === 'edit' ? 10 : 14
      },
      md: {
        offset: modalType === 'edit' ? 9 : 12
      },
      lg: {
        offset: modalType === 'edit' ? 11 : 15
      }
    }
  }

  const handleCancel = () => {
    onCancel()
    resetFields()
  }

  const handleSubmit = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue()
      }
      data.active = !data.active || data.active === 0 || data.active === false ? 0 : 1
      Modal.confirm({
        title: 'Do you want to save this item?',
        onOk () {
          onSubmit(data)
          // setTimeout(() => {
          resetFields()
          // }, 500)
        },
        onCancel () { }
      })
    })
  }

  let users = []
  if (listUser && listUser.length > 0) {
    users = listUser.map(x => (<Option value={x.userId}>{x.userName}</Option>))
  }

  return (
    <Form layout="horizontal">
      <Row>
        <Col {...column}>
          <FormItem label="Cashier ID" hasFeedback {...formItemLayout}>
            {getFieldDecorator('cashierId', {
              initialValue: item.cashierId,
              rules: [
                {
                  required: true
                }
              ]
            })(<Select
              showSearch
              style={{ width: '100%' }}
              placeholder="Select employee"
              optionFilterProp="children"
              onFocus={searchUser}
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
              {users}
            </Select>)}
          </FormItem>
          <FormItem label="Setup Period" hasFeedback {...formItemLayout}>
            {getFieldDecorator('period', {
              initialValue: item.period ? moment(item.period) : null,
              rules: [
                {
                  required: true
                }
              ]
            })(<DatePicker style={{ width: '100%' }} />)}
          </FormItem>
          <FormItem label="Opening Cash" hasFeedback {...formItemLayout}>
            {getFieldDecorator('cash', {
              initialValue: item.openingCash,
              rules: [
                {
                  required: true
                }
              ]
            })(<InputNumber min={0} style={{ width: '100%' }} />)}
          </FormItem>
          <FormItem label="Cash-In Limit" hasFeedback {...formItemLayout}>
            {getFieldDecorator('cashIn', {
              initialValue: item.cashIn
            })(<InputNumber min={0} style={{ width: '100%' }} disabled />)}
          </FormItem>
          <FormItem label="Cash-Out Limit" hasFeedback {...formItemLayout}>
            {getFieldDecorator('cashOut', {
              initialValue: item.cashOut
            })(<InputNumber min={0} style={{ width: '100%' }} disabled />)}
          </FormItem>
          <FormItem label="Non-Active" {...formItemLayout}>
            {getFieldDecorator('active', {
              initialValue: item.isCashierActive,
              valuePropName: 'checked'
            })(<Checkbox />)}
          </FormItem>
          <FormItem {...tailFormItemLayout}>
            {modalType === 'edit' && <Button type="danger" style={{ margin: '0 10px' }} onClick={handleCancel}>Cancel</Button>}
            <Button type="primary" onClick={handleSubmit}>{button}</Button>
          </FormItem>
        </Col>
      </Row>
    </Form>
  )
}

FormCashier.propTypes = {
  form: PropTypes.object.isRequired,
  item: PropTypes.object,
  onSubmit: PropTypes.func,
  button: PropTypes.string
}

export default Form.create()(FormCashier)
