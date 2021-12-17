import React from 'react'
import { Modal, Select, InputNumber, Button, Input, Form } from 'antd'

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
  item,
  onOk,
  listAllStores,
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
          onOk(data, resetFields)
        }
      })
      // handleProductBrowse()
    })
  }

  const listAccount = listAccountCode.map(x => (<Option title={`${x.accountName} (${x.accountCode})`} value={x.id} key={x.id}>{`${x.accountName} (${x.accountCode})`}</Option>))

  const modalOpts = {
    ...modalProps,
    onOk: handleOk
  }

  const listStore = listAllStores.map(x => (<Option title={x.storeName} value={x.id} key={x.id}>{x.storeName}</Option>))

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
              placeholder="Choose StoreId"
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
              {listStore}
            </Select>
          )}
        </FormItem>
        <FormItem
          label="Account Code"
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
          {getFieldDecorator('adjust', {
            initialValue: item.expenseTotal,
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

        <FormItem label="Description" hasFeedback {...formItemLayout}>
          {getFieldDecorator('description', {
            initialValue: item.description,
            rules: [{
              required: false
            }]
          })(<TextArea maxLength={200} autosize={{ minRows: 2, maxRows: 6 }} />)}
        </FormItem>
      </Form>
    </Modal>
  )
}

export default Form.create()(ModalExpense)
