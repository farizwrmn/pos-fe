import { Modal, Form, Select, InputNumber, Button, Input, Switch } from 'antd'

const FormItem = Form.Item
const Option = Select.Option

const formItemProps = {
  labelCol: {
    xs: 10,
    sm: 10,
    md: 8,
    lg: 8,
    xl: 8
  },
  wrapperCol: {
    xs: 14,
    sm: 14,
    md: 16,
    lg: 16,
    xl: 16
  }
}

const ModalJournalDetail = ({
  selectedDetail,
  listAccountCodeLov,
  onCancel,
  onSubmit,
  onEdit,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue
  },
  ...modalProps
}) => {
  const filterOption = (input, option) => option.props.children.toLowerCase().indexOf(input.toString().toLowerCase()) >= 0
  const listAccountOpt = (listAccountCodeLov || []).length > 0 ? listAccountCodeLov.map(c => <Option value={c.id} key={c.id} title={`${c.accountName} (${c.accountCode})`}>{`${c.accountName} (${c.accountCode})`}</Option>) : []

  const handleSubmit = () => {
    validateFields((error) => {
      if (error) return error

      const data = {
        ...getFieldsValue()
      }

      const selectedAccount = listAccountCodeLov.find(item => item.id === data.accountId)

      if (!selectedDetail) {
        return onSubmit({
          accountId: data.accountId,
          accountName: selectedAccount ? `${selectedAccount.accountCode} - ${selectedAccount.accountName}` : 'Not Found!',
          amountIn: data.amountIn === true ? data.amount : null,
          amountOut: data.amountIn === false ? data.amount : null,
          description: data.description
        })
      }

      onEdit({
        id: selectedDetail.id,
        accountId: data.accountId,
        accountName: selectedAccount ? `${selectedAccount.accountCode} - ${selectedAccount.accountName}` : 'Not Found!',
        amountIn: data.amountIn === true ? data.amount : null,
        amountOut: data.amountIn === false ? data.amount : null,
        description: data.description
      })
    })
  }

  return (
    <Modal
      {...modalProps}
      closable={false}
      maskClosable={false}
      footer={[
        <Button type="ghost" onClick={onCancel}>Cancel</Button>,
        <Button type="primary" onClick={handleSubmit}>Add</Button>
      ]}
    >
      <Form>
        <FormItem label="Account" {...formItemProps}>
          {getFieldDecorator('accountId', {
            initialValue: selectedDetail ? selectedDetail.accountId : undefined,
            rules: [
              {
                required: true
              }
            ]
          })(
            <Select
              filterOption={filterOption}
              optionFilterProp="children"
              showSearch
              allowClear
              placeholder="Pilih Account"
            >
              {listAccountOpt}
            </Select>
          )}
        </FormItem>
        <FormItem label="Amount type" {...formItemProps}>
          {getFieldDecorator('amountIn', {
            valuePropName: 'checked',
            initialValue: selectedDetail ? selectedDetail.amountIn > 0 : true
          })(
            <Switch checkedChildren="IN" unCheckedChildren="OUT" />
          )}
        </FormItem>
        <FormItem label="Amount" {...formItemProps}>
          {getFieldDecorator('amount', {
            initialValue: selectedDetail
              ? (selectedDetail.amountIn > 0
                ? selectedDetail.amountIn
                : selectedDetail.amountOut)
              : undefined,
            rules: [
              {
                required: true
              }
            ]
          })(
            <InputNumber
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/\$\s?|(,*)/g, '')}
              style={{ width: '100%' }}
              placeholder="Input Amount"
            />
          )}
        </FormItem>
        <FormItem label="Desription" {...formItemProps}>
          {getFieldDecorator('description', {
            initialValue: selectedDetail ? selectedDetail.description : undefined,
            rules: [
              {
                required: true
              }
            ]
          })(
            <Input placeholder="Input Description" />
          )}
        </FormItem>
      </Form>
    </Modal>
  )
}

export default Form.create()(ModalJournalDetail)
