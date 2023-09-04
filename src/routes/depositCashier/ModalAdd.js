import { Button, DatePicker, Form, Modal } from 'antd'

const FormItem = Form.Item
const RangePicker = DatePicker.RangePicker

const formItemProps = {
  labelCol: {
    xs: 8,
    sm: 8,
    md: 6,
    lg: 6,
    xl: 6
  },
  wrapperCol: {
    xs: 16,
    sm: 16,
    md: 18,
    lg: 18,
    xl: 18
  }
}

const ModalAdd = ({
  loading,
  onCancel,
  onSubmit,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue
  },
  ...modalProps
}) => {
  const handleSubmit = () => {
    validateFields((error) => {
      if (error) return error

      const data = {
        ...getFieldsValue()
      }

      onSubmit(data)
    })
  }

  return (
    <Modal
      {...modalProps}
      title="Add new deposit"
      onCancel={onCancel}
      footer={[
        <Button type="ghost" onClick={onCancel} loading={loading.effects['depositCashier/add']} disabled={loading.effects['depositCashier/add']}>Cancel</Button>,
        <Button type="primary" onClick={handleSubmit} loading={loading.effects['depositCashier/add']} disabled={loading.effects['depositCashier/add']}>Create</Button>
      ]}
    >
      <Form layout="horizontal">
        <FormItem label="Transaction Date" {...formItemProps}>
          {getFieldDecorator('transDate', {
            rules: [
              {
                required: true,
                message: 'Required!'
              }
            ]
          })(
            <RangePicker />
          )}
        </FormItem>
      </Form>
    </Modal>
  )
}

export default Form.create()(ModalAdd)
