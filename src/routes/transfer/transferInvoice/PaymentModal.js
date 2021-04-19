import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Modal, Input, Form, InputNumber, Select } from 'antd'

const FormItem = Form.Item

const { Option } = Select

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 }
}

class ModalList extends Component {
  componentDidMount () {
    setTimeout(() => {
      const selector = document.getElementById('chargePercent')
      if (selector) {
        selector.focus()
        selector.select()
      }
    }, 100)
  }

  render () {
    const {
      editModalItem,
      item,
      listAccountCode,
      onSubmit,
      listAccountOpt = (listAccountCode || []).length > 0 ? listAccountCode.map(c => <Option value={c.id} key={c.id} title={`${c.accountName} (${c.accountCode})`}>{`${c.accountName} (${c.accountCode})`}</Option>) : [],
      form: { resetFields, getFieldDecorator, validateFields, getFieldsValue },
      ...modalProps
    } = this.props

    const handleClick = () => {
      validateFields((errors) => {
        if (errors) {
          return
        }
        const data = {
          ...item,
          ...getFieldsValue()
        }
        data.accountId = data.accountId ? data.accountId.key : null
        data.paymentToAccountId = data.paymentToAccountId ? data.paymentToAccountId.key : null
        data.paymentTotal = 0
        onSubmit(data, [], getFieldsValue(), resetFields)
      })
    }

    const modalOpts = {
      ...modalProps,
      onOk: handleClick
    }

    const filterOption = (input, option) => option.props.children.toLowerCase().indexOf(input.toString().toLowerCase()) >= 0

    return (
      <Modal {...modalOpts}>
        <Form>
          <FormItem {...formItemLayout} help={`owing: ${item.paymentTotal}`} label="Payment">
            {getFieldDecorator('paid', {
              initialValue: item.paymentTotal != null ? item.paymentTotal : 0,
              rules: [{
                required: true,
                pattern: /^([0-9.]{0,19})$/i,
                message: 'Payment is not define'
              }]
            })(<InputNumber
              min={0}
              max={item.paymentTotal}
              disabled
              onKeyDown={(e) => {
                if (e.keyCode === 13) {
                  handleClick()
                }
              }}
              style={{ width: '100%' }}
            />)}
          </FormItem>
          <FormItem {...formItemLayout} label="From">
            {getFieldDecorator('accountId', {
              initialValue: listAccountCode && listAccountCode[0] ? {
                key: listAccountCode[0].accountId,
                name: `${listAccountCode[0].accountName || ''} (${listAccountCode[0].accountCode})`
              } : {},
              rules: [{
                required: true,
                message: 'Required'
              }]
            })(<Select
              showSearch
              allowClear
              optionFilterProp="children"
              labelInValue
              filterOption={filterOption}
            >{listAccountOpt}
            </Select>)}
          </FormItem>
          <FormItem {...formItemLayout} label="Payment To">
            {getFieldDecorator('paymentToAccountId', {
              initialValue: listAccountCode && listAccountCode[0] ? {
                key: listAccountCode[0].accountId,
                name: `${listAccountCode[0].accountName || ''} (${listAccountCode[0].accountCode})`
              } : {},
              rules: [{
                required: true,
                message: 'Required'
              }]
            })(<Select
              showSearch
              allowClear
              optionFilterProp="children"
              labelInValue
              filterOption={filterOption}
            >{listAccountOpt}
            </Select>)}
          </FormItem>
          <FormItem {...formItemLayout} label="Memo">
            {getFieldDecorator('memo', {
              initialValue: item.memo
            })(<Input
              onKeyDown={(e) => {
                if (e.keyCode === 13) {
                  handleClick()
                }
              }}
            />)}
          </FormItem>
        </Form>
      </Modal>
    )
  }
}

ModalList.propTypes = {
  form: PropTypes.isRequired,
  pos: PropTypes.isRequired,
  item: PropTypes.isRequired,
  onDelete: PropTypes.func.isRequired,
  modalPurchaseVisible: PropTypes.isRequired,
  modalType: PropTypes.string.isRequired,
  addModalItem: PropTypes.func.isRequired,
  editModalItem: PropTypes.func.isRequired
}
export default Form.create()(ModalList)
