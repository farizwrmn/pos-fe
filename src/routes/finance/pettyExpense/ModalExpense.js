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
  onCancel,
  loading,
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
          data.id = item.id
          data.storeId = item.storeId
          data.transId = item.transId
          data.accountId = item.pettyCash.accountId
          data.expenseTotal = item.expenseTotal
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
  return (
    <Modal
      {...modalOpts}
      title="Approval"
      onCancel={onCancel}
      footer={[
        <Button disabled={loading} size="large" key="back" onClick={onCancel}>Cancel</Button>,
        <Button disabled={loading} size="large" key="submit" type="primary" onClick={handleOk}>
          Ok
        </Button>
      ]}
    >
      <Form layout="horizontal">
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

        <FormItem label="Deposit" hasFeedback {...formItemLayout}>
          {getFieldDecorator('expenseTotal', {
            initialValue: item.expenseTotal,
            rules: [{
              required: true
            }]
          })(
            <InputNumber
              style={{ width: '100%' }}
              value={0}
              min={0}
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/\$\s?|(,*)/g, '')}
              onKeyDown={(e) => {
                if (e.keyCode === 13) {
                  handleOk()
                }
              }}
              disabled
            />
          )}
        </FormItem>

        {item.discount > 0 && <FormItem label="Discount" hasFeedback {...formItemLayout}>
          {getFieldDecorator('discount', {
            initialValue: item.discount,
            rules: [{
              required: true
            }]
          })(
            <InputNumber
              style={{ width: '100%' }}
              value={0}
              min={0}
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/\$\s?|(,*)/g, '')}
              onKeyDown={(e) => {
                if (e.keyCode === 13) {
                  handleOk()
                }
              }}
              disabled
            />
          )}
        </FormItem>}

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
