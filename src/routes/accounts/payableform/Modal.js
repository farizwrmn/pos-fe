import React from 'react'
import PropTypes from 'prop-types'
import { message, Modal, Select, Button, Input, Form, InputNumber } from 'antd'

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
  onCancel,
  onDelete,
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
      if (data.discount && data.discount.length > 0 ? (data.amount - data.discount[0] - data.discount[1] - data.discount[2]) < 0 : false) {
        message.error('Discount exceed amount')
        return
      }
      editModalItem(data)
      resetFields()
    })
  }

  const handleDelete = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...item,
        ...getFieldsValue()
      }
      data.discountAccountId = data.discountAccount && data.discountAccount.key ? data.discountAccount.key : null
      onDelete(data)
      resetFields()
    })
  }

  const modalOpts = {
    ...modalProps,
    onOk: handleClick
  }

  const filterOption = (input, option) => option.props.children.toLowerCase().indexOf(input.toString().toLowerCase()) >= 0

  return (
    <Modal {...modalOpts}
      onCancel={onCancel}
      footer={[
        <Button size="large" key="delete" type="danger" onClick={handleDelete}>Delete</Button>,
        <Button size="large" key="back" onClick={onCancel}>Cancel</Button>,
        <Button size="large" key="submit" type="primary" onClick={handleClick}>
          Ok
        </Button>
      ]}
    >
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
        <FormItem label="Disc Invoice 1 (N)" hasFeedback {...formItemLayout}>
          {getFieldDecorator('discount[0]', {
            initialValue: item.discount && item.discount[0] ? item.discount[0] : 0,
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
            />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="Discount Account 1">
          {getFieldDecorator('discountAccount[0]', {
            initialValue: item.discountAccount && item.discountAccount[0] ? {
              key: item.discountAccount[0].key,
              label: item.discountAccount[0].label
            } : undefined,
            rules: [{
              required: getFieldValue('discount[0]') !== 0,
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
        <FormItem label="Disc Invoice 2(N)" hasFeedback {...formItemLayout}>
          {getFieldDecorator('discount[1]', {
            initialValue: item.discount && item.discount[1] ? item.discount[1] : 0,
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
            />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="Discount Account 2">
          {getFieldDecorator('discountAccount[1]', {
            initialValue: item.discountAccount && item.discountAccount[1] ? {
              key: item.discountAccount[1].key,
              label: item.discountAccount[1].label
            } : undefined,
            rules: [{
              required: getFieldValue('discount[1]') !== 0,
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
        <FormItem label="Disc Invoice 3(N)" hasFeedback {...formItemLayout}>
          {getFieldDecorator('discount[2]', {
            initialValue: item.discount && item.discount[2] ? item.discount[2] : 0,
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
            />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="Discount Account 3">
          {getFieldDecorator('discountAccount[2]', {
            initialValue: item.discountAccount && item.discountAccount[2] ? {
              key: item.discountAccount[2].key,
              label: item.discountAccount[2].label
            } : undefined,
            rules: [{
              required: getFieldValue('discount[2]') !== 0,
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
