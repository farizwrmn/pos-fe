import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Modal, Select, Input, Form, Radio, InputNumber, message } from 'antd'

const Option = Select.Option
const FormItem = Form.Item
const RadioGroup = Radio.Group

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 }
}

class ModalList extends Component {
  componentDidMount () {
    setTimeout(() => {
      const selector = document.getElementById('amountIn')
      if (selector) {
        selector.focus()
        selector.select()
      }
    }, 100)
  }

  render () {
    const {
      addModalItem,
      editModalItem,
      listAccountCode,
      listAccountOpt = (listAccountCode || []).length > 0 ? listAccountCode.map(c => <Option value={c.id} key={c.id} title={`${c.accountName} (${c.accountCode})`}>{`${c.accountName} (${c.accountCode})`}</Option>) : [],
      item,
      modalItemType,
      form: { resetFields, getFieldDecorator, validateFields, getFieldsValue, getFieldValue },
      ...modalProps
    } = this.props
    const filterOption = (input, option) => option.props.children.toLowerCase().indexOf(input.toString().toLowerCase()) >= 0
    const handleClick = () => {
      validateFields((errors) => {
        if (errors) {
          return
        }
        const data = {
          id: item.id,
          ...getFieldsValue()
        }
        data.no = item.no
        if (data.accountCode && data.accountCode.key) {
          data.accountCode = data.accountCode && data.accountCode.key ? data.accountCode : undefined
          data.accountId = data.accountCode && data.accountCode.key ? data.accountCode.key : undefined
          if (modalItemType === 'add') {
            addModalItem(data)
          } else if (modalItemType === 'edit') {
            editModalItem(data)
          }
          resetFields()
        } else {
          message.error('Choose Account Code')
        }
      })
    }

    const modalOpts = {
      ...modalProps,
      onOk: handleClick
    }

    return (
      <Modal {...modalOpts}>
        <Form>
          <FormItem {...formItemLayout} label="Entry Type">
            {getFieldDecorator('type', {
              initialValue: modalItemType === 'edit'
                ? (item.amountIn !== null ? 'I' : 'E')
                : (item.type || 'I'),
              rules: [{
                required: true,
                message: 'Required'
              }]
            })(
              <RadioGroup>
                <Radio value={'I'}>Debit</Radio>
                <Radio value={'E'}>Credit</Radio>
              </RadioGroup>
            )}
          </FormItem>
          {getFieldValue('type') === 'I' && <FormItem {...formItemLayout} label="Debit">
            {getFieldDecorator('amountIn', {
              initialValue: item.amountIn,
              rules: [{
                required: true,
                pattern: /^([0-9.]{0,19})$/i,
                message: 'Quantity is not define'
              }]
            })(<InputNumber
              min={0}
              max={9999999999999999999}
              style={{ width: '100%' }}
            />)}
          </FormItem>}
          {getFieldValue('type') === 'E' && <FormItem {...formItemLayout} label="Credit">
            {getFieldDecorator('amountOut', {
              initialValue: item.amountOut,
              rules: [{
                required: true,
                pattern: /^([0-9.]{0,19})$/i,
                message: 'Quantity is not define'
              }]
            })(<InputNumber
              min={0}
              max={9999999999999999999}
              style={{ width: '100%' }}
            />)}
          </FormItem>}
          <FormItem {...formItemLayout} label="Account Code">
            {getFieldDecorator('accountCode', {
              initialValue: item.accountCode ? {
                key: item.accountCode.key,
                label: item.accountCode.label
              } : { label: 'Choose Account Code' },
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
          <FormItem {...formItemLayout} label="Description">
            {getFieldDecorator('description', {
              initialValue: item.description,
              rules: [{
                required: true,
                message: 'Required'
              }]
            })(<Input />)}
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
