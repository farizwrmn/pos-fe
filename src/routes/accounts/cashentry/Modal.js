import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Select, Input, Form, InputNumber } from 'antd'

const Option = Select.Option
const FormItem = Form.Item

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 }
}

const ModalList = ({
  addModalItem,
  listAccountCode,
  listAccountOpt = (listAccountCode || []).length > 0 ? listAccountCode.map(c => <Option value={c.id} key={c.id}>{`${c.accountName} (${c.accountCode})`}</Option>) : [],
  onDelete,
  showLov,
  item,
  inputType,
  form: { resetFields, getFieldDecorator, validateFields, getFieldsValue },
  ...modalProps }) => {
  const filterOption = (input, option) => option.props.children.toLowerCase().indexOf(input.toString().toLowerCase()) >= 0
  const handleClick = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = getFieldsValue()
      data.accountName = data.accountId.label
      data.accountId = data.accountId.key
      addModalItem(data)
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
            onFocus={() => showLov('accountCode')}
            onSearch={value => showLov('accountCode', { q: value, pageSize: 15 })}
            optionFilterProp="children"
            labelInValue
            filterOption={filterOption}
          >{listAccountOpt}
          </Select>)}
        </FormItem>
        {inputType === 'I' && <FormItem {...formItemLayout} label="Amount In">
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
        {inputType === 'E' && <FormItem {...formItemLayout} label="Amount Out">
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
        <FormItem {...formItemLayout} label="Description">
          {getFieldDecorator('description', {
            initialValue: item.description
          })(<Input />)}
        </FormItem>
      </Form>
    </Modal>
  )
}

ModalList.propTypes = {
  form: PropTypes.isRequired,
  pos: PropTypes.isRequired,
  item: PropTypes.isRequired,
  onDelete: PropTypes.func.isRequired,
  modalPurchaseVisible: PropTypes.isRequired
}
export default Form.create()(ModalList)
