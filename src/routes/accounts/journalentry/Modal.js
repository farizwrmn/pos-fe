import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Modal, Select, Input, Form, Radio, InputNumber } from 'antd'

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
      listAccountOpt = (listAccountCode || []).length > 0 ? listAccountCode.map(c => <Option value={c.id} key={c.id}>{`${c.accountName} (${c.accountCode})`}</Option>) : [],
      onDelete,
      showLov,
      item,
      inputType = 'I',
      modalType,
      form: { resetFields, getFieldDecorator, validateFields, getFieldsValue, getFieldValue },
      ...modalProps
    } = this.props
    const filterOption = (input, option) => option.props.children.toLowerCase().indexOf(input.toString().toLowerCase()) >= 0
    const handleClick = () => {
      validateFields((errors) => {
        if (errors) {
          return
        }
        const data = getFieldsValue()
        data.no = item.no
        data.accountName = data.accountId.label
        data.accountId = data.accountId.key
        if (modalType === 'add') {
          addModalItem(data, inputType)
        } else if (modalType === 'edit') {
          editModalItem(data, inputType)
        }
        resetFields()
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
              initialValue: item.type || 'I',
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
            {getFieldDecorator('accountId', {
              initialValue: item.accountId,
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
              initialValue: item.description
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
