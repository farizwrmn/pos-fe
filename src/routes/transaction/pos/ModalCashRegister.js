import React, { Component } from 'react'
import { Modal, Select, InputNumber, Form, Input, Button } from 'antd'

const FormItem = Form.Item
const { TextArea } = Input
const { Option } = Select

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 14 }
}

class ModalCashRegister extends Component {
  componentDidMount () {
    setTimeout(() => {
      const selector = document.getElementById('expenseTotal')
      if (selector) {
        selector.focus()
        selector.select()
      }
    }, 300)
  }

  render () {
    const {
      form: {
        getFieldDecorator,
        validateFields,
        getFieldsValue,
        resetFields
      },
      loading,
      listEmployee,
      onOk,
      onCancel,
      ...modalProps
    } = this.props

    const handleOk = () => {
      validateFields((errors) => {
        if (errors) {
          return
        }

        const data = {
          ...getFieldsValue()
        }
        if (data && data.employeeId) {
          const selectedEmployee = listEmployee.filter(filtered => filtered.employeeId === data.employeeId)
          if (selectedEmployee && selectedEmployee[0]) {
            data.employeeName = selectedEmployee[0].employeeName
            onOk(data, resetFields)
          }
        }
      })
    }

    const modalOpts = {
      ...modalProps,
      onOk: handleOk
    }

    const listEmployeeOpt = listEmployee.map(x => (<Option title={x.employeeName} value={x.employeeId} key={x.employeeId}>{x.employeeName}</Option>))

    return (
      <Modal
        {...modalOpts}
        onCancel={onCancel}
        title="Input Expense"
        footer={[
          <Button disabled={loading} size="large" key="back" onClick={onCancel}>Cancel</Button>,
          <Button disabled={loading} size="large" key="submit" type="primary" onClick={handleOk}>Ok</Button>
        ]}
      >
        <Form layout="horizontal">
          <FormItem label="Expense" hasFeedback {...formItemLayout}>
            {getFieldDecorator('expenseTotal', {
              initialValue: 0,
              rules: [{
                required: true
              }]
            })(
              <InputNumber
                style={{ width: '100%' }}
                value={0}
                min={0}
                autoFocus
                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(/\$\s?|(,*)/g, '')}
                onKeyDown={(e) => {
                  if (e.keyCode === 13) {
                    handleOk()
                  }
                }}
              />
            )}
          </FormItem>
          <FormItem
            label="Employee"
            hasFeedback
            {...formItemLayout}
          >
            {getFieldDecorator('employeeId', {
              rules: [{
                required: true
              }]
            })(
              <Select
                showSearch
                mode="default"
                size="large"
                style={{ width: '100%' }}
                placeholder="Choose Employee"
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              >
                {listEmployeeOpt}
              </Select>
            )}
          </FormItem>
          <FormItem label="Reference" hasFeedback {...formItemLayout}>
            {getFieldDecorator('reference', {
              rules: [{
                required: true,
                pattern: /^[A-Za-z0-9-.,;:?() _/]{5,40}$/i,
                message: 'a-Z & 0-9, min: 5, max: 40'
              }]
            })(<Input maxLength={40} autoFocus />)}
          </FormItem>
          <FormItem label="Description" hasFeedback {...formItemLayout}>
            {getFieldDecorator('description', {
              rules: [{
                required: true,
                pattern: /^[A-Za-z0-9-.,;:?() _/]{20,255}$/i,
                message: 'a-Z & 0-9, min: 20, max: 255'
              }]
            })(<TextArea maxLength={255} autosize={{ minRows: 2, maxRows: 6 }} />)}
          </FormItem>
        </Form>
      </Modal>
    )
  }
}

export default Form.create()(ModalCashRegister)
