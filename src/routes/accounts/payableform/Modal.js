import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Select, Input, Form, InputNumber } from 'antd'

const FormItem = Form.Item
const { Option } = Select

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 }
}

const ModalList = ({
  editModalItem,
  item,
  listAccountCode,
  listAccountOpt = (listAccountCode || []).length > 0 ? listAccountCode.map(c => <Option value={c.id} key={c.id} title={`${c.accountName} (${c.accountCode})`}>{`${c.accountName} (${c.accountCode})`}</Option>) : [],
  form: { resetFields, getFieldDecorator, validateFields, getFieldsValue, getFieldValue },
  ...modalProps }) => {
  const handleClick = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...item,
        ...getFieldsValue()
      }
      data.discountAccountId = data.discountAccount && data.discountAccount.key ? data.discountAccount.key : null
      editModalItem(data)
      resetFields()
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
        <FormItem {...formItemLayout} label="Amount In">
          {getFieldDecorator('amount', {
            initialValue: item.amount,
            rules: [{
              required: true,
              pattern: /^([0-9.]{0,19})$/i,
              message: 'Quantity is not define'
            }]
          })(<InputNumber
            min={0}
            max={item.paymentTotal}
            style={{ width: '100%' }}
          />)}
        </FormItem>
        <FormItem {...formItemLayout} label="Description">
          {getFieldDecorator('description', {
            initialValue: item.description
          })(<Input />)}
        </FormItem>
        <FormItem label="Disc Invoice(N)" hasFeedback {...formItemLayout}>
          {getFieldDecorator('discount', {
            initialValue: item.discount || 0,
            rules: [{
              required: true,
              pattern: /^([0-9.-]{0,19})$/i,
              message: 'Required'
            }]
          })(
            <InputNumber
              defaultValue={0}
              step={10000}
              max={item.amount}
              min={0}
            />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="Discount Account">
          {getFieldDecorator('discountAccount', {
            initialValue: item.discountAccount ? {
              key: item.discountAccount.key,
              label: item.discountAccount.label
            } : undefined,
            rules: [{
              required: getFieldValue('discount') > 0,
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
