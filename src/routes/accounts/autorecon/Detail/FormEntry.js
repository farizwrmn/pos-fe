import { Button, Form, Input, InputNumber, Modal, Radio, Select } from 'antd'

const FormItem = Form.Item
const Option = Select.Option
const RadioGroup = Radio.Group

const FormEntry = ({
  listAccountCode,
  currentLedgerEntry,
  visible,
  closeModal,
  onSubmit,
  onDelete,
  onCancel,
  form: {
    getFieldDecorator,
    getFieldsValue,
    validateFields,
    resetFields
  }
}) => {
  const filterOption = (input, option) => option.props.children.toLowerCase().indexOf(input.toString().toLowerCase()) >= 0
  const accountCodeOption = (listAccountCode || []).length > 0 ? listAccountCode.map(c => <Option value={c.id} key={c.id} title={`${c.accountName} (${c.accountCode})`}>{`${c.accountName} (${c.accountCode})`}</Option>) : []

  const handleSubmit = () => [
    validateFields((error) => {
      if (error) {
        return error
      }
      const fields = getFieldsValue()
      onSubmit({ data: { ...currentLedgerEntry, ...fields }, resetFields })
    })
  ]

  const handleDelete = () => {
    if (currentLedgerEntry && currentLedgerEntry.no) {
      onDelete(currentLedgerEntry.no)
    } else {
      onCancel()
    }
  }

  const showDeleteModal = () => [
    Modal.confirm({
      title: 'Delete this entry?',
      content: 'Are you sure?',
      onOk: handleDelete
    })
  ]

  return (
    <Modal
      visible={visible}
      onCancel={closeModal}
      closable={false}
      maskClosable={false}
      footer={[
        <Button type="danger" onClick={showDeleteModal}>
          Delete
        </Button>,
        <Button type="ghost" onClick={onCancel}>
          Cancel
        </Button>,
        <Button onClick={handleSubmit} type="primary">
          {currentLedgerEntry && currentLedgerEntry.no ? 'Update' : 'Entry'}
        </Button>
      ]}
    >
      <Form layout="vertical">
        <FormItem label="Account">
          {getFieldDecorator('accountId', {
            initialValue: currentLedgerEntry && currentLedgerEntry.no ? Number(currentLedgerEntry.accountId) : (listAccountCode && listAccountCode.length > 0 ? listAccountCode[0].id : undefined),
            rules: [{
              required: true,
              message: 'Required'
            }]
          })(
            <Select
              showSearch
              allowClear
              optionFilterProp="children"
              filterOption={filterOption}
            >
              {accountCodeOption}
            </Select>
          )}
        </FormItem>
        <FormItem label="Entry Type">
          {getFieldDecorator('entryType', {
            initialValue: currentLedgerEntry && currentLedgerEntry.no ? (currentLedgerEntry.debit !== undefined ? 0 : 1) : 0
          })(
            <RadioGroup>
              <Radio value={0}>Debit</Radio>
              <Radio value={1}>Credit</Radio>
            </RadioGroup>
          )}
        </FormItem>
        {getFieldsValue().entryType === 0 && (
          <FormItem label="Debit">
            {getFieldDecorator('debit', {
              initialValue: currentLedgerEntry && currentLedgerEntry.no ? currentLedgerEntry.debit : undefined,
              rules: [
                {
                  required: true,
                  pattern: /^([0-9.]{0,19})$/i,
                  message: 'Debit is not define'
                }, {
                  required: true,
                  message: '* Required'
                }
              ]
            })(
              <InputNumber min={0} style={{ width: '100%' }} />
            )}
          </FormItem>
        )}
        {getFieldsValue().entryType === 1 && (
          <FormItem label="Credit">
            {getFieldDecorator('credit', {
              initialValue: currentLedgerEntry && currentLedgerEntry.no ? currentLedgerEntry.credit : undefined,
              rules: [
                {
                  pattern: /^([0-9.]{0,19})$/i,
                  message: 'Credit is not define'
                }, {
                  required: true,
                  message: '* Required'
                }
              ]
            })(
              <InputNumber min={0} style={{ width: '100%' }} />
            )}
          </FormItem>
        )}
        <FormItem label="Description">
          {getFieldDecorator('description', {
            initialValue: currentLedgerEntry && currentLedgerEntry.no ? currentLedgerEntry.description : undefined,
            rules: [
              {
                required: true,
                message: '* Required'
              }
            ]
          })(
            <Input />
          )}
        </FormItem>
      </Form>
    </Modal>
  )
}

export default Form.create()(FormEntry)
