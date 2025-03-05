import { Form, Input, Modal, Select } from 'antd'
import { color } from 'utils/theme'

const FormItem = Form.Item
const Option = Select.Option

const ModalForm = ({
  currentBankMerchant,
  listBank,
  listStore,
  visible,
  onClose,
  addMerchant,
  editMerchant,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue
  }
}) => {
  const handleSubmit = () => {
    validateFields((error) => {
      if (error) {
        return error
      }
      const fields = getFieldsValue()
      if (currentBankMerchant && currentBankMerchant.id) {
        editMerchant({
          ...fields,
          id: currentBankMerchant.id
        })
      } else {
        addMerchant(fields)
      }
    })
  }

  const storeOpt = (listStore || []).map((record) => {
    return [
      <Option key={record.id} value={Number(record.id)}>{record.title}</Option>,
      ...(record.children || []).map(child => <Option key={child.id} value={Number(child.id)}>{`* ${child.title}`}</Option>)
    ]
  })

  const bankOpt = (listBank || []).map(record => <Option key={record.id} value={record.id}>{record.bankName}</Option>)

  return (
    <Modal
      visible={visible}
      onCancel={onClose}
      closable={false}
      maskClosable={false}
      onOk={handleSubmit}
    >
      <Form layout="vertical">
        <FormItem label="Merchant Id">
          {getFieldDecorator('merchantId', {
            initialValue: currentBankMerchant.merchantId || undefined,
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
        <FormItem label="Merchant Name">
          {getFieldDecorator('merchantName', {
            initialValue: currentBankMerchant.merchantName || undefined,
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
        <FormItem label="Assigned Store">
          {getFieldDecorator('storeId', {
            initialValue: Number(currentBankMerchant.storeId) || undefined,
            rules: [
              {
                required: true,
                message: '* Required'
              }
            ]
          })(
            <Select
              showSearch
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toString().toLowerCase()) >= 0}
              placeholder="Select Assigned Store"
            >
              {storeOpt}
            </Select>
          )}
        </FormItem>
        <FormItem label="Bank">
          {getFieldDecorator('bankId', {
            initialValue: currentBankMerchant.bankId || undefined,
            rules: [
              {
                required: true,
                message: '* Required'
              }
            ]
          })(
            <Select placeholder="Select Bank">
              {bankOpt}
            </Select>
          )}
        </FormItem>
      </Form>
      <div style={{ color: color.error, fontSize: '10px', marginTop: '10px' }}>* Merchant ID and Merchant Name harus merupakan data valid dari pihak bank</div>
    </Modal>
  )
}

export default Form.create()(ModalForm)
