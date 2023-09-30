import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Modal, Button, Select, Input, Form, Radio, InputNumber } from 'antd'
import { lstorage } from 'utils'

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
      item,
      onDelete,
      onCancel,
      modalItemType,
      form: { resetFields, getFieldDecorator, validateFields, getFieldsValue, getFieldValue },
      ...modalProps
    } = this.props
    const listAccountOpt = (listAccountCode || []).length > 0 ? listAccountCode.map(c => <Option value={c.id} title={`${c.accountName} (${c.accountCode})`}>{`${c.accountName} (${c.accountCode})`}</Option>) : []
    const handleClick = () => {
      validateFields((errors) => {
        if (errors) {
          return
        }
        const data = {
          id: item.id,
          storeId: lstorage.getCurrentUserStore(),
          ...getFieldsValue()
        }
        data.no = item.no
        if (modalItemType === 'add') {
          addModalItem(data)
        } else if (modalItemType === 'edit') {
          editModalItem(data)
        }
        resetFields()
      })
    }

    const modalOpts = {
      ...modalProps,
      onOk: handleClick,
      onCancel
    }

    return (
      <Modal
        {...modalOpts}
        footer={[
          <Button key="danger" onClick={() => onDelete(item.no)} type="danger" >Delete</Button>,
          <Button key="default" onClick={() => onCancel()} type="default" >Cancel</Button>,
          <Button key="primary" onClick={() => handleClick()} type="primary" >OK</Button>
        ]}
      >
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
            {getFieldDecorator('accountId', {
              initialValue: item.accountId,
              rules: [{
                required: true,
                message: 'Required'
              }]
            })(<Select
              showSearch
              allowClear
              placeholder="Choose Account Code"
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
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
