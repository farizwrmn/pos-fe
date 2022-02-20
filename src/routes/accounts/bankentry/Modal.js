import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button, Modal, Select, Input, Form, InputNumber, message } from 'antd'
import { lstorage } from 'utils'

const { getListUserStores } = lstorage

const Option = Select.Option
const FormItem = Form.Item

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 }
}

class ModalList extends Component {
  componentDidMount () {
    setTimeout(() => {
      const selector = document.getElementById('amountOut')
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
      listAccountOpt = (listAccountCode || []).length > 0 ? listAccountCode.map(c => <Option value={c.id} title={`${c.accountName} (${c.accountCode})`}>{`${c.accountName} (${c.accountCode})`}</Option>) : [],
      onDelete,
      showLov,
      item,
      modalItemType,
      form: { resetFields, getFieldDecorator, validateFields, getFieldsValue },
      onCancel,
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
        data.no = item.no
        if (data.accountId) {
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
      onOk: handleClick,
      onCancel
    }

    const listStoreId = getListUserStores()
    const Options = (listStoreId || []).length > 0 ? listStoreId.map(data => <Option value={data.value} key={data.value}>{data.label}</Option>) : []

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
          <FormItem label="Store" hasFeedback {...formItemLayout}>
            {getFieldDecorator('storeId', {
              initialValue: item.storeId ? item.storeId : lstorage.getCurrentUserStore(),
              rules: [
                {
                  required: true
                }
              ]
            })(<Select placeholder="Choose Store">
              {Options}
            </Select>)}
          </FormItem>
          <FormItem {...formItemLayout} label="Amount In">
            {getFieldDecorator('amountIn', {
              initialValue: item.amountIn,
              rules: [{
                required: true,
                pattern: /^([0-9.]{0,19})$/i,
                message: 'Amount is not define'
              }]
            })(<InputNumber

              min={0}
              max={9999999999}
              style={{ width: '100%' }}
            />)}
          </FormItem>
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
