import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, Button, Select } from 'antd'
import { lstorage } from 'utils'

const FormItem = Form.Item
const { TextArea } = Input
const { Option } = Select

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 14 }
}

const ModalPayment = ({
  onOk,
  loading,
  data,
  form: { getFieldDecorator, validateFields, getFieldsValue, resetFields },
  listAccountCode,
  listAccountOpt = (listAccountCode || []).length > 0 ? listAccountCode.map(c => <Option value={c.id} key={c.id} title={`${c.accountName} (${c.accountCode})`}>{`${c.accountName} (${c.accountCode})`}</Option>) : [],
  selectedRowKeysLen,
  ...modalProps
}) => {
  const handleOk = () => {
    validateFields((errors) => {
      if (errors) return
      const record = {
        storeId: lstorage.getCurrentUserStore(),
        ...getFieldsValue()
      }
      Modal.confirm({
        title: `Confirm payment for ${selectedRowKeysLen} Voucher`,
        content: 'Are you sure ?',
        onOk () {
          onOk(record, resetFields)
        }
      })
    })
  }
  const modalOpts = {
    ...modalProps,
    onOk: handleOk
  }

  const filterOption = (input, option) => option.props.children.toLowerCase().indexOf(input.toString().toLowerCase()) >= 0

  return (
    <Modal {...modalOpts}
      footer={[
        <Button key="submit" onClick={() => handleOk()} disabled={loading.effects['voucherdetail/paymentVoucher']} type="primary" >Process</Button>
      ]}
    >
      <Form>
        <FormItem label="Payment Method" hasFeedback {...formItemLayout}>
          {getFieldDecorator('accountId', {
            rules: [{
              required: true,
              message: 'Required'
            }]
          })(<Select
            showSearch
            allowClear
            optionFilterProp="children"
            filterOption={filterOption}
          >{listAccountOpt}
          </Select>)}
        </FormItem>
        <FormItem label="Memo" {...formItemLayout}>
          {getFieldDecorator('description', {
            rules: [
              {
                required: true,
                pattern: /^[a-z0-9/\n _-]{20,100}$/i,
                message: 'At least 20 character'
              }
            ]
          })(<TextArea maxLength={255} autosize={{ minRows: 2, maxRows: 3 }} />)}
        </FormItem>
      </Form>
    </Modal>
  )
}

ModalPayment.propTypes = {
  form: PropTypes.object.isRequired,
  location: PropTypes.object,
  onOk: PropTypes.func,
  invoiceCancel: PropTypes.object
}

export default Form.create()(ModalPayment)
