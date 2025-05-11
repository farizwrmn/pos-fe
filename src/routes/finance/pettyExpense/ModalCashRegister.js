import React, { Component } from 'react'
import { Modal, Select, InputNumber, Form, Input, Button } from 'antd'
import { lstorage } from 'utils'
import { decrypt } from 'utils/crypt'

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
      const selector = document.getElementById('depositTotal')
      if (selector) {
        selector.focus()
        selector.select()
      }
    }, 300)
  }

  render () {
    const {
      loading,
      listAccountCode,
      listAllStores,
      form: {
        getFieldDecorator,
        validateFields,
        getFieldsValue,
        resetFields
      },
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
          data.storeId = lstorage.getCurrentUserStore()
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
    const listAccount = listAccountCode.map(x => (<Option title={`${x.accountName} (${x.accountCode})`} value={x.id} key={x.id}>{`${x.accountName} (${x.accountCode})`}</Option>))
    const listStoreTarget = localStorage.getItem('tStoreUser') ? JSON.parse(decrypt(localStorage.getItem('tStoreUser'))) : []
    const listStore = listAllStores.filter(filtered => listStoreTarget.includes(filtered.value)).map(x => (<Option title={x.label} value={x.value} key={x.value}>{x.label}</Option>))

    return (
      <Modal
        {...modalOpts}
        title="Add More Cash/Discount"
        onCancel={onCancel}
        footer={[
          <Button disabled={loading} size="large" key="back" onClick={onCancel}>Cancel</Button>,
          <Button disabled={loading} size="large" key="submit" type="primary" onClick={handleOk}>Ok</Button>
        ]}
      >
        <Form layout="horizontal">
          <FormItem
            label="From Store"
            hasFeedback
            {...formItemLayout}
          >
            {getFieldDecorator('fromStore', {
              rules: [{
                required: true
              }]
            })(
              <Select
                mode="default"
                size="large"
                showSearch
                style={{ width: '100%' }}
                placeholder="Choose Store"
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              >
                {listStore}
              </Select>
            )}
          </FormItem>
          <FormItem
            label="Bank"
            hasFeedback
            {...formItemLayout}
          >
            {getFieldDecorator('depositAccountId', {
              rules: [{
                required: true
              }]
            })(
              <Select
                showSearch
                size="large"
                style={{ width: '100%' }}
                placeholder="Choose Bank"
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              >
                {listAccount}
              </Select>
            )}
          </FormItem>
          <FormItem
            label="To Store"
            hasFeedback
            {...formItemLayout}
          >
            {getFieldDecorator('toStore', {
              rules: [{
                required: true
              }]
            })(
              <Select
                mode="default"
                size="large"
                showSearch
                style={{ width: '100%' }}
                placeholder="Choose Store"
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              >
                {listStore}
              </Select>
            )}
          </FormItem>
          <FormItem label="Debit" hasFeedback {...formItemLayout}>
            {getFieldDecorator('depositTotal', {
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
                pattern: /^[A-Za-z0-9-.,;:?()@= _/]{5,40}$/i,
                message: 'a-Z & 0-9, min: 5, max: 40'
              }]
            })(<Input maxLength={40} autoFocus />)}
          </FormItem>
          <FormItem label="Description" hasFeedback {...formItemLayout}>
            {getFieldDecorator('description', {
              rules: [{
                required: true,
                pattern: /^[A-Za-z0-9-.,;:?()@= _/]{20,99999}$/i,
                message: 'a-Z & 0-9, min: 20, max: 99999'
              }]
            })(<TextArea maxLength={99999} autosize={{ minRows: 2, maxRows: 6 }} />)}
          </FormItem>
        </Form>
      </Modal>
    )
  }
}

export default Form.create()(ModalCashRegister)
