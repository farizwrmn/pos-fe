import React from 'react'
import { Modal, Select, InputNumber, Button, Input, Form } from 'antd'
import { decrypt } from 'utils/crypt'
import { getTotal } from './utils'

const { TextArea } = Input
const { Option } = Select
const FormItem = Form.Item

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 14 }
}

const ModalExpense = ({
  form: { getFieldDecorator, validateFields, getFieldsValue, resetFields },
  listAccountCode,
  listAccountCodeExpense,
  item,
  onOk,
  listAllStores,
  list,
  onCancel,
  ...modalProps
}) => {
  const handleOk = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }

      const data = {
        ...getFieldsValue()
      }
      Modal.confirm({
        title: 'Approve this item',
        content: 'Are you sure ?',
        onOk () {
          data.storeId = item.storeId
          if (data.storeId) {
            const filteredStore = listAllStores && listAllStores.filter(filtered => parseFloat(filtered.id) === parseFloat(data.storeId))
            if (filteredStore && filteredStore.length > 0) {
              data.storeName = filteredStore[0].label
            }
          }
          data.remain = getTotal(list)
          onOk(data, resetFields)
        }
      })
      // handleProductBrowse()
    })
  }

  const listAccount = listAccountCode.map(x => (<Option title={`${x.accountName} (${x.accountCode})`} value={x.id} key={x.id}>{`${x.accountName} (${x.accountCode})`}</Option>))
  const listAccountExpense = listAccountCodeExpense.map(x => (<Option title={`${x.accountName} (${x.accountCode})`} value={x.id} key={x.id}>{`${x.accountName} (${x.accountCode})`}</Option>))

  const modalOpts = {
    ...modalProps,
    onOk: handleOk
  }

  const listStoreTarget = localStorage.getItem('tStoreUser') ? JSON.parse(decrypt(localStorage.getItem('tStoreUser'))) : []
  const listStore = listAllStores.filter(filtered => listStoreTarget.includes(filtered.value)).map(x => (<Option title={x.label} value={x.value} key={x.value}>{x.label}</Option>))

  return (
    <Modal
      {...modalOpts}
      onCancel={onCancel}
      footer={[
        <Button size="large" key="back" onClick={onCancel}>Cancel</Button>,
        <Button size="large" key="submit" type="primary" onClick={handleOk}>
          Ok
        </Button>
      ]}
    >
      <Form layout="horizontal">
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
              style={{ width: '100%' }}
              showSearch
              placeholder="Choose Store"
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
              {listStore}
            </Select>
          )}
        </FormItem>
        <FormItem
          label="Bank (Debit)"
          hasFeedback
          {...formItemLayout}
        >
          {getFieldDecorator('expenseAccountId', {
            rules: [{
              required: true
            }]
          })(
            <Select
              showSearch
              size="large"
              style={{ width: '100%' }}
              placeholder="Choose Account Code"
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
              {listAccount}
            </Select>
          )}
        </FormItem>

        <FormItem label="Adjustment In" hasFeedback {...formItemLayout}>
          {getFieldDecorator('expenseTotal', {
            initialValue: 0,
            rules: [{
              required: true
            }]
          })(
            <InputNumber
              style={{ width: '100%' }}
              value={0}
              min={0}
              onKeyDown={(e) => {
                if (e.keyCode === 13) {
                  handleOk()
                }
              }}
            />
          )}
        </FormItem>

        <FormItem
          label="Adjustment Account (Credit)"
          hasFeedback
          {...formItemLayout}
        >
          {getFieldDecorator('adjustmentAccountId', {
            rules: [{
              required: true
            }]
          })(
            <Select
              showSearch
              size="large"
              style={{ width: '100%' }}
              placeholder="Choose Account Code"
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
              {listAccountExpense}
            </Select>
          )}
        </FormItem>

        <FormItem label="Description" hasFeedback {...formItemLayout}>
          {getFieldDecorator('description', {
            initialValue: item.description,
            rules: [{
              required: true
            }]
          })(<TextArea maxLength={200} autosize={{ minRows: 2, maxRows: 6 }} />)}
        </FormItem>
      </Form>
    </Modal>
  )
}

export default Form.create()(ModalExpense)
