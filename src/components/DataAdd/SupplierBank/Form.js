import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Form, Button, Select, Input } from 'antd'

const FormItem = Form.Item
const Option = Select.Option

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 }
}

const modal = ({
  dispatch,
  className,
  onRowClick,
  visible,
  supplierData,
  currentItem,
  supplierBank,
  listBank,
  form: {
    getFieldDecorator,
    getFieldsValue,
    validateFields
  },
  onSubmit,
  ...tableProps
}) => {
  const handleOk = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        supplierId: supplierData.supplierCode,
        ...getFieldsValue()
      }
      onSubmit(data)
    })
  }
  return (
    <Modal
      className={className}
      visible={visible}
      width="400px"
      height="50%"
      title={`Add Supplier ${supplierData.supplierName} Bank`}
      footer={[
        <Button key="submit" onClick={() => handleOk()} type="primary" >Ok</Button>
      ]}
      {...tableProps}
    >
      <Form>
        <FormItem label="Bank" hasFeedback {...formItemLayout}>
          {getFieldDecorator('bankId', {
            initialValue: currentItem.accountNo,
            rules: [
              {
                required: true,
                pattern: /^[a-z0-9-/.,_]+$/i,
                message: 'Required'
              }
            ]
          })(<Select style={{ width: '100%' }} min={0} maxLength={10}>
            {listBank.map(list => <Option value={list.id}>{`${list.bankName} (${list.bankCode})`}</Option>)}
          </Select>)}
        </FormItem>
        <FormItem label="Account No" hasFeedback {...formItemLayout}>
          {getFieldDecorator('accountNo', {
            initialValue: currentItem.accountNo,
            rules: [
              {
                required: true,
                pattern: /^[a-z0-9-/.,_]+$/i,
                message: 'Required'
              }
            ]
          })(<Input
            style={{ marginBottom: 16 }}
            maxLength={20}
          />)}
        </FormItem>
        <FormItem label="Account Name" hasFeedback {...formItemLayout}>
          {getFieldDecorator('accountName', {
            initialValue: currentItem.accountName,
            rules: [
              {
                required: true,
                pattern: /^[a-z0-9-/.,_]+$/i,
                message: 'Required'
              }
            ]
          })(<Input
            style={{ marginBottom: 16 }}
            maxLength={255}
          />)}
        </FormItem>
      </Form>
    </Modal>
  )
}

modal.propTypes = {
  form: PropTypes.object.isRequired,
  supplierBank: PropTypes.object.isRequired
}

export default Form.create()(modal)
