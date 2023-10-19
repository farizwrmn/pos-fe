import React, { Component } from 'react'
import { Modal, InputNumber, Form, Input, Button, message } from 'antd'
import { generateId } from 'utils/crypt'
import moment from 'moment'
import io from 'socket.io-client'
import { APISOCKET } from 'utils/config.company'
import { lstorage } from 'utils'

const options = {
  upgrade: true,
  transports: ['websocket'],
  pingTimeout: 100,
  pingInterval: 100
}

const socket = io(APISOCKET, options)

const FormItem = Form.Item
const { TextArea } = Input

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 14 }
}

class ModalCashRegister extends Component {
  state = {
    endpoint: 'verification'
  }

  componentDidMount () {
    message.info('Buka aplikasi Fingerprint')
    this.setEndpoint()
    setTimeout(() => {
      const selector = document.getElementById('expenseTotal')
      if (selector) {
        selector.focus()
        selector.select()
      }
    }, 300)
  }

  componentWillUnmount () {
    const { endpoint } = this.state
    socket.off(`fingerprint/${endpoint}`)
  }

  onCopy = (endpoint) => {
    let textarea = document.createElement('textarea')
    textarea.id = 'temp_element'
    textarea.style.height = 0
    document.body.appendChild(textarea)
    textarea.value = endpoint
    let selector = document.querySelector('#temp_element')
    selector.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
    message.success('Success to key to clipboard')
  }

  setEndpoint = () => {
    const {
      registerFingerprint,
      validationType = 'login'
    } = this.props
    const endpoint = generateId(16)
    this.setState({ endpoint })
    if (registerFingerprint) {
      registerFingerprint({
        employeeId: undefined,
        endpoint,
        validationType,
        applicationSource: 'web'
      })
      this.onCopy(endpoint)
    }
    this.setSocket(endpoint)
  }

  setSocket = (endpoint) => {
    const { endpoint: endpointState } = this.state
    if (endpointState === 'verification' && endpoint) {
      socket.on(`fingerprint/${endpoint}`, this.handleData)
    }
  }

  handleData = (data) => {
    const { dispatch } = this.props
    if (dispatch && data && data.success) {
      dispatch({
        type: 'pos/setEmployee',
        payload: data.profile
      })
    }
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
      currentItem,
      listEmployee,
      onOk,
      onCancel,
      ...modalProps
    } = this.props

    let defaultRole = (lstorage.getStorageKey('udi')[2] || '')
    const handleOk = () => {
      if (defaultRole === 'HKS') {
        message.info('Hanya Kepala Toko yang boleh menginput expense')
        return
      }
      validateFields((errors) => {
        if (errors) {
          return
        }

        const data = {
          ...getFieldsValue(),
          employeeId: currentItem.id
        }
        data.cashierInput = JSON.stringify(data)
        onOk(data, resetFields)
      })
    }

    const handleCancel = () => {
      resetFields()
      onCancel()
    }

    const modalOpts = {
      ...modalProps,
      onOk: handleOk
    }

    return (
      <Modal
        {...modalOpts}
        onCancel={handleCancel}
        title="Input Expense"
        footer={[
          <Button disabled={loading} size="large" key="back" onClick={onCancel}>Cancel</Button>,
          <Button disabled={loading} size="large" key="submit" type="primary" onClick={handleOk}>Ok</Button>
        ]}
      >
        <Form layout="horizontal">
          <FormItem label="Date" hasFeedback {...formItemLayout}>
            {getFieldDecorator('dateTime', {
              initialValue: moment().format('YYYY-MM-DD'),
              rules: [{
                required: true
              }]
            })(
              <Input disabled />
            )}
          </FormItem>
          <FormItem label="Expense" hasFeedback {...formItemLayout}>
            {getFieldDecorator('expenseTotal', {
              initialValue: 0,
              rules: [{
                pattern: /^([0-9]{0,19})$/i,
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
          <FormItem label="Discount" hasFeedback {...formItemLayout}>
            {getFieldDecorator('discount', {
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
            {getFieldDecorator('employeeName', {
              initialValue: currentItem.employeeName,
              rules: [{
                required: true
              }]
            })(
              <Input disabled />
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
                pattern: /^[A-Za-z0-9-.,;:?()@= _/]{20,255}$/i,
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
